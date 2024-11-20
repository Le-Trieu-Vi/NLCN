import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { increment } from "../../reducers/CounterCartItems";

import CateroryService from "../../services/CateroryService";
import CartService from "../../services/CartService";
import AuthService from "../../services/AuthService";
import alertSevice from "../../services/AlertService";
import Loading from "../../components/Loading";
import Helper from "../../utils/Helper";
import InputCounterPlainButtons from "../../components/InputCouterPlainButtons";
import { ShoppingCartIcon, PlusIcon, PlusCircleIcon } from '@heroicons/react/24/solid';


import ReadonlyRating from "../../components/Rating";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function Dish() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dishOfCategory, setDishOfCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const data = await CateroryService.fetchCategory();
    setCategories(data);

    if (data && data.length > 0) {
      setSelectedCategory(data[0].id);
      fetchDishOfCategory(data[0].id);
    } else {
      setLoading(false);
    }
  };

  const fetchDishOfCategory = async (id) => {
    setLoading(true);
    const data = await CateroryService.fetchCategoryById(id);
    setDishOfCategory(data.dishes);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex justify-center">
        {categories.map((category) => (
          <div>
            <div className={`border-2 rounded-full m-2 p-0 ${selectedCategory === category.id
              ? "border-deep-orange-600"
              : ""
              }`}>
              <div
                key={category.id}
                className="w-10 h-10 bg-gray-300 rounded-full m-1 hover:bg-gray-400 cursor-pointer"
                onClick={() => {
                  setSelectedCategory(category.id);
                  fetchDishOfCategory(category.id);
                }}
              >
                <img
                  src={
                    category.image
                      ? `http://localhost:3001/uploads/categories/${category.image}`
                      : "https://via.placeholder.com/256"
                  }
                  alt={category.name}
                  className="w-10 h-10 rounded-full"
                  title={`${category.name}`}
                />
              </div>
            </div>
            <p className="text-center text-xs text-gray-600">
              {category.name}
            </p>
          </div>
        ))}
      </div>
      <section className="bg-gray-2 pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[20px] px-10">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {dishOfCategory.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DishCard({ dish }) {
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();


  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = (dish) => {
    try {
      const userId = AuthService.getId();
      const data = {
        dishId: dish.id,
        quantity,
        userId,
      };
      CartService.addToCart(data);
      alertSevice.success("Thêm vào giỏ hàng thành công");
      dispatch(increment(quantity));
      setQuantity(1);
    } catch (error) {
      alertSevice.error("Lỗi khi thêm vào giỏ hàng");
    }
  }
  return (
    <Card className="shadow-md hover:shadow-2xl transition-shadow duration-300 rounded-3xl">
      <CardHeader shadow={false} floated={false} className="h-44">
        <img
          src={`http://localhost:3001/uploads/dishes/${dish.image}`}
          alt="dish-image"
          className="h-full w-full object-cover"
        />
      </CardHeader>
      <CardBody>
        <div className="flex items-center justify-between">
          <Typography color="blue-gray" className="font-semibold text-sm">
            {dish.name}
          </Typography>
          <Typography color="blue-gray" className="font-semibold text-sm">
            {Helper.customPrice(dish.prices[0].price)}
          </Typography>
        </div>
        <Typography color="gray" className="w-full mt-4 flex justify-between items-center">
          <InputCounterPlainButtons
            value={quantity}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
            <Button
              ripple={false}
              fullWidth={true}
              color="white"
              onClick={() => addToCart(dish)}
              className="z-10 shadow-none hover:scale-105 transition-transform text-xs p-2.5 mx-4 rounded-md text-deep-orange-600 border border-deep-orange-600 hover:bg-deep-orange-600 hover:text-white"
            >
              Thêm
            </Button>
        </Typography>
      </CardBody>
    </Card>
  );
}
