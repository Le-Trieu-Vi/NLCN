import PrismaService from '../core/database.js';

export default class CartServives {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async update(id, data) {
    try {
      return this.prismaService.cart.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async create(data) {
    try {
      const itemHasInCart = await this.prismaService.cart.findFirst({
        where: {
          userId: data.userId,
          dishId: data.dishId,
        },
      });

      if (itemHasInCart) {
        return this.prismaService.cart.update({
          where: { id: itemHasInCart.id },
          data: {
            quantity: itemHasInCart.quantity + data.quantity,
          },
        });
      }
      return this.prismaService.cart.create({
        data: {
          userId: data.userId,
          dishId: data.dishId,
          quantity: data.quantity,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll(id) {
    try {
      return await this.prismaService.cart.findMany({
        where: { userId: id },
        include: {
          user: true,
          dish: {
            include: {
              prices: {
                orderBy: {
                  updatedAt: 'desc',
                },
                take: 1,
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteMultiple(ids) {
    try {
      return this.prismaService.cart.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
