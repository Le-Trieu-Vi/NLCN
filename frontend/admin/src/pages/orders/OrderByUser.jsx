import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import Helper from "../../utils/Helper";
import alertService from "../../services/AlertService";

const OrderByUser = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/orders/user/${id}`);
      setOrders(response.data);
    } catch (error) {
      setError(error);
      alertService.error("Lỗi khi lấy danh sách đơn hàng");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [id]);

  return (
    <div className="min-h-screen h-full bg-white flex  items-center justify-center py-10">
      <div className="lg:min-w-[1022px] xl:min-w-[1230px] 2xl:min-w-[1530px]">
        <div className="w-full  px-2 max-w-[453px] mx-auto">
          <h1 className="text-xl sm:text-2xl font-medium mb-2 lg:text-center">
            Lịch sử đặt hàng
          </h1>
        </div>
        <div class="flex items-center justify-center">
          <table class="sm:inline-table w-full flex flex-row sm:bg-white  overflow-hidden ">
            <thead class="text-black">
              {orders?.map((order, index) => (
                <tr
                  class={`bg-[#222E3A]/[6%] flex flex-col sm:table-row rounded-l-lg sm:rounded-none mb-5 sm:mb-0 ${
                    index == 0 ? "sm:flex" : "sm:hidden"
                  }`}
                  key={order.id}
                >
                  <th class="py-3 px-5 text-left border border-b rounded-tl-lg sm:rounded-none">
                    Mã đơn
                  </th>
                  <th class="py-3 px-5 text-left border border-b">Ngày đặt</th>
                  <th class="py-3 px-5 text-left border border-b">
                    Trạng thái
                  </th>
                  <th class="py-3 px-5 text-left border border-b">Bàn</th>
                  <th class="py-3 px-5 text-left border border-t rounded-bl-lg sm:rounded-none">
                    Giá
                  </th>
                </tr>
              ))}
            </thead>
            {console.log(orders)}
            <tbody class="flex-1 sm:flex-none">
              {orders?.map((order, index) => (
                <tr
                  class="flex flex-col sm:table-row mb-5 sm:mb-0"
                  key={order?.id}
                >
                  <td class="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5 rounded-tr-lg sm:rounded-none">
                    {order.id.slice(-15)}
                  </td>
                  <td class="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5">
                    {Helper.getFormattedDate(order?.createdAt)}
                  </td>
                  <td class="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5">
                    {order.status === "pending" ? (
                      <span className="px-2 inline-flex  leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Chưa thanh toán
                      </span>
                    ) : order.status === "completed" ? (
                      <span className="px-2 inline-flex  leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Đã thanh toán
                      </span>
                    ) : (
                      <span className="px-2 inline-flex  leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Đã hủy
                      </span>
                    )}
                  </td>
                  <td class="border hover:bg-[#222E3A]/[6%] hover:sm:bg-transparent py-3 px-5">
                    {order?.table.number}
                  </td>
                  <td class="border hover:bg-[#222E3A]/[6%]  hover:sm:bg-transparent py-3 px-5 rounded-br-lg sm:rounded-none">
                    {Helper.customPrice(order?.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default OrderByUser;
