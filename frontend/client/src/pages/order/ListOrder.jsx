import React, { useEffect, useState } from "react";
import {
    List,
    ListItem,
    ListItemSuffix,
    Chip,
    Card,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";

import { ClockIcon } from "@heroicons/react/24/outline";

import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "../../reducers/OrderSlice";

import OrderServices from "../../services/OrderServices";
import AuthService from "../../services/AuthService";
import Helper from "../../utils/Helper";
import ListOrderItems from "./ListOrderItems";

export default function ListOrder() {
    const [activeTab, setActiveTab] = useState("pending");
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const data = [
        { label: "Chờ xác nhận", value: "pending", color: "text-blue-600" },
        { label: "Đang giao", value: "shipping", color: "text-yellow-600" },
        { label: "Đã giao", value: "delivered", color: "text-green-600" },
        { label: "Đã hủy", value: "cancelled", color: "text-red-600" },
    ];

    const userId = AuthService.getId();
    const orders = useSelector((state) => state.orders.orders);
    
    const fetchOrder = async () => {
        setIsLoading(true);
        try {
            const data = await OrderServices.fetchOrder(userId);
            dispatch(setOrder(data));
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [activeTab]);

    const filteredOrders = orders.filter((order) => order.status === activeTab);

    const [selectedOrder, setSelectedOrder] = useState(null);
    useEffect(() => {
        if (filteredOrders.length > 0) {
            setSelectedOrder(filteredOrders[0]);
        } else {
            setSelectedOrder(null);
        }
    }, [activeTab, orders]);

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
    };

    return (
        <div className="flex flex-row m-5">
            <div className="basis-2/6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-5">Đơn hàng</h1>
                <div className="flex justify-center mb-5">
                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <TabsHeader
                            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                            indicatorProps={{
                                className:
                                    "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                            }}
                        >
                            {data.map(({ label, value, color }) => (
                                <Tab
                                    key={value}
                                    value={value}
                                    className={`text-sm ${color}`}
                                    onClick={() => setActiveTab(value)}
                                >
                                    {label}
                                </Tab>
                            ))}
                        </TabsHeader>
                        <TabsBody>
                            {data.map(({ value }) => (
                                <TabPanel key={value} value={value}>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <Card
                                                key={order.id}
                                                className={`w-full md:w-96 my-2 cursor-pointer ${
                                                    selectedOrder?.id === order.id
                                                        ? "border-l-4 border-green-500 bg-gray-100"
                                                        : "hover:bg-gray-50"
                                                }`}
                                                onClick={() => handleOrderSelect(order)}
                                            >
                                                <List>
                                                    <ListItem>
                                                        <div>
                                                            <h1 className="mb-1">
                                                                Mã đơn #{Helper.getShortId(order.id)}
                                                            </h1>
                                                            <p className="flex items-center text-xs text-gray-500">
                                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                                {Helper.getFormattedDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <ListItemSuffix>
                                                            <Chip
                                                                value={Helper.customPrice(order.total)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="rounded-full"
                                                            />
                                                        </ListItemSuffix>
                                                    </ListItem>
                                                </List>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 min-w-[30vw]">
                                            Không có đơn hàng.
                                        </p>
                                    )}
                                </TabPanel>
                            ))}
                        </TabsBody>
                    </Tabs>
                </div>
            </div>
            <div className="basis-4/6">
                <ListOrderItems listOrderItems={selectedOrder} />
            </div>
        </div>
    );
}
