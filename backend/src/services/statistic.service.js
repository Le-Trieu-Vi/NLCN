import PrismaService from '../core/database.js';

BigInt.prototype.toJSON = function () {
  return this.toString();
};

export default class StatisticService {
  constructor() {
    this.prismaService = new PrismaService();
  }

  async getRevenue(query) {
    try {
      if (query.timeUnit === '30day') {
        const today = new Date();
        const lastMonth = new Date(today);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const statistics = await this.prismaService.$queryRaw`
          SELECT 
            EXTRACT(DAY FROM created_at) as date_summary,
            EXTRACT(MONTH FROM created_at) as month_summary,
            EXTRACT(YEAR FROM created_at) as year_summary,
            COUNT(id) as total_orders,
            SUM(total) as total_revenue 
          FROM orders
          WHERE status = 'completed' AND created_at >= ${lastMonth}
          GROUP BY EXTRACT(DAY FROM created_at), EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
        `;

        const daysRange = [];
        let currentDate = new Date(lastMonth);

        while (currentDate <= today) {
          daysRange.push({
            date_summary: currentDate.getDate(),
            month_summary: currentDate.getMonth() + 1,
            year_summary: currentDate.getFullYear(),
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        const completeStatistics = daysRange.map((day) => {
          const existing = statistics.find(
            (s) =>
              s.date_summary === day.date_summary &&
              s.month_summary === day.month_summary &&
              s.year_summary === day.year_summary,
          );

          return {
            ...day,
            total_orders: existing ? Number.parseInt(existing.total_orders) : 0,
            total_revenue: existing ? Number.parseInt(existing.total_revenue) : 0,
          };
        });

        completeStatistics.forEach((s) => {
          s.time = `${s.date_summary}/${s.month_summary}/${s.year_summary}`;
          delete s.date_summary;
          delete s.month_summary;
          delete s.year_summary;
        });

        return completeStatistics;
      } else if (query.timeUnit === '6month') {
        const today = new Date();
        const last6Month = new Date(today);
        last6Month.setMonth(last6Month.getMonth() - 5);

        const statistics = await this.prismaService.$queryRaw`
          SELECT 
            EXTRACT(MONTH FROM created_at) as month_summary,
            EXTRACT(YEAR FROM created_at) as year_summary,
            COUNT(id) as total_orders,
            SUM(total) as total_revenue 
          FROM orders
          WHERE status = 'completed' AND created_at >= ${last6Month}
          GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
        `;
        const monthsRange = [];
        let currentDate = new Date(last6Month);

        while (currentDate <= today) {
          monthsRange.push({
            month_summary: currentDate.getMonth() + 1,
            year_summary: currentDate.getFullYear(),
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const completeStatistics = monthsRange.map((month) => {
          const existing = statistics.find(
            (s) => s.month_summary === month.month_summary && s.year_summary === month.year_summary,
          );

          return {
            ...month,
            total_orders: existing ? Number.parseInt(existing.total_orders) : 0,
            total_revenue: existing ? Number.parseInt(existing.total_revenue) : 0,
          };
        });

        completeStatistics.forEach((s) => {
          s.time = `${s.month_summary}/${s.year_summary}`;
          delete s.month_summary;
          delete s.year_summary;
        });

        return completeStatistics;
      } else {
        const today = new Date();
        const last12Month = new Date(today);
        last12Month.setMonth(last12Month.getMonth() - 11);

        const statistics = await this.prismaService.$queryRaw`
          SELECT 
            EXTRACT(MONTH FROM created_at) as month_summary,
            EXTRACT(YEAR FROM created_at) as year_summary,
            COUNT(id) as total_orders,
            SUM(total) as total_revenue 
          FROM orders
          WHERE status = 'completed' AND created_at >= ${last12Month}
          GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
        `;
        const monthsRange = [];
        let currentDate = new Date(last12Month);

        while (currentDate <= today) {
          monthsRange.push({
            month_summary: currentDate.getMonth() + 1,
            year_summary: currentDate.getFullYear(),
          });
          currentDate.setMonth(currentDate.getMonth() + 1);
        }

        const completeStatistics = monthsRange.map((month) => {
          const existing = statistics.find(
            (s) => s.month_summary === month.month_summary && s.year_summary === month.year_summary,
          );

          return {
            ...month,
            total_orders: existing ? Number.parseInt(existing.total_orders) : 0,
            total_revenue: existing ? Number.parseInt(existing.total_revenue) : 0,
          };
        });

        completeStatistics.forEach((s) => {
          s.time = `${s.month_summary}/${s.year_summary}`;
          delete s.month_summary;
          delete s.year_summary;
        });

        return completeStatistics;
      }
    } catch (error) {
      throw error;
    }
  }

  async getSummary() {
    try {
      const totalOrders = await this.prismaService.order.count();
      const totalDishes = await this.prismaService.dish.count(
        {
          where: {
            isDeleted: false,
          }
        }
      );
      const totalCategories = await this.prismaService.category.count(
        {
          where: {
            isDeleted: false,
          }
        }
      );
      const totalUsers = await this.prismaService.user.count(
        {
          where: {
            isDeleted: false,
            role: {
              in: ['staff', 'cashier', 'user'],
            },
          }
        }
      );

      return { totalOrders, totalDishes, totalCategories, totalUsers };
    } catch (error) {
      throw error;
    }
  }
}
