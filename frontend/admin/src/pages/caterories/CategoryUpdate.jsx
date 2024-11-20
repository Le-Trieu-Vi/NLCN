import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function CategoryUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchCategory = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/categories/${id}`);
      setCategory(response.data);
      if (response.data.image) {
        setPreviewImage(`/uploads/categories/${response.data.image}`);
      }
    } catch (error) {
      alertService.error("Có lỗi xảy ra khi lấy thông tin danh mục.");
      console.log(error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên danh mục không được để trống"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();

    if(values.name !== category.name) {
      formData.append("name", values.name);
    }

    if(values.description !== category.description) {
      formData.append("description", values.description);
    }
    
    if (values.image) {
      formData.append("image", values.image);
    }
    try {
      const response = await api.put(
        `/categories/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCategory(response.data);
      alertService.success("Cập nhật danh mục thành công.");
      navigate("/categories");
      resetForm();
      setPreviewImage(null);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alertService.info("Danh mục món ăn đã tồn tại.");
      } else {
        alertService.error("Có lỗi xảy ra khi cập nhật danh mục.");
      }
      console.error("Lỗi:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white rounded-lg p-8 shadow-lg w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Chỉnh sửa danh mục
        </h1>
        <div className="mb-6">
          <Formik
            initialValues={{
              name: category ? category.name : "",
              description: category ? category.description : "",
              image: null,
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
                        <img src={previewImage} alt="Preview" className="h-40" />
                      </div>
                    ) : category && category.image ? (
                      <div className="mt-4">
                        <img
                          src={`/uploads/categories/${category.image}`}
                          alt="Preview"
                          className="h-40"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 text-gray-600">
                        Thêm ảnh mới
                      </div>
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
                    <label
                      htmlFor="name"
                      className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
                    >
                      Tên danh mục
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
                      placeholder="Tên danh mục"
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
                      placeholder="Mô tả"
                      rows={4}
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

export default CategoryUpdate;
