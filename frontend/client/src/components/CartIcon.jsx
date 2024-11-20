import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setTotalItem } from '../reducers/CounterCartItems';

import AuthService from '../services/AuthService';
import CartService from '../services/CartService';

import { Badge } from '@material-tailwind/react';
import { ShoppingCartIcon } from '@heroicons/react/24/solid';

export default function Cart() {
    const userId = AuthService.getId();
    const dispatch = useDispatch();

    const totalItem = useSelector((state) => state.counterCartItems.totalItem);
    

    async function fetchCartData() {
        try {
            const cart = await CartService.fetchCart(userId);
            const total = CartService.getTotalItem(cart);

            dispatch(setTotalItem(total));
        } catch (error) {
            console.error('Error fetching cart data:', error);
        }
    }
    useEffect(() => {
        fetchCartData();
    }, []);

    return (
        <div className='cart-icon'>
            <div className="flex justify-center">
                <Badge content={totalItem} className="bg-gradient-to-tr border-2 border-white shadow-lg shadow-black/20">
                    <ShoppingCartIcon className="h-6 w-6 text-orange-500" />
                </Badge>
            </div>
        </div>
    );
}
