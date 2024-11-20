import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Yêu cầu nhập tên người dùng"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Yêu cầu nhập mật khẩu"),
});

function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    try {
      const isSuccess = await AuthService.login(
        values.username,
        values.password
      );

      if (isSuccess) {
        alertService.success("Đăng nhập thành công!");
        if (AuthService.isAdmin()) {
          navigate("/table-manager");
        } else {
          navigate("/table");
        }
      } else {
        alertService.error("Sai tên đăng nhập hoặc mật khẩu.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      alertService.error("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.");
    }
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form className="space-y-4 md:space-y-6">
        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-md font-medium text-gray-900"
          >
            Tên người dùng
          </label>
          <Field
            type="text"
            name="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
            placeholder="Tên người dùng"
          />
          <ErrorMessage
            name="username"
            component="div"
            className="text-red-500 text-xs italic"
          />
        </div>
        <div>
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
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <Field
                type="checkbox"
                name="remember"
                id="remember"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="text-gray-500">
                Ghi nhớ đăng nhập
              </label>
            </div>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Đăng nhập
        </button>
      </Form>
    </Formik>
  );
}

export default LoginForm;
