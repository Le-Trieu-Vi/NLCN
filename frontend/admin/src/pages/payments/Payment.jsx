import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Helper from "../../utils/Helper";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import jsPDF from "jspdf";
import RobotoRegular from "../../assets/fonts/Roboto-Regular.ttf";

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function PaymentPage() {
  const navigate = useNavigate();
  const [orderedItems, setOrderedItems] = useState([]);
  const { id } = useParams();
  const invoiceRef = useRef();

  const fetchOrderedItems = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/orders/${id}`);
      setOrderedItems(response.data);
    } catch (error) {
      console.log(error);
      alertService.error("Có lỗi xảy ra khi lấy thông tin bàn.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchOrderedItems();
    };
    fetchData();
  }, [id]);

  const calculateTotalQuantity = (orderDetails) => {
    return (
      orderDetails &&
      orderDetails.reduce((total, orderDetail) => {
        return total + orderDetail.quantity;
      }, 0)
    );
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();

    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }

      alertService.confirm("Bạn có chắc chắn muốn thanh toán?", async () => {
        try {
          await api.put(`/orders/${id}`, {
            status: "completed",
          });

          await api.put(`/tables/${orderedItems.tableId}`, {
            status: "available",
          });

          alertService.success("Thanh toán thành công!");
          navigate("/table");
        } catch (error) {
          alertService.error("Có lỗi xảy ra khi thanh toán.");
        }
      });
    } catch (error) {
      alertService.error("Có lỗi xảy ra khi thanh toán.");
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      const input = invoiceRef.current;
      if (!input) {
        throw new Error("Không tìm thấy nội dung để tạo hóa đơn.");
      }

      const pdf = new jsPDF({
        unit: "pt",
        orientation: "p",
        format: [500, 600],
      });

      const response = await fetch(RobotoRegular);
      const fontData = await response.arrayBuffer();
      const base64Font = arrayBufferToBase64(fontData);

      pdf.addFileToVFS("Roboto-Regular.ttf", base64Font);
      pdf.addFont("Roboto-Regular.ttf", "Roboto-Regular", "normal");
      pdf.setFont("Roboto-Regular", "normal");

      pdf.setFontSize(18);
      pdf.setTextColor(40);
      pdf.text("Nhà hàng Larana", pdf.internal.pageSize.getWidth() / 2, 30, {
        align: "center",
        fontStyle: "bold",
      });

      pdf.setFontSize(12);
      pdf.text(
        "Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ",
        pdf.internal.pageSize.getWidth() / 2,
        50,
        { align: "center" }
      );
      pdf.text(
        "Hotline: 0848790791",
        pdf.internal.pageSize.getWidth() / 2,
        65,
        { align: "center" }
      );

      pdf.setFontSize(14);
      pdf.setTextColor(40);
      pdf.text(
        "Hóa đơn thanh toán",
        pdf.internal.pageSize.getWidth() / 2,
        100,
        {
          align: "center",
          fontStyle: "bold",
        }
      );

      pdf.setFontSize(12);
      pdf.setTextColor(40);
      pdf.text(
        `${id}_${new Date().toLocaleDateString()}`,
        pdf.internal.pageSize.getWidth() / 2,
        115,
        { align: "center" }
      );

      pdf.setFontSize(12);
      pdf.text(
        `Số bàn: ${orderedItems.table.number}`,
        pdf.internal.pageSize.getWidth() - 50,
        135,
        { align: "right" }
      );

      pdf.setFontSize(12);
      pdf.text(`Nhân viên PV: ${orderedItems.user.fullname}`, 50, 155);
      pdf.text("Khách hàng: Khách lẻ", 50, 170);

      pdf.line(50, 180, 450, 180);

      pdf.setFontSize(12);
      pdf.text("Tên món", 50, 195);
      pdf.text("Đơn giá", 230, 195, { align: "center" });
      pdf.text("Số lượng", 320, 195, { align: "center" });
      pdf.text("Thành tiền", 450, 195, { align: "right" });

      pdf.line(50, 200, 450, 200);

      let startY = 220;

      orderedItems.orderDetails.forEach((orderDetail, index) => {
        pdf.setFontSize(12);
        pdf.text(`${orderDetail.dish.name}`, 50, startY);
        pdf.text(
          `${Helper.customPrice(orderDetail.dish.prices[0].price)}`,
          260,
          startY,
          { align: "right" }
        );
        pdf.text(`${orderDetail.quantity}`, 320, startY, { align: "center" });
        pdf.text(
          `${Helper.customPrice(
            orderDetail.dish.prices[0].price * orderDetail.quantity
          )}`,
          450,
          startY,
          { align: "right" }
        );
        startY += 20;
      });

      pdf.line(50, startY, 450, startY);

      pdf.setFontSize(13);
      pdf.text("Tổng số lượng:", 50, startY + 20);
      pdf.text(
        `${calculateTotalQuantity(orderedItems.orderDetails)}`,
        450,
        startY + 20,
        { align: "right" }
      );
      pdf.text("Tổng thanh toán:", 50, startY + 40);
      pdf.text(`${Helper.customPrice(orderedItems.total)}`, 450, startY + 40, {
        align: "right",
      });

      const remainingHeight =
        pdf.internal.pageSize.getHeight() - 40 - (startY + 40);

      pdf.setFontSize(10);
      pdf.text(
        "Hóa đơn có giá trị trong ngày!",
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - remainingHeight,
        { align: "center" }
      );
      pdf.text(
        "Nhà hàng Larana xin cảm ơn và hẹn gặp lại",
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - remainingHeight + 20,
        { align: "center" }
      );

      const fileName = `${id}_${new Date().toLocaleDateString()}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn PDF:", error);
      alertService.error("Có lỗi xảy ra khi tạo hóa đơn PDF.");
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-100 flex flex-col items-center py-10 px-4">
      <div className="bg-white rounded-lg p-3 lg:p-6 shadow-lg w-full max-w-3xl">
        <div className="flex items-center mb-4">
          <button title="Trở lại" onClick={() => navigate(-1)}>
            <ArrowLeftIcon className="h-6 w-6 mx-1" />
          </button>
          <div className="flex-grow text-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-center">
              Hóa đơn thanh toán
            </h1>
          </div>
        </div>
        <div className="mb-6" ref={invoiceRef}>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {orderedItems &&
                orderedItems.orderDetails &&
                orderedItems.orderDetails.map((orderDetail, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-2"
                  >
                    <div className="min-w-0 flex-auto">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 flex-none rounded-full bg-gray-50"
                          src={
                            orderDetail
                              ? `/uploads/dishes/${orderDetail.dish.image}`
                              : "https://via.placeholder.com/256"
                          }
                          alt="Ảnh món ăn"
                        />
                        <div className="ml-2">
                          <p className="text-sm font-semibold leading-6 text-gray-900">
                            {orderDetail.dish.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Đơn giá:{" "}
                            {Helper.customPrice(
                              orderDetail.dish.prices[0].price
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right w-1/5">
                      <div className="flex flex-col">
                        <span className="text-sm">
                          Số lượng: {orderDetail.quantity}
                        </span>
                        <span className="text-sm">
                          Thành tiền:{" "}
                          {Helper.customPrice(
                            orderDetail.dish.prices[0].price *
                              orderDetail.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              <li className="flex justify-between items-center py-2">
                <div className="text-left w-4/5">
                  <p className="text-base leading-6 text-gray-900 mr-3">
                    Tổng số lượng
                  </p>
                  <p className="text-lg leading-6 text-gray-900 mr-3">
                    Tổng thanh toán
                  </p>
                </div>
                <div className="text-right w-1/5">
                  <p className="text-base text-gray-900">
                    {calculateTotalQuantity(orderedItems.orderDetails)}
                  </p>
                  <p className="text-lg text-gray-900">
                    {Helper.customPrice(orderedItems.total)}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-400 text-white rounded-md px-4 py-2 mt-4 sm:mt-0"
            >
              Thanh toán
            </button>
            <button
              type="button"
              onClick={handleGenerateInvoice}
              className="bg-green-500 hover:bg-green-400 text-white rounded-md px-4 py-2 mt-4 sm:mt-0"
            >
              Xuất hóa đơn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentPage;
