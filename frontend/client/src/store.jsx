import { configureStore } from '@reduxjs/toolkit';
import counterCartItemsReducer from './reducers/CounterCartItems';
import orderSlice from './reducers/OrderSlice';

const store = configureStore({
    reducer: {
        counterCartItems: counterCartItemsReducer,
        orders: orderSlice,
    },
});

export default store;
