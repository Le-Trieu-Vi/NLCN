import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import alertService from "../../services/AlertService";
import api from "../../config/Api";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

const UserModal = ({ closeModalAddUser, setUsers }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Tên người dùng không được để trống"),
    password: Yup.string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Mật khẩu không được để trống"),
    fullname: Yup.string().required("Họ và tên không được để trống"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Xác nhận mật khẩu không khớp")
      .required("Xác nhận mật khẩu không được để trống"),
  });

  const handleSubmit = async (values) => {
    try {
      const response = await api.post("/users", values);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      alertService.success("Thêm người dùng thành công.");
      closeModalAddUser();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alertService.info("Người dùng đã tồn tại.");
      } else {
        alertService.error("Có lỗi xảy ra khi thêm người dùng.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 shadow-lg z-10 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">Thêm tài khoản</h2>
        <Formik
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
            fullname: "",
            role: "staff",
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form>
            <div className="mb-4">
              <label
                htmlFor="fullname"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Họ và tên
              </label>
              <Field
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                name="fullname"
                type="text"
                placeholder="Họ và tên"
              />
              <div className="text-red-500 text-xs italic mt-1">
                <ErrorMessage name="fullname" component="div" />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="username"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Tên đăng nhập
              </label>
              <Field
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                name="username"
                type="text"
                placeholder="Tên đăng nhập"
              />
              <div className="text-red-500 text-xs italic mt-1">
                <ErrorMessage name="username" component="div" />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block mb-2 text-md font-medium text-gray-900"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
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
                  <ErrorMessage name="password" component="div" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block mb-2 text-md font-medium text-gray-900"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Field
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
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

            <div className="mb-4">
              <label
                htmlFor="role"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Vai trò
              </label>
              <Field
                as="select"
                name="role"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
              >
                <option value="staff">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
                <option value="cashier">Thu ngân</option>
              </Field>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-indigo-500"
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={closeModalAddUser}
                className="bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-md hover:bg-gray-200"
              >
                Hủy
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default UserModal;
