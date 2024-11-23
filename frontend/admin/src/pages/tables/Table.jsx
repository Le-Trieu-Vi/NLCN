import React, { useEffect, useState } from "react";
import api from "../../config/Api";
import { useNavigate, useLocation } from "react-router-dom";
import TableItem from "./TableItem";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import Loading from "../../components/Loading";

function Table() {
  const [tables, setTables] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTables = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }

      const params = new URLSearchParams(location.search);
      const statusParam = params.get("status") || "all";
      setStatus(statusParam);
      const response = await api.get(`/tables?status=${statusParam}`);
      setTables(response.data);
    } catch (error) {
      setError(error);
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, [location.search, status]);

  if (!tables) return <Loading />;

  return (
    <div>
      {error && <p>Error: {error.message}</p>}
      {tables.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-500">
          Không có bàn nào
        </p>
      ) : (
        <div className="bg-white min-h-[74vh]">
          <div className="mx-auto my-5 max-w-2xl px-4 sm:px-6 sm:py-14 lg:max-w-7xl lg:px-8">
            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 xl:gap-x-8">
              {tables.map((table) => (
                <TableItem key={table.id} table={table} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
