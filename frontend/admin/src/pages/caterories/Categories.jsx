import React, { useState } from "react";
import ListDish from "../dishes/ListDish";
import ListCategories from "./ListCategories";
import CategoryModal from "./CategoryModal";
import DishModal from "../dishes/DishModal";
import { PlusIcon } from "@heroicons/react/20/solid";

function Categories() {
  const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
  const [isModalOpenDish, setIsModalOpenDish] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishUpdated, setDishUpdated] = useState(false);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const openModalAddCategory = () => {
    setIsModalOpenCategory(true);
  };

  const closeModalAddCategory = () => {
    setIsModalOpenCategory(false);
  };

  const openModalAddDish = () => {
    setIsModalOpenDish(true);
  }

  const closeModalAddDish = () => {
    setIsModalOpenDish(false);
  }

  const handleDishAdded = () => {
    setDishUpdated(!dishUpdated);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 my-5">
        <div className="bg-white rounded-lg p-8 shadow-lg z-10 mx-4">
          <div className="flex justify-between mt-4 mb-2">
            <h2 className="text-xl font-semibold cursor-pointer text-left">
              Danh mục món ăn
            </h2>
            <button
              onClick={openModalAddCategory}
              className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Thêm danh mục
            </button>
          </div>
          <ListCategories onCategoryChange={handleCategoryChange} />
        </div>
        <div className="bg-white rounded-lg p-8 shadow-lg z-10 mx-4">
          <div className="flex justify-between mt-4 mb-2">
            <h2 className="text-xl font-semibold cursor-pointer text-left">
              Danh sách món ăn
            </h2>
            <button
              onClick={openModalAddDish}
              className="flex items-center justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Thêm món ăn
            </button>
          </div>
          <ListDish selectedCategoryId={selectedCategoryId} dishUpdated={dishUpdated}/>
        </div>
      </div>
      {isModalOpenCategory && (
        <CategoryModal
          closeModalAddCategory={closeModalAddCategory}
          setCategories={setCategories}
        />
      )}

      {isModalOpenDish && (
        <DishModal
          closeModalAddDish={closeModalAddDish}
          onDishAdded={handleDishAdded}
          onCategoryChange={handleCategoryChange}
        />
      )}
    </div>
  );
}

export default Categories;
