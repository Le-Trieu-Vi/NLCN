import api from "../config/Api";

class AuthService {
  async login(username, password) {
    try {
      const response = await api.post(`/auth/login`, {
        username,
        password,
      });

      if (response.data.data.accessToken) {
        localStorage.setItem("token", response.data.data.accessToken);
        console.log(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
  }

  getUserId() {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decodeToken = atob(token.split(".")[1]);
    const parseToken = JSON.parse(decodeToken);
    return parseToken.id;
  }

  async getUser() {
    try {
      const id = this.getUserId();
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  isAdmin() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = atob(token.split(".")[1]);
    const parseToken = JSON.parse(decodeToken);
    return parseToken.role === "admin";
  }

  isCashier() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = atob(token.split(".")[1]);
    const parseToken = JSON.parse(decodeToken);
    return parseToken.role === "cashier";
  }

  isStaff() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    const decodeToken = atob(token.split(".")[1]);
    const parseToken = JSON.parse(decodeToken);
    return parseToken.role === "staff";
  }
}

export default new AuthService();
