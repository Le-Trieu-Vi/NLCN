import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import api from "../../config/Api"
import alertService from "../../services/AlertService";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

const ChangePassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu hiện tại không được để trống"),
    newPassword: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu mới không được để trống"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Xác nhận mật khẩu không khớp")
      .required("Xác nhận mật khẩu không được để trống"),
  });

  const handleChangePassword = async (values) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = values;
      await api.post(`/users/change-password/${id}`, {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      alertService.success("Đổi mật khẩu thành công");
      handleCancelPasswordChange();
    } catch (error) {
      console.log(error);
      alertService.error(error.response.data.message);
    }
  };

  const handleCancelPasswordChange = () => {
    navigate(-1);
  };

  return (
    <div className="lg:max-w-[30vw] mx-auto py-10 px-6 my-20 lg:my-10 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <button
          title="Trở lại"
          onClick={() => navigate(-1)}
          className="flex-none"
        >
          <ArrowLeftIcon className="h-6 w-6 mx-1" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold">Đổi mật khẩu</h1>
        </div>
        <div className="flex-none" style={{ width: "2rem" }}></div>
      </div>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={passwordValidationSchema}
        onSubmit={handleChangePassword}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4 md:space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="text-red-500 text-xs italic mt-1 absolute">
                  <ErrorMessage name="currentPassword" component="div" />
                </div>
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="text-red-500 text-xs italic mt-1 absolute">
                  <ErrorMessage name="newPassword" component="div" />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div className="text-red-500 text-xs italic mt-1 absolute">
                  <ErrorMessage name="confirmPassword" component="div" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Lưu
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChangePassword;
