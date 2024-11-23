import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import Helper from "../../utils/Helper";
import alertService from "../../services/AlertService";
import Loading from "../../components/Loading";
import {
  InformationCircleIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  ListBulletIcon,
} from "@heroicons/react/20/solid";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");
  const [statusFilter, setStatusFilter] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          alertService.error("Vui lòng đăng nhập!");
          navigate("/login");
          return;
        }
        const response = await api.get(`/orders`, {
          params: {
            sortBy: order ? sortBy : undefined,
            order,
            status: statusFilter || undefined,
            minQuantity: quantityFilter ? quantityFilter.min : undefined,
            maxQuantity: quantityFilter ? quantityFilter.max : undefined,
            minPrice: priceFilter ? priceFilter.min : undefined,
            maxPrice: priceFilter ? priceFilter.max : undefined,
          },
        });
        setOrders(response.data);
      } catch (error) {
        setError(error);
        alertService.error("Lỗi khi lấy danh sách đơn hàng");
      }
    };
    fetchOrders();
  }, [
    sortBy,
    order,
    statusFilter,
    quantityFilter,
    priceFilter,
    orders,
  ]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      if (order === "asc") {
        setOrder("desc");
      } else if (order === "desc") {
        setOrder("");
      } else {
        setOrder("asc");
      }
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortBy === field) {
      if (order === "asc") {
        return <BarsArrowDownIcon className="h-5 w-5" />;
      } else if (order === "desc") {
        return <BarsArrowUpIcon className="h-5 w-5" />;
      }
    }
    return <ListBulletIcon className="h-5 w-5" />;
  };

  if (!orders) return <Loading />;

  return (
    <div className="mx-auto py-10 min-h-96">
      <div className="flex items-center justify-end space-x-4 mb-4 me-10">
        <label className="mr-2">Lọc</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Tất cả</option>
          <option value="pending">Chưa thanh toán</option>
          <option value="completed">Đã thanh toán</option>
          <option value="requested">Yêu cầu thanh toán</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <input
          type="number"
          placeholder="Số lượng món tối thiểu"
          value={quantityFilter.min || ""}
          onChange={(e) =>
            setQuantityFilter({ ...quantityFilter, min: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Số lượng món tối đa"
          value={quantityFilter.max || ""}
          onChange={(e) =>
            setQuantityFilter({ ...quantityFilter, max: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Giá tối thiểu"
          value={priceFilter.min || ""}
          onChange={(e) =>
            setPriceFilter({ ...priceFilter, min: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1"
        />
        <input
          type="number"
          placeholder="Giá tối đa"
          value={priceFilter.max || ""}
          onChange={(e) =>
            setPriceFilter({ ...priceFilter, max: e.target.value })
          }
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>
      <div className="overflow-x-auto shadow-lg z-10 bg-white rounded-lg border border-gray-200 mx-4">
        {orders && orders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STT
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã đơn
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Ngày tạo
                  <button
                    onClick={() => handleSortChange("createdAt")}
                    className="mx-1"
                  >
                    {getSortIcon("createdAt")}
                  </button>
                </div>
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số bàn
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhân viên đặt
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng món
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  Giá
                  <button
                    onClick={() => handleSortChange("total")}
                    className="mx-1"
                  >
                    {getSortIcon("total")}
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{index + 1}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.id}</div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {Helper.getFormattedDate(order.createdAt)}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {order.status === "pending" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Chưa thanh toán
                      </span>
                    ) : order.status === "completed" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Đã thanh toán
                      </span>
                    ) : order.status === "requested" ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Yêu cầu thanh toán
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Đã hủy
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {order.table ? (
                      order.table.number
                    ) : (
                      <span className="text-blue-700">Đơn online</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {order.user.fullname || order.user.username}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-center text-gray-900">
                    {order.orderDetails.reduce((sum, orderDetail) => {
                      return sum + orderDetail.quantity;
                    }, 0)}
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <div className="text-sm text-right text-gray-900">
                    {order.total === 0 ? "" : Helper.customPrice(order.total)}
                  </div>
                </td>
                <td className="pe-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        ) : (
          <div className="text-center text-gray-500 py-5 min-h-[60vh] flex justify-center items-center">
            Không có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
