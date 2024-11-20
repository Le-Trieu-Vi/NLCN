import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { decrement } from "../../reducers/CounterCartItems";

import CartService from "../../services/CartService";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";

import InputCounterPlainButtons from "../../components/InputCouterPlainButtons";
import Loading from "../../components/Loading";
import Helper from "../../utils/Helper";
import { TrashIcon } from "@heroicons/react/24/solid";

import {
  Checkbox,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const dispatch = useDispatch();

  const userId = AuthService.getId();

  useEffect(() => {
    async function fetchCart() {
      const cart = await CartService.fetchCart(userId);
      setCart(cart);
    }

    fetchCart();
  }, []);

  const incrementQuantity = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

    setSelectedItems((prevSelected) =>
      prevSelected.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (itemId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );

    setSelectedItems((prevSelected) =>
      prevSelected.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };


  const toggleItemSelection = (itemId) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === itemId);
      if (isSelected) {
        return prevSelected.filter((item) => item.id !== itemId);
      } else {
        const item = cart.find((item) => item.id === itemId);
        return [...prevSelected, { id: item.id, quantity: item.quantity, dishId: item.dish.id }];
      }
    });
  };


  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          dishId: item.dish.id,
        }))
      );
    }
  };


  const totalPrice = cart
    ? cart.reduce(
      (total, item) =>
        selectedItems.some((selectedItem) => selectedItem.id === item.id)
          ? total + item.quantity * item.dish.prices[0].price
          : total,
      0
    )
    : 0;

  const deleteSelectedItems = () => {
    const ids = selectedItems.map((item) => item.id);
    const response = CartService.deleteMultipleItems(userId, ids);
    if (response) {
      setCart((prevCart) => prevCart.filter((item) => !ids.includes(item.id)));
      const quantity = selectedItems.reduce((total, item) => total + item.quantity, 0);
      dispatch(decrement(quantity));
      setSelectedItems([]);
    }
  };

  const handOrder = () => {
    const data = {
      userId,
      total: totalPrice,
      items: selectedItems.map((item) => ({
        dishId: item.dishId,
        quantity: item.quantity,
      })),
    };

    const response = CartService.orderItems(data);
    if (response) {
      const ids = selectedItems.map((item) => item.id);
      setCart((prevCart) => prevCart.filter((item) => !selectedItems.some((selectedItem) => selectedItem.id === item.id)));
      const quantity = selectedItems.reduce((total, item) => total + item.quantity, 0);
      dispatch(decrement(quantity));
      setSelectedItems([]);
      alertService.success("Đặt hàng thành công");
      CartService.deleteMultipleItems(userId, ids);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100">
      {cart ? (
        <div className="my-10">
          {cart.length > 0 && (
            <div className="flex justify-between">
              <div className="flex">
                <Checkbox
                  color="indigo"
                  ripple={false}
                  className="hover:before:opacity-0"
                  containerProps={{
                    className: "p-0",
                  }}
                  checked={selectedItems.length === cart.length}
                  onChange={toggleSelectAll}
                />
                <Typography variant="h6" color="blue-gray" className="ml-2">
                  Chọn tất cả
                </Typography>
              </div>
              <div>
                <button
                  className="flex items-center text-red-500 hover:text-red-600"
                  onClick={() => deleteSelectedItems()}
                >
                  <TrashIcon className="h-6 w-6 mr-2" />
                </button>
              </div>
            </div>
          )}
          <Card className="w-full my-2 min-h-80">
            <List className="">
              {cart.length > 0 ? (
                cart.map((item, index) => (
                  <div key={item.id} className="py-4 border-b border-gray-200 last:border-b-0">
                    <ListItem>
                      <label
                        htmlFor={item.id}
                        className="flex w-full cursor-pointer items-center px-3 py-2"
                      >
                        <ListItemPrefix className="mr-3">
                          <Checkbox
                            color="indigo"
                            id={item.id}
                            ripple={false}
                            className="hover:before:opacity-0"
                            containerProps={{
                              className: "p-0",
                            }}
                            checked={selectedItems.some((selectedItem) => selectedItem.id === item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                          />
                        </ListItemPrefix>
                        <ListItemPrefix>
                          <Avatar
                            variant="circular"
                            alt={item.dish.name}
                            src={
                              item.dish.image
                                ? `http://localhost:3001/uploads/dishes/${item.dish.image}`
                                : "https://via.placeholder.com/256"
                            }
                          />
                        </ListItemPrefix>
                        <div className="lg:w-96">
                          <Typography variant="h6" color="blue-gray">
                            {item.dish.name}
                          </Typography>
                          <Typography variant="small" color="gray" className="font-normal">
                            {Helper.customPrice(item.quantity * item.dish.prices[0].price)}
                          </Typography>
                        </div>
                      </label>
                      <Typography color="gray"  className="w-full flex justify-end items-center mt-2">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="mb-1 mr-3 font-semibold"
                        >
                          Số lượng
                        </Typography>
                        <InputCounterPlainButtons
                          itemId={item.id}
                          value={item.quantity}
                          onIncrement={() => incrementQuantity(item.id)}
                          onDecrement={() => decrementQuantity(item.id)}
                        />
                      </Typography>
                    </ListItem>

                  </div>
                ))
              ) : (
                <div className="flex justify-center mt-24">
                  <Typography variant="h6" color="blue-gray" className="text-center font-normal italic">
                    Không có sản phẩm nào trong giỏ hàng!
                  </Typography>
                </div>
              )}
            </List>
          </Card>
          {cart.length > 0 && selectedItems.length > 0 && (
            <div className="flex justify-between items-center mt-4 sticky bottom-0 z-10 bg-gray-200 h-20">
              <Typography variant="h6" color="blue-gray" className="m-5">
                Tổng thanh toán: {Helper.customPrice(totalPrice)}
              </Typography>
              <Button color="indigo" className="m-5" onClick={() => handOrder()}>
                Đặt hàng
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
