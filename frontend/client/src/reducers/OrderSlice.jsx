import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "orders",
    initialState: {
        orders: [],
        status: "pending",
        isLoading: true,
        error: null,
    },
    reducers: {
        setStatus: (state, action) => {
            const { orderId, newStatus } = action.payload;
            const orderIndex = state.orders.findIndex((order) => order.id === orderId);
            if (orderIndex !== -1) {
                state.orders[orderIndex].status = newStatus;
            }
        },
        setOrder: (state, action) => {
            state.orders = action.payload;
        },
    },
});

export const { setStatus, setOrder } = orderSlice.actions;
export default orderSlice.reducer;