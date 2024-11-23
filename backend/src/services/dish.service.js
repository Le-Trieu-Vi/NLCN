import PrismaService from '../core/database.js';
import fs from 'fs';
import path from 'path';
import { getCurrentDirectory } from '../utils/dirname.js';

const __dirname = getCurrentDirectory();

export default class DishService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async uploadImage(file) {
    const uploadDir = path.join(__dirname, '/uploads/dishes');

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
    const filePath = path.join(__dirname, '/uploads/dishes', fileName);
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
        const filePath = await this.uploadImage(file);
        data.image = filePath;
      }
      return this.prismaService.dish.create({
        data: {
          name: data.name,
          categoryId: data.categoryId,
          image: data.image,
          description: data.description,
          prices: {
            create: {
              price: data.price,
            },
          },
        },
        include: {
          prices: true,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      return this.prismaService.dish.findMany({
        where: { isDeleted: false },
        include: {
          prices: { orderBy: { updatedAt: 'desc' }, take: 1 },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getOne(id) {
    try {
      return this.prismaService.dish.findUnique({
        where: {
          id,
          isDeleted: false,
        },
        include: {
          prices: { orderBy: { updatedAt: 'desc' }, take: 1 },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findTopDishes() {
    const dishes = await this.prismaService.dish.findMany({
      where: { isDeleted: false },
      include: {
        orderDetails: {
          select: {
            quantity: true,
          },
        },
        prices: { orderBy: { updatedAt: 'desc' }, take: 1 },
      },
    });
  
    const topDishes = dishes
      .map((dish) => ({
        ...dish,
        totalQuantity: dish.orderDetails.reduce(
          (sum, detail) => sum + detail.quantity,
          0
        ),
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 3);
  
    return topDishes;
  }
  

  async update(id, data, file) {
    try {
      const currentDish = await this.prismaService.dish.findUnique({
        where: { id },
        include: { prices: { orderBy: { updatedAt: 'desc' }, take: 1 } },
      });
  
      if (file) {
        const fileName = await this.uploadImage(file);
        data.image = fileName;
      }
  
      if (!data.image) {
        data.image = currentDish.image;
      } else {
        if (currentDish.image !== null) {
          await this.deleteImage(currentDish.image);
        }
      }
  
      const updatedData = {
        name: data.name || currentDish.name,
        categoryId: data.categoryId || currentDish.categoryId,
        image: data.image,
        description: data.description || currentDish.description,
      };
  
      let pricesUpdateData = {};
      const currentPrice = currentDish.prices[0]?.price;
  
      if (data.price && Number(data.price) !== currentPrice) {
        pricesUpdateData = {
          prices: {
            create: {
              price: Number(data.price),
            },
          },
        };
      }
  
      const updatedDish = await this.prismaService.dish.update({
        where: { id },
        data: {
          ...updatedData,
          ...pricesUpdateData,
        },
        include: {
          prices: true,
        },
      });
  
      return updatedDish;
    } catch (error) {
      console.error('Error updating dish:', error);
      throw error;
    }
  }
  

  async delete(id) {
    try {
      const dish = await this.prismaService.dish.findUnique({
        where: { id },
      });

      if (dish.image) {
        await this.deleteImage(dish.image);
      }

      return this.prismaService.dish.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      throw error;
    }
  }
}
