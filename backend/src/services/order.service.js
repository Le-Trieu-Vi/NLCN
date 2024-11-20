import PrismaService from '../core/database.js';

export default class OrderService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async create(data) {
    try {
      const createdOrder = await this.prismaService.order.create({
        data: {
          userId: data.userId,
          tableId: data.tableId,
          total: data.total,
          orderDetails: {
            create: data.items.map((item) => ({
              dishId: item.dishId,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          orderDetails: true,
        },
      });

      return createdOrder;
    } catch (error) {
      throw error;
    }
  }

  async getAll({
    sortBy,
    order,
    status,
    minQuantity,
    maxQuantity,
    minPrice,
    maxPrice,
  }) {
    try {
      const sortOrder = order === 'desc' ? 'desc' : 'asc';
      const validSortFields = ['createdAt', 'total'];

      if (!validSortFields.includes(sortBy)) {
        sortBy = 'createdAt';
      }

      const where = {};

      if (status) {
        where.status = status;
      }

      if (minPrice || maxPrice) {
        where.total = {
          gte: minPrice ? parseFloat(minPrice) : undefined,
          lte: maxPrice ? parseFloat(maxPrice) : undefined,
        };
      }

      const orders = await this.prismaService.order.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          user: true,
          table: true,
          orderDetails: true,
        },
      });

      const filteredOrders = orders.filter((order) => {
        const totalQuantity = order.orderDetails.reduce(
          (sum, detail) => sum + detail.quantity,
          0,
        );
        const meetsMinQuantity = minQuantity
          ? totalQuantity >= parseInt(minQuantity)
          : true;
        const meetsMaxQuantity = maxQuantity
          ? totalQuantity <= parseInt(maxQuantity)
          : true;
        return meetsMinQuantity && meetsMaxQuantity;
      });

      return filteredOrders;
    } catch (error) {
      throw error;
    }
  }

  async getOne(id) {
    try {
      const order = await this.prismaService.order.findUnique({
        where: { id },
        select: { createdAt: true },
      });

      if (!order) {
        throw new Error('Order not found');
      }

      return this.prismaService.order.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          table: true,
          orderDetails: {
            include: {
              dish: {
                include: {
                  prices: {
                    where: {
                      updatedAt: {
                        lt: order.createdAt,
                      },
                    },
                    orderBy: {
                      updatedAt: 'desc',
                    },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getByUser(userId) {
    try {
      return this.prismaService.order.findMany({
        where: {
          userId,
        },
        include: {
          table: true,
          orderDetails: {
            include: {
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
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      const existingOrder = await this.prismaService.order.findUnique({
        where: {
          id,
        },
        include: {
          orderDetails: true,
        },
      });

      if (!existingOrder) {
        throw new Error('Order not found');
      }

      const updatedOrder = await this.prismaService.order.update({
        where: {
          id,
        },
        data: {
          userId:
            data.userId !== undefined ? data.userId : existingOrder.userId,
          tableId:
            data.tableId !== undefined ? data.tableId : existingOrder.tableId,
          status:
            data.status !== undefined ? data.status : existingOrder.status,
          total:
            data.total !== undefined
              ? data.total + existingOrder.total
              : existingOrder.total,
        },
        include: {
          orderDetails: true,
        },
      });

      let orderDetailUpdates = [];

      if (data.items) {
        orderDetailUpdates = data.items.map(async (item) => {
          const existingOrderDetail =
            await this.prismaService.orderDetail.findUnique({
              where: {
                orderId_dishId: {
                  orderId: id,
                  dishId: item.dishId,
                },
              },
            });

          if (existingOrderDetail) {
            const newQuantity = existingOrderDetail.quantity + item.quantity;
            return this.prismaService.orderDetail.update({
              where: {
                orderId_dishId: {
                  orderId: id,
                  dishId: item.dishId,
                },
              },
              data: {
                quantity: newQuantity,
              },
            });
          } else {
            return this.prismaService.orderDetail.create({
              data: {
                orderId: id,
                dishId: item.dishId,
                quantity: item.quantity,
              },
            });
          }
        });
      }

      await Promise.all(orderDetailUpdates);

      return updatedOrder;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const existingOrder = await this.prismaService.order.findUnique({
        where: {
          id,
        },
      });

      if (!existingOrder) {
        throw new Error('Order not found');
      }

      if (existingOrder.status !== 'pending') {
        throw new Error('Order cannot be deleted');
      }

      return this.prismaService.order.update({
        where: {
          id,
        },
        data: {
          status: 'cancelled',
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
