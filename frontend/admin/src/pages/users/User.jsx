import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserServices from "../../services/UserService";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import SearchInput from "../../components/SearchInput";
import UserModal from "./UserModal";
import Loading from "../../components/Loading";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import Helper from "../../utils/Helper";

function User() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await UserServices.fetchUsers(
        search ? { search } : undefined
      );
      setUsers(response);
    } catch (error) {
      setError(error);
      alertService.error("Lỗi khi lấy danh sách người dùng");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleDeleteUser = async (userId) => {
    alertService.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này?",
      async () => {
        try {
          await UserServices.deleteUser(userId);
          alertService.success("Người dùng đã được xóa.");
          fetchUsers();
        } catch (error) {
          alertService.error("Có lỗi xảy ra khi xóa người dùng.");
        }
      }
    );
  };

  const openModalAddUser = () => {
    setIsModalOpen(true);
  };

  const closeModalAddUser = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
  };

  if (!users) return <Loading />;
  return (
    <div className="mx-auto py-6">
      <div className="flex justify-between mb-3 me-10">
        <SearchInput onSearch={handleSearch} />
        <button
          onClick={openModalAddUser}
          className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Thêm tài khoản
        </button>
      </div>
      {isModalOpen && (
        <UserModal closeModalAddUser={closeModalAddUser} setUsers={setUsers} />
      )}
      {users && users.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg z-10 mx-4 border border-gray-200 p-2 min-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã nhân viên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên đăng nhập
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className="px-4 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.username}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.fullname}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.role === "staff" ? "Nhân viên" : "Thu ngân"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {Helper.getFormattedDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap flex justify-center items-center">
                    <button
                      onClick={() => navigate(`/user/${user.id}`)}
                      title="Sửa"
                    >
                      <PencilSquareIcon className="h-6 w-6 mx-1 text-yellow-500 hover:text-yellow-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      title="Xóa"
                    >
                      <TrashIcon className="h-6 w-6 mx-1 text-red-500 hover:text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="min-h-80 mt-10 truncate text-md leading-5 text-gray-500 italic text-center">
          Không có người dùng nào
        </div>
      )}
    </div>
  );
}

export default User;
