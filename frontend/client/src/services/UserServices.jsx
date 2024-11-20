import Api from "../config/Api";
import alertService from "./AlertService";

class UserS {
    async updateUser(fullname, username, address, phone, avatar, userId) {
        try {
            const response = await Api.put(`/users/${userId}`, {
                fullname,
                username,
                address,
                phone,
                avatar,
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            alertService.error(error.response.data.message);
        }
    }
}

export default new UserS();