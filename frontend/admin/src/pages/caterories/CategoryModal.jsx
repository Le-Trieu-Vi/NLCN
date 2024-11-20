import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../../config/Api";
import * as Yup from "yup";
import alertService from "../../services/AlertService";

const CategoryModal = ({ closeModalAddCategory, setCategories }) => {
  const [previewImage, setPreviewImage] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Tên danh mục không được để trống"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.image) {
      formData.append("image", values.image);
    }

    try {
      const response = await api.post(`/categories`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCategories((prevCategories) => [...prevCategories, response.data]);
      alertService.success("Thêm danh mục thành công.");
      closeModalAddCategory();
      resetForm();
      setPreviewImage(null);
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alertService.info("Danh mục món ăn đã tồn tại.");
      } else {
        alertService.error("Có lỗi xảy ra khi thêm danh mục.");
      }
      console.error("Lỗi:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 shadow-lg z-10 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">Thêm danh mục</h2>
        <Formik
          initialValues={{ name: "", description: "", image: null }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
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
                rows="3"
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
                    closeModalAddCategory();
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

export default CategoryModal;
