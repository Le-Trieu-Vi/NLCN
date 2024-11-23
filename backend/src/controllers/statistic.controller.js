import { ApiError } from "../middlewares/error.middleware.js";
import StatisticService from "../services/statistic.service.js";
import autoBind from "../utils/auto-bind.util.js";

class StatisticController {
    constructor () {
        this.statisticService = new StatisticService();
        autoBind(this);
    }

    async getRevenue(req, res, next) {
        try {
            const revenue = await this.statisticService.getRevenue(req.query);
            res.status(200).json(revenue);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to get statistic'));
        }
    }

    async getSummary(req, res, next) {
        try {
            const summary = await this.statisticService.getSummary();
            res.status(200).json(summary);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to get statistic'));
        }
    }
}

export default new StatisticController();