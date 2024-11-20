import PrismaService from '../core/database.js';
import fs from 'fs';
import path from 'path';
import { getCurrentDirectory } from '../utils/dirname.js';

const __dirname = getCurrentDirectory();

export default class CategoryService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async uploadImage(file) {
    const uploadDir = path.join(__dirname, '/uploads/categories');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

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
    const filePath = path.join(__dirname, '/uploads/categories', fileName);
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async create(data, file) {
    try {
      if (file) {
        const fileName = await this.uploadImage(file);
        data.image = fileName;
      }
      return this.prismaService.category.create({
        data,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getAll() {
    try {
      return this.prismaService.category.findMany({
        where: { isDeleted: false },
      });
    } catch (error) {
      throw error;
    }
  }

  async getOne(id) {
    try {
      return await this.prismaService.category.findFirst({
        where: {
          id: id,
          isDeleted: false,
        },
        include: {
          dishes: {
            where: { isDeleted: false },
            include: {
              prices: { orderBy: { updatedAt: 'desc' }, take: 1 },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id, data, file) {
    try {
      const currentCategory = await this.prismaService.category.findUnique({
        where: { id },
      });

      if (file) {
        const fileName = await this.uploadImage(file);
        data.image = fileName;
      }

      if (!data.image) {
        data.image = currentCategory.image;
      } else {
        if (currentCategory.image !== null) {
          await this.deleteImage(currentCategory.image);
        }
      }

      const updateData = {
        name: data.name || currentCategory.name,
        description: data.description || currentCategory.description,
        image: data.image,
      };

      return this.prismaService.category.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id },
      });

      if (category.image) {
        await this.deleteImage(category.image);
      }

      return this.prismaService.category.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      throw error;
    }
  }
}
