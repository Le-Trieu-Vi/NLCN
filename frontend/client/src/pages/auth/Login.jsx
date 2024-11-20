import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
  Checkbox,
  Button,
} from "@material-tailwind/react";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Yêu cầu nhập tên người dùng"),
  password: Yup.string()
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .required("Yêu cầu nhập mật khẩu"),
});

export default function Login() {
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
        navigate("/");
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
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="relative">
          <Card className="w-96 top-16 mx-auto">
              <Typography variant="h3" color="orange" className="flex justify-center">
                Đăng nhập
              </Typography>
            <CardBody className="flex flex-col gap-4">
              <div>
                <Field
                  as={Input}
                  label="Tên người dùng"
                  size="lg"
                  name="username"
                  color="orange"
                  error={errors.username && touched.username ? true : undefined}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>

              <div>
                <Field
                  as={Input}
                  label="Mật khẩu"
                  size="lg"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  color="orange"
                  error={errors.password && touched.password ? true : undefined}
                  icon={
                    showPassword ? (
                      <EyeIcon
                        onClick={() => setShowPassword(false)}
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                      />
                    ) : (
                      <EyeSlashIcon
                        onClick={() => setShowPassword(true)}
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                      />
                    )
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-xs italic mt-1"
                />
              </div>

              <div className="-ml-2.5">
                <Checkbox label="Ghi nhớ mật khẩu" />
              </div>
            </CardBody>
            <CardFooter className="pt-0">
              <Button variant="gradient" fullWidth type="submit" color="orange">
                Đăng nhập
              </Button>
              <Typography variant="small" className="mt-6 flex justify-center">
                Bạn chưa có tài khoản?
                <Typography
                  as="a"
                  href="/register"
                  variant="small"
                  color="orange"
                  className="ml-1 font-bold"
                >
                  Đăng ký
                </Typography>
              </Typography>
            </CardFooter>
          </Card>
        </Form>
      )}
    </Formik>
  );
}
