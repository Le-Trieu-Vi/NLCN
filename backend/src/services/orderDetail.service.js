import PrismaService from '../core/database.js';

export default class OrderDetailService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async update(idOrder, idDish, data) {
    try {
      const orderDetail = await this.prismaService.orderDetail.findUnique({
        where: {
          orderId_dishId: {
            orderId: idOrder,
            dishId: idDish,
          },
        },
      });
      if (!orderDetail) {
        return null;
      }
      const updatedOrderDetail = await this.prismaService.orderDetail.update({
        where: {
          orderId_dishId: {
            orderId: idOrder,
            dishId: idDish,
          },
        },
        data,
      });
      return updatedOrderDetail;
    } catch (error) {
      throw error;
    }
  }
}
