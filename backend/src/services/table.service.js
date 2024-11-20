import PrismaService from '../core/database.js';

export default class TableService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async create(data) {
    try {
      return this.prismaService.table.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      return this.prismaService.table.findMany({
        where: { isDeleted: false },
        include: {
          orders: {
            where: {
              status: {
                in: ['pending', 'requested'],
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getAvailable() {
    try {
      return this.prismaService.table.findMany({
        where: {
          status: 'available',
          isDeleted: false,
        },
        include: {
          orders: {
            where: {
              status: {
                in: ['pending', 'requested'],
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getUnavailable() {
    try {
      return this.prismaService.table.findMany({
        where: {
          status: 'unavailable',
          isDeleted: false,
        },
        include: {
          orders: {
            where: {
              status: {
                in: ['pending', 'requested'],
              },
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getOrderByIdTable(id) {
    try {
      const table = await this.prismaService.table.findUnique({
        where: {
          id,
        },
        include: {
          orders: {
            where: {
              status: {
                in: ['pending', 'requested'],
              },
            },
            include: {
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
          },
        },
      });
      return table;
    } catch (error) {
      throw error;
    }
  }

  async update(id, data) {
    try {
      return this.prismaService.table.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const table = await this.prismaService.table.findUnique({
        where: { id },
      });
  
      if (table.status === 'unavailable') {
        throw new Error('Không thể xóa vì bàn đang sử dụng.');
      }
  
      return await this.prismaService.table.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch (error) {
      throw error;
    }
  }
  
}
