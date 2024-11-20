import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../../config/Api";
import * as Yup from "yup";
import alertService from "../../services/AlertService";
import CategoryService from "../../services/CategoryService";

const DishModal = ({ closeModalAddDish, onCategoryChange, onDishAdded }) => {
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categories = await CategoryService.fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
        alertService.error("Lỗi khi lấy danh mục.");
      }
    }
    fetchCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    categoryId: Yup.string().required("Vui lòng chọn danh mục"),
    name: Yup.string().required("Tên món ăn không được để trống"),
    price: Yup.number()
      .typeError("Giá phải là số")
      .min(1, "Giá phải lớn hơn hoặc bằng 1")
      .required("Giá không được để trống"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("categoryId", values.categoryId);
    formData.append("price", values.price);

    if (values.image) {
      formData.append("image", values.image);
    }

    try {
      const response = await api.post(`/dishes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alertService.success("Thêm món ăn thành công.");
      closeModalAddDish();
      onCategoryChange(values.categoryId);
      onDishAdded();
      resetForm();
      setPreviewImage(null);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alertService.info("Món ăn đã tồn tại.");
      } else {
        alertService.error("Có lỗi xảy ra khi thêm món ăn.");
      }
      console.error("Lỗi:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 shadow-lg z-10 max-w-lg w-full mx-4 overflow-y-auto max-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Thêm món ăn</h2>
        <Formik
          initialValues={{
            categoryId: "",
            name: "",
            description: "",
            image: null,
            price: 1,
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <ErrorMessage
                name="categoryId"
                component="span"
                className="block text-red-600 mt-1 italic"
              />
              <label>
                <select
                  className="border border-current block w-full py-2 px-3 rounded-md mb-4"
                  name="categoryId"
                  onChange={(event) => {
                    setFieldValue("categoryId", event.currentTarget.value);
                  }}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      <img
                        src={
                          category.image
                            ? `${process.env.PUBLIC_URL}/uploads/categories/${category.image}`
                            : "https://via.placeholder.com/256"
                        }
                        alt="Ảnh danh mục"
                        className="h-5 w-5 flex-shrink-0 rounded-full"
                      />
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label
                htmlFor="name"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Tên món ăn
              </label>
              <ErrorMessage
                name="name"
                component="span"
                className="block text-red-600 mt-1 italic"
              />
              <Field
                className="border border-current block w-full py-2 px-3 rounded-md mb-4"
                name="name"
                type="text"
                placeholder="Tên món ăn"
              />
              <label
                htmlFor="price"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Giá
              </label>
              <ErrorMessage
                name="price"
                component="span"
                className="block text-red-600 mt-1 italic"
              />
              <Field
                className="border border-current block w-full py-2 px-3 rounded-md mb-4"
                name="price"
                type="number"
                placeholder="Giá"
              />
              <label
                htmlFor="description"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Mô tả
              </label>
              <ErrorMessage
                name="description"
                component="span"
                className="block text-red-600 mt-1 italic"
              />
              <Field
                className="border border-current block w-full py-2 px-3 rounded-md mb-4"
                name="description"
                as="textarea"
                rows="2"
                placeholder="Mô tả"
              />
              <ErrorMessage
                name="image"
                component="span"
                className="block text-red-600 mt-1 italic"
              />
              <input
                className="py-2 rounded-md mb-2"
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue("image", file);
                  setPreviewImage(URL.createObjectURL(file));
                }}
              />
              {previewImage && (
                <div className="mt-4">
                  <img src={previewImage} alt="Preview" className="h-40" />
                </div>
              )}
              <div className="flex gap-3 mt-7">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Thêm
                </button>
                <button
                  onClick={() => {
                    closeModalAddDish();
                    setPreviewImage(null);
                  }}
                  className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                  type="button"
                >
                  Đóng
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DishModal;
