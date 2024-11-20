import { createSlice } from '@reduxjs/toolkit';

const counterCartItemsSlice = createSlice({
    name: 'counterCartItems',
    initialState: {
        totalItem: 0,
    },
    reducers: {
        increment: (state, action) => {
            state.totalItem += action.payload;
        },
        decrement: (state, action) => {
            state.totalItem -= action.payload;
        },
        setTotalItem: (state, action) => {
            state.totalItem = action.payload;
        },
    },
});

export const { increment, decrement, setTotalItem } = counterCartItemsSlice.actions;
export default counterCartItemsSlice.reducer;
