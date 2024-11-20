import React, { useEffect, useState } from "react";
import CategoryService from "../../services/CategoryService";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/20/solid";
import alertService from "../../services/AlertService";
import { useNavigate } from "react-router-dom";

export default function ListCategories({ onCategoryChange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await CategoryService.fetchCategories();
      setCategories(response);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [categories]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.id);
    onCategoryChange(category.id);
  };

  const handleDeleteCategory = async (categoryId) => {
    alertService.confirm(
      "Bạn có chắc chắn muốn xóa danh mục này?",
      async () => {
        try {
          await CategoryService.deleteCategory(categoryId);
          alertService.success("Danh mục đã được xóa.");
          fetchCategories();
        } catch (error) {
          alertService.error("Có lỗi xảy ra khi xóa danh mục.");
        }
      }
    );
  };

  if (!categories || categories.length === 0) {
    return <div>Chưa có danh mục món ăn</div>;
  }

  return (
    <ul role="list" className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
      {categories.map((category) => (
        <li
          key={category.id}
          className={`flex justify-between gap-x-6 py-5 cursor-pointer ${
            selectedCategory === category.id ? "bg-gray-200" : ""
          }`}
          onClick={() => handleCategoryChange(category)}
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              className="h-12 w-12 flex-none rounded-full bg-gray-50"
              src={
                category.image
                  ? `/uploads/categories/${category.image}`
                  : "https://via.placeholder.com/256"
              }
              alt="Ảnh danh mục"
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm font-semibold leading-6 text-gray-900">
                {category.name}
              </p>
              <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                {category.description || "Không có mô tả"}
              </p>
            </div>
          </div>

          <div className="btn-group flex items-center">
            <button
              onClick={() => navigate(`/category/${category.id}`)}
              title="Chỉnh sửa"
            >
              <PencilSquareIcon className="h-6 w-6 mx-1  text-yellow-500 hover:text-yellow-600" />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              title="Xóa"
            >
              <TrashIcon className="h-6 w-6 mx-1  text-red-500 hover:text-red-600" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
