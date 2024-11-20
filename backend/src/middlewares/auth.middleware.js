import { object, string, ref } from 'yup';
import { ApiError } from './error.middleware.js';
import jwt from 'jsonwebtoken';

const loginSchema = object({
  username: string().required(),
  password: string().min(6).required(),
});
export const login = async (req, res, next) => {
  try {
    req.body = await loginSchema.validate(req.body);
  } catch (error) {
    return next(new ApiError(400, error.message));
  }
  next();
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next(new ApiError(401, 'Unauthorized'));
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next(new ApiError(401, 'Unauthorized'));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Unauthorized'));
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }
    next();
  };
};

const registerSchema = object({
  username: string().required(),
  fullname: string().max(50).nullable(),
  address: string().max(200).nullable(),
  role: string().default('user'),
  phone: string()
    .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, 'Số điện thoại không hợp lệ')
    .nullable(),
  password: string().min(6).required('Mật khẩu không được để trống'),
  confirmPassword: string()
    .required('Xác nhận mật khẩu không được để trống')
    .min(6)
    .oneOf([ref('password'), null], 'Xác nhận mật khẩu không khớp'),
});

export const register = async (req, res, next) => {
  try {
    req.body = await registerSchema.validate(req.body);
    next();
  } catch (error) {
    return next(new ApiError(400, error.errors.join(', ')));
  }
};
