import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


import { ChevronRightIcon } from "@heroicons/react/24/solid";

import { useDispatch, useSelector } from "react-redux";

// import { setUser } from "../../reducers/AuthSlice";

import AuthService from "../../services/AuthService";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

export default function Profile() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const data = await AuthService.getUserInfo();
      setUser(data);
    } catch (error) {
      setError(error);
      alertService.error("Lỗi khi lấy thông tin người dùng");
    }
  };

    useEffect(() => {
        fetchUser();
    }, []);
    console.log(user.avatar);
    

    return (
        <div className="w-[50vw] mx-auto my-5">
            <Card>
                <CardBody>
                    <div className="flex flex-col items-center">
                        <img
                            src={
                                user.avatar ? `http://localhost:3001/uploads/users/${user.avatar}` : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                            }
                            alt="profile"
                            className="w-32 h-32 rounded-full"
                        />
                        <Typography color="gray">{user.fullname}</Typography>
                    </div>
                    <div className="flex flex-col mt-4">
                        <Typography color="gray">
                            <span className="font-bold">
                                Tên đăng nhập
                            </span>
                        </Typography>
                        <Typography color="gray">{user.username}</Typography>
                    </div>
                    <div className="flex flex-col mt-4">
                        <Typography color="gray">
                            <span className="font-bold">
                                Địa chỉ
                            </span>
                        </Typography>
                        <Typography color="gray">{user.address}</Typography>
                    </div>
                    <div className="flex flex-col mt-4">
                        <Typography color="gray">
                            <span className="font-bold">
                                Số điện thoại
                            </span>
                        <Typography color="gray">{user.phone}</Typography>
                        </Typography>
                    </div>
                </CardBody>
                <CardFooter>
                    <div className="flex items-center justify-between">
                        {isEditing ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    disabled={isSubmitting}
                                >
                                    Lưu
                                </button>
                            </div>
                        ) : (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/profile/update/${id}`)}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/change-password/${id}`)}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-700"
                                >
                                    Đổi mật khẩu
                                </button>
                            </div>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}