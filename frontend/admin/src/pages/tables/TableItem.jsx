import React from "react";
import Bell from "../../components/Bell";
import AuthService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";

const TableItem = ({ table }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (table.orders[0]?.status === "requested" && AuthService.isCashier()) {
      navigate(`/payment/${table.orders[0].id}`);
    } else {
      navigate(`/table/${table.id}`);
    }
  };
  return (
    <div className="group relative">
      <button
        onClick={handleClick}
        className="block w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden group-hover:opacity-75"
      >
        <div className="absolute right-0 me-10 mt-2">
          {AuthService.isCashier() &&
            table.orders[0]?.status === "requested" && (
              <Bell ringing={table.orders[0].status === "requested"} />
            )}
        </div>
        <div
          className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-3xl lg:aspect-none group-hover:opacity-75 sm:min-h-48 min-h-40 flex items-center justify-center ${
            table.status === "unavailable" ? "bg-blue-300" : "outline-none bg-gray-200"
          }`}
        >
          <h1 className="self-center text-lg font-semibold">
            Bàn {table.number}
          </h1>
        </div>
      </button>
    </div>
  );
};

export default TableItem;
