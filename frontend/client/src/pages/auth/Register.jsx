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
    Button,
} from "@material-tailwind/react";

// Xác thực đầu vào
const validationSchema = Yup.object().shape({
    username: Yup.string().required("Yêu cầu nhập tên người dùng"),
    password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Yêu cầu nhập mật khẩu"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Yêu cầu nhập lại mật khẩu"),
    phone: Yup.string()
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, "Số điện thoại không hợp lệ")
        .nullable()
        .notRequired(),
    fullname: Yup.string().max(50, "Họ tên không được vượt quá 50 ký tự"),
    address: Yup.string().max(200, "Địa chỉ không được vượt quá 200 ký tự")
});

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (values) => {
        if (!values.phone) {
            values.phone = null;
        }
        try {
            const isSuccess = await AuthService.register(
                values.username,
                values.password,
                values.confirmPassword,
                values.phone,
                values.fullname,
                values.address
            );

            console.log(isSuccess);


            if (isSuccess) {
                alertService.success("Đăng ký thành công!");
                navigate("/login");
            } else {
                alertService.error(error.response.data.message);
            }
        } catch (error) {
            alertService.error(error.response.data.message);
        }
    };

    return (
        <Formik
            initialValues={{
                username: "",
                password: "",
                confirmPassword: "",
                phone: "",
                fullname: "",
                address: ""
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched }) => (
                <Form className="relative">
                    <Card className="w-96 top-16 mx-auto">
                        <CardHeader
                            variant="gradient"
                            color="gray"
                            className="mb-4 grid h-28 place-items-center"
                        >
                            <Typography variant="h3" color="white">
                                Đăng ký
                            </Typography>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-4">
                            <div>
                                <Field
                                    as={Input}
                                    label="Tên người dùng"
                                    size="lg"
                                    name="username"
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
                                    name="password"
                                    type={showPassword ? "text" : "password"}
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

                            <div>
                                <Field
                                    as={Input}
                                    label="Nhập lại mật khẩu"
                                    size="lg"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    error={errors.confirmPassword && touched.confirmPassword ? true : undefined}
                                    icon={
                                        showConfirmPassword ? (
                                            <EyeIcon
                                                onClick={() => setShowConfirmPassword(false)}
                                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                            />
                                        ) : (
                                            <EyeSlashIcon
                                                onClick={() => setShowConfirmPassword(true)}
                                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                            />
                                        )
                                    }
                                />
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    className="text-red-500 text-xs italic mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    as={Input}
                                    label="Số điện thoại"
                                    size="lg"
                                    name="phone"
                                    error={errors.phone && touched.phone ? true : undefined}
                                />
                                <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="text-red-500 text-xs italic mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    as={Input}
                                    label="Họ tên"
                                    size="lg"
                                    name="fullname"
                                    error={errors.fullname && touched.fullname ? true : undefined}
                                />
                                <ErrorMessage
                                    name="fullname"
                                    component="div"
                                    className="text-red-500 text-xs italic mt-1"
                                />
                            </div>

                            <div>
                                <Field
                                    as={Input}
                                    label="Địa chỉ"
                                    size="lg"
                                    name="address"
                                    error={errors.address && touched.address ? true : undefined}
                                />
                                <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-red-500 text-xs italic mt-1"
                                />
                            </div>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button variant="gradient" fullWidth type="submit">
                                Đăng ký
                            </Button>
                            <Typography variant="small" className="mt-6 flex justify-center">
                                Bạn đã có tài khoản?
                                <Typography
                                    as="a"
                                    href="/login"
                                    variant="small"
                                    color="blue-gray"
                                    className="ml-1 font-bold"
                                >
                                    Đăng nhập
                                </Typography>
                            </Typography>
                        </CardFooter>
                    </Card>
                </Form>
            )}
        </Formik>
    );
}
