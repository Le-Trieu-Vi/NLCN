import autoBind from "../utils/auto-bind.util.js";
import { ApiError } from "../middlewares/error.middleware.js";
import AuthService from "../services/auth.service.js";

class AuthController {
    constructor() {
        this.authService = new AuthService();
        autoBind(this);
    }

    async login(req, res, next) {
        try {
            const accessToken = await this.authService.login(req.body);
            res.status(200).json({
                status: "success",
                message: "Login successfully",
                data: {
                    accessToken
                }
            });
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || "Failed to login"));
        }
        
    }

    async register(req, res, next) {
        try {
            await this.authService.register(req.body);
            res.status(201).json({
                status: "success",
                message: "Register successfully"
            });
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || "Failed to register"));
        }
    }
}
export default new AuthController();