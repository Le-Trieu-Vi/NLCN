import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import alertService from "../../services/AlertService";
import AuthService from "../../services/AuthService";
import UserServices from "../../services/UserServices";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
    Textarea,
} from "@material-tailwind/react";

const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Vui lòng nhập họ tên"),
    username: Yup.string().required("Vui lòng nhập tên đăng nhập"),
    address: Yup.string().required("Vui lòng nhập địa chỉ"),
    phone: Yup.string().required("Vui lòng nhập số điện thoại"),
});

export default function UpdateUser() {
    const navigate = useNavigate();
    const userId = useParams().id;
    const [user, setUser] = useState({});
    const [previewImage, setPreviewImage] = useState(null);
    const [isFormModified, setIsFormModified] = useState(false);

    const fetchUser = async () => {
        try {
            if (!AuthService.isAuthenticated()) {
                alertService.error("Vui lòng đăng nhập!");
                navigate("/login");
                return;
            }
            const data = await AuthService.getUserInfo();
            setUser(data);
            if (data.avatar) {
                setPreviewImage(`http://localhost:3001/uploads/users/${data.avatar}`);
            } else {
                setPreviewImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            alertService.error("Lỗi khi lấy thông tin người dùng");
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const data = await UserServices.updateUser(
                values.fullname,
                values.username,
                values.address,
                values.phone,
                values.avatar,
                userId
            );
            if (!data) {
                return;
            }
            alertService.success("Cập nhật thông tin thành công");
            navigate(-1);
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    }
    return (
        <div className="w-[50vw] mx-auto my-5">
            <Card>
                <CardBody>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            fullname: user.fullname || "",
                            username: user.username || "",
                            address: user.address || "",
                            phone: user.phone || "",
                            avatar: null,
                        }}
                        validationSchema={validationSchema}
                        validateOnChange={true}
                        onSubmit={handleSubmit}
                        validate={(values) => {
                            const isModified =
                                values.fullname !== user.fullname ||
                                values.username !== user.username ||
                                values.address !== user.address ||
                                values.phone !== user.phone ||
                                !!values.avatar;
                            setIsFormModified(isModified);
                        }}
                    >
                        {({ errors, touched, setFieldValue }) => (
                            <Form>
                                <Card className="relative">
                                    <Typography variant="h3" color="orange" className="flex justify-center">
                                        Cập nhật thông tin
                                    </Typography>
                                    <CardBody className="flex flex-col gap-6">
                                        <div className="flex gap-6 items-start">
                                            <div className="flex-1">
                                                <div className="pb-5">
                                                    <Field
                                                        as={Input}
                                                        name="fullname"
                                                        label="Họ tên"
                                                        color="orange"
                                                        size="lg"
                                                        error={errors.fullname && touched.fullname ? true : undefined}
                                                    />
                                                    <ErrorMessage
                                                        name="fullname"
                                                        component="div"
                                                        className="text-red-500 text-xs italic mt-1"
                                                    />
                                                </div>

                                                <div className="pb-5">
                                                    <Field
                                                        as={Input}
                                                        name="username"
                                                        label="Tên đăng nhập"
                                                        size="lg"
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
                                                        name="phone"
                                                        label="Số điện thoại"
                                                        size="lg"
                                                        color="orange"
                                                        error={errors.phone && touched.phone ? true : undefined}
                                                    />
                                                    <ErrorMessage
                                                        name="phone"
                                                        component="div"
                                                        className="text-red-500 text-xs italic mt-1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center">
                                                {previewImage ? (
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                        className="h-32 w-32 rounded-full shadow-lg object-cover mb-2"
                                                    />
                                                ) : (
                                                    <div className="h-40 w-40 rounded-full bg-gray-200 flex items-center justify-center shadow-inner mb-4">
                                                        <span className="text-gray-500 text-sm">No Image</span>
                                                    </div>
                                                )}

                                                <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600">
                                                    Chọn ảnh
                                                    <input
                                                        className="hidden"
                                                        name="avatar"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(event) => {
                                                            const file = event.currentTarget.files[0];
                                                            setFieldValue("avatar", file);
                                                            setPreviewImage(URL.createObjectURL(file));
                                                        }}
                                                    />
                                                </label>
                                            </div>

                                        </div>

                                        <div>
                                            <Textarea
                                                name="address"
                                                label="Địa chỉ"
                                                color="orange"
                                                size="lg"
                                                error={errors.address && touched.address ? true : undefined}
                                            />
                                            <ErrorMessage
                                                name="address"
                                                component="div"
                                                className="text-red-500 text-xs italic mt-1"
                                            />
                                        </div>

                                        <CardFooter className="pt-0 flex">
                                            <Button
                                                variant="flat"
                                                onClick={() => navigate(-1)}
                                                color="red"
                                                className="mr-2"
                                            >
                                                Hủy
                                            </Button>
                                            <Button variant="gradient" type="submit" color="blue" disabled={!isFormModified}>
                                                Lưu
                                            </Button>
                                        </CardFooter>
                                    </CardBody>
                                </Card>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </div>
    );
}
