import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import CategoryService from "../../services/CategoryService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function DishUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [dish, setDish] = useState(null);
  const [error, setError] = useState(null);
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

  const fetchDish = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/dishes/${id}`);
      setDish(response.data);
      if (response.data.image) {
        setPreviewImage(`/uploads/dishes/${response.data.image}`);
      }
    } catch (error) {
      alertService.error("Có lỗi xảy ra khi lấy thông tin món ăn.");
      console.log(error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchDish();
  }, [id]);

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
    console.log(typeof values.price);
    if (values.name !== dish.name) {
      formData.append("name", values.name);
    }
    if (values.description !== dish.description) {
      formData.append("description", values.description);
    }
    if (values.image) {
      formData.append("image", values.image);
    }
    if (values.categoryId !== dish.categoryId) {
      formData.append("categoryId", values.categoryId);
    }
    if (dish.prices && dish.prices.length > 0 && values.price !== dish.prices[0]?.price) {
      formData.append("price", Number(values.price));
    }

    try {
      const response = await api.put(
        `/dishes/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setDish(response.data);
      alertService.success("Cập nhật món ăn thành công.");
      navigate("/category");
      resetForm();
      setPreviewImage(null);
    } catch (error) {
      alertService.error("Có lỗi xảy ra khi cập nhật món ăn.");
      console.error("Lỗi:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Chỉnh sửa món ăn
        </h1>
        <div className="mb-6">
          <Formik
            initialValues={{
              categoryId: dish ? dish.categoryId : "",
              name: dish ? dish.name : "",
              description: dish ? dish.description : "",
              image: null,
              price: dish ? dish.prices[0]?.price : 1,
            }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize={true}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="flex flex-col">
                <div className="flex mb-8">
                  <div className="w-1/3 flex flex-col items-center">
                    {previewImage ? (
                      <div className="mt-4">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="h-40"
                        />
                      </div>
                    ) : dish && dish.image ? (
                      <div className="mt-4">
                        <img
                          src={`/uploads/dishes/${dish.image}`}
                          alt="Preview"
                          className="h-40"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 text-gray-600">Thêm ảnh mới</div>
                    )}
                    <input
                      className="hidden"
                      id="file"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        setFieldValue("image", file);
                        setPreviewImage(URL.createObjectURL(file));
                      }}
                    />
                    <label
                      htmlFor="file"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 mt-4"
                    >
                      Chọn ảnh
                    </label>
                  </div>
                  <div className="w-2/3 pl-8">
                    <ErrorMessage
                      name="categoryId"
                      component="span"
                      className="block text-red-600 mt-1 italic"
                    />
                    <label>
                      <Field
                        as="select"
                        className="border border-current block w-full py-2 px-3 rounded-md mb-4"
                        name="categoryId"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
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
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md px-4 py-2 mx-3"
                    onClick={() => navigate(-1)}
                  >
                    Hủy
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mx-3 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Cập nhật
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default DishUpdate;
