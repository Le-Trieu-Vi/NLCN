import React, { useEffect, useState } from "react";
import Helper from "../../utils/Helper";
import { useLocation, useNavigate } from "react-router-dom";
import DishService from "../../services/DishService";
import alertService from "../../services/AlertService";
import {
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

export default function ListDish({
  selectedCategoryId,
  onAddDish,
  dishUpdated,
  orderStatus,
}) {
  const [category, setCategory] = useState(null);
  const [quantities, setQuantities] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  const fetchDishes = async () => {
    try {
      const response = await DishService.fetchDishes(selectedCategoryId);
      setCategory(response);
    } catch (error) {
      console.error("Lỗi:", error);
      alertService.error("Lỗi khi lấy món ăn.");
    }
  };

  useEffect(() => {
    fetchDishes();
  }, [selectedCategoryId, dishUpdated]);

  useEffect(() => {
    if (category && category.dishes) {
      const initialQuantities = {};
      category.dishes.forEach((dish) => {
        initialQuantities[dish.id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [category]);

  const handleIncrease = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: (prevQuantities[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: Math.max(prevQuantities[id] - 1, 1),
    }));
  };

  const handleAddDish = (dish) => {
    if (orderStatus === "requested") {
      alertService.warning("Không thể thêm món vì đã yêu cầu thanh toán.");
      return;
    }

    const quantity = quantities[dish.id];
    onAddDish({ ...dish, quantity, id: dish.id });
    alertService.success("Món ăn đã được thêm.");

    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [dish.id]: 1,
    }));
  };

  const handleDeleteDish = async (dishId) => {
    alertService.confirm("Bạn có chắc chắn muốn xóa món ăn này?", async () => {
      try {
        await DishService.deleteDish(dishId);
        alertService.success("Món ăn đã được xóa.");
        fetchDishes();
      } catch (error) {
        alertService.error("Có lỗi xảy ra khi xóa món ăn.");
      }
    });
  };

  const showButtonAddDish = location.pathname.startsWith("/table");

  if (!category || !Array.isArray(category.dishes)) {
    return (
      <p className="mt-7 truncate text-md leading-5 text-gray-500 italic">
        Chưa chọn danh mục!
      </p>
    );
  }

  const dishes = category.dishes;

  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 min-h-[50vh] max-h-[50vh] overflow-y-auto"
    >
      {dishes.length === 0 && (
        <p className="mt-1 truncate text-md leading-5 text-gray-500 italic">
          Chưa có món ăn nào!
        </p>
      )}
      {dishes.map((dish) => (
        <React.Fragment key={dish.id}>
          <div className="hidden lg:block">
            <li className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 w-2/5 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={
                    dish.image
                      ? `/uploads/dishes/${dish.image}`
                      : "https://via.placeholder.com/256"
                  }
                  alt="Ảnh món ăn"
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {dish.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    {dish.description || "Không có mô tả"}
                  </p>
                </div>
              </div>
              <div className="flex w-1/5 items-center">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  Giá: {Helper.customPrice(dish.prices[0].price)}
                </p>
              </div>
              {showButtonAddDish ? (
                <>
                  <div className="flex w-1/5 justify-end">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700"
                        onClick={() => handleDecrease(dish.id)}
                      >
                        <span className="sr-only">Decrease quantity</span>
                        <span className="h-6 w-6">-</span>
                      </button>
                      <span className="mx-2">{quantities[dish.id]}</span>
                      <button
                        type="button"
                        className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700"
                        onClick={() => handleIncrease(dish.id)}
                      >
                        <span className="sr-only">Increase quantity</span>
                        <span className="h-6 w-6">+</span>
                      </button>
                    </div>
                  </div>
                  <div className="w-1/5 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center h-8 px-4 rounded-full bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => handleAddDish(dish)}
                      // disabled={orderStatus === "requested"}
                    >
                      Thêm
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-1/5 flex justify-end items-center">
                  <div className="btn-group flex items-center">
                    <button
                      onClick={() => navigate(`/dish/${dish.id}`)}
                      title="Chỉnh sửa"
                    >
                      <PencilSquareIcon className="h-6 w-6 mx-1 text-yellow-500 hover:text-yellow-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteDish(dish.id)}
                      title="Xóa"
                    >
                      <TrashIcon className="h-6 w-6 mx-1 text-red-500 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          </div>

          <div className="lg:hidden flex justify-between gap-x-6 py-5">
            <div className="flex w-3/5 gap-x-2">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src={
                  dish.image
                    ? `/uploads/dishes/${dish.image}`
                    : "https://via.placeholder.com/256"
                }
                alt="Ảnh món ăn"
              />
              <div className="min-w-0 flex-auto">
                <p className="text-xs font-semibold leading-6 text-gray-900">
                  {dish.name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {Helper.customPrice(dish.prices[0].price)}
                </p>
              </div>
            </div>
            <div className="flex w-1/5 flex-col items-end">
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700"
                  onClick={() => handleDecrease(dish.id)}
                >
                  <span className="sr-only">Decrease quantity</span>
                  <span className="h-6 w-6">-</span>
                </button>
                <span className="mx-2 text-sm">{quantities[dish.id]}</span>
                <button
                  type="button"
                  className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-500 hover:text-gray-700"
                  onClick={() => handleIncrease(dish.id)}
                >
                  <span className="sr-only">Increase quantity</span>
                  <span className="h-6 w-6">+</span>
                </button>
              </div>
            </div>
            <button
              type="button"
              className={`text-xs inline-flex items-center justify-center h-8 px-3 rounded-full ${
                orderStatus === "requested"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } w-1/5`}
              onClick={() => handleAddDish(dish)}
              disabled={orderStatus === "requested"}
            >
              Thêm
            </button>
          </div>
        </React.Fragment>
      ))}
    </ul>
  );
}
