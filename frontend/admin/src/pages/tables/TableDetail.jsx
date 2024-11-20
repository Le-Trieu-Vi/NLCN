import React, { Fragment, useEffect, useState } from "react";
import api from "../../config/Api";
import { useParams, useNavigate } from "react-router-dom";
import MenuCategory from "../caterories/MenuCategory";
import ListDish from "../dishes/ListDish";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import Loading from "../../components/Loading";
import Helper from "../../utils/Helper";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  XMarkIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";

function TableDetail() {
  const { id } = useParams();
  const [table, setTable] = useState(null);
  const [error, setError] = useState(null);
  const [orderedItems, setOrderedItems] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [addDish, setAddDish] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [showOrderedItems, setShowOrderedItems] = useState(true);
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const navigate = useNavigate();

  const fetchTable = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/tables/${id}`);
      setTable(response.data);

      if (response.data.status === "unavailable") {
        const orderedItems = await response.data.orders;
        setOrderedItems(orderedItems);

        const dishes = orderedItems.flatMap((order) =>
          order.orderDetails.map((detail) => ({
            name: detail.dish.name,
            quantity: detail.quantity,
            price: detail.dish.prices[0].price,
            image: detail.dish.image,
          }))
        );

        const dishCount = dishes.reduce((acc, dish) => {
          if (!acc[dish.name]) {
            acc[dish.name] = { count: 0, price: dish.price, image: dish.image };
          }
          acc[dish.name].count += dish.quantity;
          return acc;
        }, {});

        const mergedDishes = Object.entries(dishCount).map(
          ([name, { count, price, image }]) => ({
            name,
            count,
            price,
            image,
          })
        );
        setDishes(mergedDishes);
      }
    } catch (error) {
      setError(error);
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [id, addDish]);

  const handleCategoryChange = (idCategory) => {
    setSelectedCategoryId(idCategory);
  };

  const handleAddDish = (dish) => {
    if (dish.id) {
      setAddDish((prev) => {
        const existingDish = prev.find((item) => item.id === dish.id);
        if (existingDish) {
          existingDish.quantity += dish.quantity;
          return [...prev];
        }
        return [...prev, dish];
      });
    } else {
      console.error("Dish is missing id:", dish);
    }
  };

  const toggleOrderedItems = () => {
    setShowOrderedItems((prev) => !prev);
  };

  const removeEventListener = (dishId) => {
    alertService.confirm("Bạn có chắc chắn muốn xóa món này?", () => {
      setAddDish((prev) => prev.filter((dish) => dish.id !== dishId));
      alertService.success("Món ăn đã được xóa.");
    });
  };

  const handleSubmitOrder = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error("Vui lòng đăng nhập!");
      }

      const userId = AuthService.getUserId();

      alertService.confirm("Bạn có chắc chắn muốn gửi món ăn?", async () => {
        if (table.status === "available") {
          await api.post(`/orders`, {
            userId: userId,
            tableId: table.id,
            total: addDish.reduce(
              (acc, dish) => acc + dish.prices[0].price * dish.quantity,
              0
            ),
            items: addDish.map((dish) => ({
              dishId: dish.id,
              quantity: dish.quantity,
              price: dish.price,
            })),
          });
        } else {
          await api.put(`/orders/${table.orders[0].id}`, {
            userId: userId,
            tableId: table.id,
            total: addDish.reduce(
              (acc, dish) => acc + dish.prices[0].price * dish.quantity,
              0
            ),
            items: addDish.map((dish) => ({
              dishId: dish.id,
              quantity: dish.quantity,
              price: dish.price,
            })),
          });
        }
        alertService.success("Đã gửi món ăn.");
        setAddDish([]);
      });
    } catch (error) {
      setError(error);
      alertService.error("Lỗi khi gửi món ăn.");
    }
  };

  const handleRequestPayment = async () => {
    alertService.confirm("Yêu cầu thanh toán?", async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          throw new Error("Vui lòng đăng nhập!");
        }

        const userId = AuthService.getUserId();

        await api.put(`/orders/${table.orders[0].id}`, {
          userId: userId,
          tableId: table.id,
          status: "requested",
        });
        alertService.success("Đã yêu cầu thanh toán.");
        fetchTable();
      } catch (error) {
        setError(error);
        alertService.error("Lỗi khi yêu cầu thanh toán.");
      }
    });
  };

  const toggleAddDishModal = () => {
    setShowAddDishModal(!showAddDishModal);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!table) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col">
      <div className="grid my-5">
        <div className="flex mt-2 justify-between items-center">
          <h1 className="text-2xl font-semibold ms-10">Bàn {table.number}</h1>
          <button
            className="bg-blue-500 text-white rounded-full p-2 mx-4 sm:hidden"
            onClick={toggleAddDishModal}
            disabled={table?.orders[0]?.status === "requested"}
          >
            <PlusIcon className="h-8 w-8" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-white rounded-lg p-8 shadow-lg z-10">
            {addDish.length > 0 && (
              <>
                <h2 className="text-xl font-semibold mt-4 mb-2 cursor-pointer w-full text-left">
                  Gọi thêm món
                </h2>
                <ul className="divide-y divide-gray-200 max-h-[40vh] overflow-y-auto">
                  {addDish.map((dish) => (
                    <li
                      key={dish.id}
                      className="flex justify-between items-center gap-x-6 py-5"
                    >
                      <div className="flex min-w-0 gap-x-4">
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
                          <p className="text-sm lg:text-base font-semibold leading-6 text-gray-900">
                            {dish.name}
                          </p>
                          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                            {Helper.customPrice(dish.prices[0].price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm lg:text-base sm:flex sm:flex-col sm:items-end">
                        <div className="flex items-center">
                          <span className="mx-2">
                            Số lượng: {dish.quantity}
                          </span>
                          <button
                            className="flex items-center"
                            onClick={() => removeEventListener(dish.id)}
                          >
                            <TrashIcon className="h-6 w-6 text-red-400 hover:text-red-600" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  className="bg-blue-500 text-white rounded-md px-4 py-2 mt-2 block ml-auto"
                  onClick={handleSubmitOrder}
                >
                  Gửi món
                </button>
              </>
            )}
            {orderedItems.length > 0 && (
              <div>
                <button
                  className="flex items-center w-full"
                  onClick={toggleOrderedItems}
                >
                  <h2 className="text-xl font-semibold mt-4 mb-2 cursor-pointer w-full text-left">
                    {showOrderedItems ? (
                      <Fragment>
                        Các món đã gọi{" "}
                        <ChevronDownIcon className="h-6 w-6 inline" />
                      </Fragment>
                    ) : (
                      <Fragment>
                        Các món đã gọi{" "}
                        <ChevronUpIcon className="h-6 w-6 inline" />
                      </Fragment>
                    )}
                  </h2>
                </button>
                {showOrderedItems && (
                  <>
                    <ul className="divide-y divide-gray-200 min-h-[50vh] max-h-[50vh] overflow-y-auto">
                      {dishes.map((dish) => (
                        <li
                          key={dish.name}
                          className="flex justify-between gap-x-6 py-5"
                        >
                          <div className="flex min-w-0 gap-x-4">
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
                              <p className="text-sm lg:text-base font-semibold leading-6 text-gray-900">
                                {dish.name}
                              </p>
                              <p className=" mt-1 truncate text-xs leading-5 text-gray-500">
                                {Helper.customPrice(dish.price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-sm lg:text-base sm:flex sm:flex-col sm:items-end">
                            <div className="flex items-center">
                              <span className="mx-2">
                                Số lượng: {dish.count}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {AuthService.isStaff() && (
                      <button
                        className={`${
                          table?.orders[0]?.status === "requested"
                            ? "bg-gray-400"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white rounded-md px-4 py-2 mt-2 ml-auto block`}
                        onClick={handleRequestPayment}
                        disabled={table?.orders[0]?.status === "requested"}
                      >
                        {table?.orders[0]?.status === "requested"
                          ? "Đã yêu cầu thanh toán"
                          : "Yêu cầu thanh toán"}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
            {orderedItems.length === 0 && addDish.length === 0 && (
              <p className="mt-1 truncate text-md leading-5 text-gray-500 italic min-h-[50vh]">
                Không có món nào được gọi
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg p-8 shadow-lg z-10 hidden lg:block">
            <div className="flex flex-wrap justify-between">
              <h2 className="text-xl font-semibold mt-4 mb-2">
                Danh sách món ăn
              </h2>
              <MenuCategory onCategoryChange={handleCategoryChange} />
            </div>
            {selectedCategoryId && (
              <div className="overflow-y-auto max-h-full]">
                <ListDish
                  selectedCategoryId={selectedCategoryId}
                  onAddDish={handleAddDish}
                  dishUpdated={addDish}
                  orderStatus={table?.orders[0]?.status} // Pass order status here
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {showAddDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-3 shadow-lg w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 relative min-h-[65vh]">
            <h2 className="text-xl font-semibold mb-4">Danh sách món ăn</h2>
            <button
              className="absolute top-4 right-4"
              onClick={toggleAddDishModal}
            >
              <XMarkIcon className="h-6 w-6 text-gray-700" />
            </button>
            <MenuCategory onCategoryChange={handleCategoryChange} />
            {selectedCategoryId && (
              <ListDish
                selectedCategoryId={selectedCategoryId}
                onAddDish={handleAddDish}
                dishUpdated={addDish}
                orderStatus={table?.orders[0]?.status} // Pass order status here
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TableDetail;
