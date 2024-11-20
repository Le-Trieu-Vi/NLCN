import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "../../config/Api";
import * as Yup from "yup";
import alertService from "../../services/AlertService";

const TableEdit = ({ closeModalEditTable, id}) => {
  const [table, setTable] = useState(null);
  const validationSchema = Yup.object().shape({
    number: Yup.number()
      .typeError("Số bàn phải là số")
      .required("Số bàn không được để trống")
      .positive("Số bàn phải là số dương")
      .integer("Số bàn phải là số nguyên"),
  });

  const fetchTable = async () => {
    try {
      const response = await api.get(`/tables/${id}`);
      setTable(response.data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    fetchTable();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      const response = await api.put(`/tables/${id}`, values);
      alertService.success("Bàn đã được cập nhật.");
      closeModalEditTable();
    } catch (error) {
      if (error.response && error.response.status === 500) {
        alertService.info("Bàn đã tồn tại.");
      } else {
        alertService.error("Có lỗi xảy ra khi cập nhật bàn.");
      }
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white rounded-lg p-8 shadow-lg z-10 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">Sửa bàn</h2>
        {table && (
          <Formik
            initialValues={{ number: table.number, status: table.status }}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <label
                htmlFor="number"
                className="block mb-2 text-md font-medium text-gray-900 dark:text-white"
              >
                Số bàn
              </label>
              <ErrorMessage
                name="number"
                component="span"
                className="block text-red-600 mt-1 italic"
              />
              <Field
                className="border border-current block w-full py-2 px-3 rounded-md mb-2"
                name="number"
                type="text"
                placeholder="Số bàn"
              />
              <div className="flex gap-3 mt-7">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                  type="submit"
                >
                  Lưu
                </button>
                <button
                  onClick={closeModalEditTable}
                  className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-75"
                >
                  Đóng
                </button>
              </div>
            </Form>
          </Formik>
        )}
      </div>
    </div>
  );
};

export default TableEdit;
