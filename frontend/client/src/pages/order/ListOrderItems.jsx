import React, { useState, useEffect } from "react";

import { Card, CardBody, Button, Typography, PhoneIcon, List, ListItem, ListItemPrefix, Avatar } from "@material-tailwind/react";

import { useDispatch, useSelector } from "react-redux";
import { setStatus } from "../../reducers/OrderSlice";

import AuthService from "../../services/AuthService";
import OrderServices from "../../services/OrderServices";
import alertService from "../../services/AlertService";
import Helper from "../../utils/Helper";


export default function ListOrderItems({ listOrderItems }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const orderItems = useSelector((state) => state.orders.orders);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = AuthService.getId();
            const data = await AuthService.getUserInfo(userId);
            setUser(data);
            setIsLoading(false);
        };

        fetchUser();
    }, []);

    const handleCancelOrder = async (orderId) => {
        alertService.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?", async () => {
            try {
                await OrderServices.cancelOrder(orderId);
                alertService.success("Hủy đơn hàng thành công!");
                dispatch(setStatus({ orderId, newStatus: "cancelled" }));
            } catch (error) {
                alertService.error("Hủy đơn hàng thất bại!");
            }
        }
        );
    }

    return (
        <section className="container mx-auto py-20 px-8">
            <Typography variant="h4">Thông tin</Typography>
            <Card className="border border-gray-300 !rounded-md shadow-sm">
                <CardBody className="p-4 flex gap-4 flex-col md:flex-row items-center justify-between">
                    <div className="flex !justify-between w-full">
                        <div>
                            <Typography color="blue-gray" className="!font-semibold">
                                Họ tên
                            </Typography>
                            <Typography className="text-gray-600 font-normal">
                                {user?.fullname}
                            </Typography>
                        </div>
                        <div>
                            <Typography color="blue-gray" className="!font-semibold">
                                Địa chỉ
                            </Typography>
                            <Typography className="text-gray-600 font-normal">
                                {user?.address}
                            </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                            <div>
                                <Typography color="blue-gray" className="!font-semibold">
                                    Số điện thoại
                                </Typography>
                                <Typography className="text-gray-600 font-normal">
                                    {user?.phone}
                                </Typography>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>
            <Card className="w-full my-2">
                <List className="">
                    {listOrderItems ? (
                        <>
                            {listOrderItems.orderDetails
                                .map((item) => (
                                    <div key={item.id} className="py-4 border-b border-gray-200 last:border-b-0">
                                        <ListItem className="flex justify-between items-center">
                                            <label
                                                htmlFor={item.id}
                                                className="flex cursor-pointer items-center px-3 py-2"
                                            >
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

                                                </div>
                                            </label>
                                            <Typography color="gray" className="">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="mb-1 mr-3 font-semibold"
                                                >
                                                    x{item.quantity}
                                                </Typography>
                                            </Typography>
                                            <Typography>
                                                {Helper.customPrice(item.quantity * item.dish.prices[0].price)}
                                            </Typography>
                                        </ListItem>

                                    </div>
                                ))}
                            <div className="flex justify-between items-center">
                                <Typography variant="h5" color="blue-gray">
                                    Tổng cộng
                                </Typography>
                                <Typography variant="h5" color="blue-gray">
                                    {Helper.customPrice(listOrderItems.total)}
                                </Typography>
                            </div>
                        </>

                    ) : (
                        <div className="flex justify-center">
                            <Typography variant="h6" color="blue-gray" className="text-center font-normal italic">
                                Bạn chưa chọn đơn hàng nào
                            </Typography>
                        </div>
                    )}
                </List>
            </Card>

            {listOrderItems && (
                listOrderItems.status === "pending" && (
                    <Button
                        color="red"
                        buttonType="filled"
                        size="regular"
                        rounded={false}
                        block={false}
                        iconOnly={false}
                        ripple="light"
                        className="mt-4"
                        onClick={() => handleCancelOrder(listOrderItems.id)}
                    >
                        Hủy đơn hàng
                    </Button>
                )
            )}
        </section>
    );
}