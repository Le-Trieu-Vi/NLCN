import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../config/Api";
import AuthService from "../../services/AuthService";
import alertService from "../../services/AlertService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Loading from "../../components/Loading";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUser = async () => {
    try {
      if (!AuthService.isAuthenticated()) {
        alertService.error("Vui lòng đăng nhập!");
        navigate("/login");
        return;
      }
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
    } catch (error) {
      setError(error);
      alertService.error("Lỗi khi lấy thông tin người dùng");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Tên đăng nhập không được để trống"),
    fullname: Yup.string().required("Họ tên không được để trống"),
    phone: Yup.string().matches(
      /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
      "Số điện thoại không hợp lệ"
    ),
    address: Yup.string(),
  });

  const handleSave = async (values) => {
    try {
      const updateData = {
        fullname: values.fullname,
        username: values.username,
        address: values.address,
      };

      if (values.phone.trim() !== "") {
        updateData.phone = values.phone;
      }

      const response = await api.put(`/users/${id}`, updateData);
      setUser(response.data);
      setIsEditing(false);
      alertService.success("Cập nhật thông tin thành công");
    } catch (error) {
      alertService.error(error.response.data.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <Loading />;
  }

  return (
    <div className="max-w-lg mx-auto p-8 m-6 bg-gray-100 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <button
          title="Trở lại"
          onClick={() => navigate(-1)}
          className="flex-none"
        >
          <ArrowLeftIcon className="h-6 w-6 mx-1" />
        </button>
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Chỉnh sửa thông tin cá nhân" : "Thông tin cá nhân"}
          </h1>
        </div>
        <div className="flex-none" style={{ width: "2rem" }}></div>
      </div>

      {user && (
        <Formik
          initialValues={{
            fullname: user.fullname || "",
            username: user.username || "",
            phone: user.phone || "",
            address: user.address || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ isSubmitting, values, handleChange }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Họ tên
                </label>
                <Field
                  type="text"
                  name="fullname"
                  value={values.fullname}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="fullname"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tên đăng nhập
                </label>
                <Field
                  type="text"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Số điện thoại
                </label>
                <Field
                  type="text"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Địa chỉ
                </label>
                <Field
                  type="text"
                  name="address"
                  as="textarea"
                  rows="3"
                  value={values.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  disabled={!isEditing}
                />
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-xs italic"
                />
              </div>
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
                      onClick={() => setIsEditing(true)}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/change-password/${id}`)}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default Profile;
