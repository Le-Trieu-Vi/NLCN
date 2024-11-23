import PrismaService from '../core/database.js';
import * as bcrypt from 'bcrypt';
import { ApiError } from '../middlewares/error.middleware.js';
import fs from 'fs';
import path from 'path';
import { getCurrentDirectory } from '../utils/dirname.js';

const __dirname = getCurrentDirectory();

export default class UserService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async uploadImage(file) {
    if (!file) {
      throw new ApiError(400, 'File is required');
    }

    const uploadDir = path.join(__dirname, '/uploads/users');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    console.log(filePath);
    

    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, file.buffer, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(fileName);
      });
    });
  }

  deleteImage(fileName) {
    const filePath = path.join(__dirname, '/uploads/users', fileName);
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async getAll(query) {
    try {
      const { search } = query;
      if (search) {
        return await this.prismaService.user.findMany({
          where: {
            isDeleted: false,
            role: {
              in: ['staff', 'cashier', 'user'],
            },
            OR: [
              { username: { contains: search } },
              { fullname: { contains: search } },
            ],
          },
        });
      }
      return await this.prismaService.user.findMany({
        where: {
          isDeleted: false,
          role: {
            in: ['staff', 'cashier', 'user'],
          },
        },
      });
    } catch (error) {
      throw new ApiError(500, 'Lấy danh sách người dùng thất bại');
    }
  }

  async create(data) {
    const user = await this.prismaService.user.findUnique({
      where: { username: data.username },
    });

    if (user) {
      throw new ApiError(400, 'Tên đăng nhập đã tồn tại');
    }

    const { confirmPassword, ...userData } = data;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    return await this.prismaService.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }

  async getOne(id) {
    try {
      return await this.prismaService.user.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new ApiError(500, 'Người dùng không tồn tại');
    }
  }

  async delete(id) {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      throw new ApiError(500, 'Xóa người dùng thất bại');
    }
  }

  async update(id, data, file) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: { password: true, avatar: true },
      });

      if (data.password) {
        if (!user) {
          throw new ApiError(404, 'Người dùng không tồn tại');
        }

        const isPasswordValid = await bcrypt.compare(
          data.currentPassword,
          user.password,
        );
        if (!isPasswordValid) {
          throw new ApiError(400, 'Mật khẩu hiện tại không đúng');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
      }

      delete data.currentPassword;

      if (file) {
        const fileName = await this.uploadImage(file);
        data.avatar = fileName;
      }

      if (!data.avatar) {
        data.avatar = user.avatar;
      } else {
        if (user.avatar) {
          await this.deleteImage(user.avatar);
        }
      }

      const updateData = {
        fullname: data.fullname || user.fullname,
        avatar: data.avatar,
        password: data.password ? data.password : user.password,
        address: data.address || user.address,
        phone: data.phone || user.phone,
      };

      return await this.prismaService.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new ApiError(
        error.status || 500,
        error.message || 'Cập nhật thông tin thất bại',
      );
    }
  }

  async changePassword(id, data) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        select: { password: true },
      });
      if (!user) {
        throw new ApiError(404, 'Người dùng không tồn tại');
      }

      const isPasswordValid = await bcrypt.compare(
        data.currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new ApiError(400, 'Mật khẩu hiện tại không đúng');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.newPassword, salt);
      return await this.prismaService.user.update({
        where: { id },
        data: { password: hashedPassword },
      });
    } catch (error) {
      throw new ApiError(
        error.status || 500,
        error.message || 'Đổi mật khẩu thất bại',
      );
    }
  }
}
