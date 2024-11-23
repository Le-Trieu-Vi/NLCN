import { object, string, ref } from 'yup';
import { ApiError } from './error.middleware.js';

const createUserSchema = object({
  fullname: string(),
  username: string().required(),
  password: string().min(6).required(),
  address: string().nullable(),
  role: string().oneOf(['staff', 'admin', 'cashier']),
  phone: string().matches(
    /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    'Số điện thoại không hợp lệ'
  ).nullable(),
  confirmPassword: string()
    .required('Xác nhận mật khẩu không được để trống')
    .oneOf([ref('password'), null], 'Xác nhận mật khẩu không khớp'),
});

export const create = async (req, res, next) => {
  try {
    req.body = await createUserSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return next(new ApiError(400, error.errors.join(', ')));
  }
};

const updateUserSchema = object({
  fullname: string(),
  username: string(),
  address: string().nullable(),
  avatar: string(),
  role: string().oneOf(['staff', 'admin', 'cashier']),
  phone: string().matches(
    /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
    'Số điện thoại không hợp lệ'
  ).nullable(),
});

export const update = async (req, res, next) => {
  try {
    req.body = await updateUserSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return next(new ApiError(400, error.errors.join(', ')));
  }
};

const changePasswordSchema = object({
  currentPassword: string().min(6).required(),
  newPassword: string().min(6).required(),
  confirmPassword: string()
    .required('Xác nhận mật khẩu không khớp')
    .oneOf([ref('newPassword'), null], 'Xác nhận mật khẩu không khớp'),
});

export const changePassword = async (req, res, next) => {
  try {
    req.body = await changePasswordSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return next(new ApiError(400, error.errors.join(', ')));
  }
};
