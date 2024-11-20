import React, { useEffect, useState } from "react";
import Helper from "../../utils/Helper";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

function OrderDetail() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/orders/${id}`);
      setOrderDetails(response.data.orderDetails);
    } catch (error) {
      console.error("Lỗi:", error);
      alertService.error("Lỗi khi lấy thông tin đơn hàng.");
    }
  };

  console.log(orderDetails);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useEffect(() => {
    const totalQuantity = orderDetails.reduce(
      (acc, orderDetail) => acc + orderDetail.quantity,
      0
    );
    const totalPrice = orderDetails.reduce(
      (acc, orderDetail) =>
        acc + orderDetail.dish.prices[0].price * orderDetail.quantity,
      0
    );
    setQuantity(totalQuantity);
    setTotal(totalPrice);
  }, [orderDetails]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-3xl">
        <div className="flex items-center mb-4">
          <button
            title="Trở lại"
            onClick={() => navigate(-1)}
            className="flex-none"
          >
            <ArrowLeftIcon className="h-6 w-6 mx-1" />
          </button>
          <div className="flex-grow text-center">
            <h2 className="text-2xl font-semibold">Chi tiết hóa đơn</h2>
          </div>
          <div className="flex-none" style={{ width: "2.25rem" }}></div>
        </div>

        <ul role="list" className="divide-y divide-gray-100">
          {orderDetails &&
            orderDetails.map((orderDetail) => (
              <li
                key={orderDetail.dishId}
                className="flex justify-between gap-x-6 py-5"
              >
                <div className="flex min-w-0 gap-x-4">
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={
                      orderDetail.dish.image
                        ? `/uploads/dishes/${orderDetail.dish.image}`
                        : "https://via.placeholder.com/256"
                    }
                    alt="Ảnh món ăn"
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {orderDetail.dish.name}
                    </p>
                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                      {orderDetail.dish.description || "Không có mô tả"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    Số lượng {orderDetail.quantity}
                  </p>
                </div>
                <div className="flex items-center">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    Giá:{" "}
                    {Helper.customPrice(
                      orderDetail.dish.prices[0].price * orderDetail.quantity
                    )}
                  </p>
                </div>
              </li>
            ))}
          {/* Kẻ đường gạch ngang */}
          <li className="flex justify-between py-5">
            <div className="flex items-center">
              <p className="text-base font-semibold leading-6 text-gray-900">
                Số lượng
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-base font-semibold leading-6 text-gray-900">
                {quantity}
              </p>
            </div>
          </li>
          <li className="flex justify-between">
            <div className="flex items-center">
              <p className="text-lg font-semibold leading-6 text-gray-900">
                Tổng cộng
              </p>
            </div>
            <div className="flex items-center">
              <p className="text-lg font-semibold leading-6 text-gray-900">
                {Helper.customPrice(total)}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default OrderDetail;
