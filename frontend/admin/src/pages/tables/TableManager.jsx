import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import TableModal from "./TableModal";
import TableEdit from "./TableEdit";
import Loading from "../../components/Loading";
import Helper from "../../utils/Helper";
import {
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

function TableManager() {
  const [tables, setTables] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTables = async () => {
    try {
      if (!AuthService.isAuthenticated) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get("/tables");
      setTables(response.data);
    } catch (error) {
      setError(error);
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [tables]);

  console.log(tables);

  const handleDeleteUser = async (tableId) => {
    alertService.confirm("Bạn có chắc chắn muốn xóa bàn này?", async () => {
      try {
        await api.delete(`/tables/${tableId}`);
        alertService.success("Bàn đã được xóa.");
        fetchTables();
      } catch (error) {
        alertService.error(error.response.data.message);
      }
    });
  };

  const openModalAddTable = () => {
    setIsModalOpen(true);
  };

  const closeModalAddTable = () => {
    setIsModalOpen(false);
  };

  const openModalEditTable = (id) => {
    setSelectedTableId(id);
    setIsModalEditOpen(true);
  };

  const closeModalEditTable = () => {
    setSelectedTableId(null);
    setIsModalEditOpen(false);
  };

  return (
    <div className="min-h-96 container mx-auto py-6">
      {tables ? (
        <>
          <div className="flex justify-end mb-3 me-10">
            <button
              onClick={openModalAddTable}
              className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Thêm bàn
            </button>
            {isModalOpen && (
              <TableModal
                closeModalAddTable={closeModalAddTable}
                setTables={setTables}
              />
            )}
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg z-10 mx-4 border border-gray-200 p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã bàn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số bàn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tables.map((table, index) => (
                  <tr key={table.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{index + 1}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{table.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Bàn {table.number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {table.status === "available" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Còn trống
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Đang sử dụng
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {Helper.getFormattedDate(table.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => openModalEditTable(table.id)}
                        title="Sửa"
                      >
                        <PencilSquareIcon className="h-6 w-6 mx-1 text-yellow-500 hover:text-yellow-600" />
                      </button>
                      {isModalEditOpen && selectedTableId === table.id && (
                        <TableEdit
                          closeModalEditTable={closeModalEditTable}
                          id={table.id}
                        />
                      )}
                      <button
                        onClick={() => handleDeleteUser(table.id)}
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
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}

export default TableManager;
