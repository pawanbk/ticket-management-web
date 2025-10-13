import axios from "axios";
import axiosInstance from "../config/axios.ts";
import { useAuthStore } from "../store.tsx";

const UserService = {
  getProfile: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axiosInstance.get("/user");
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  },

  logout: () => {
    const { logout } = useAuthStore.getState();
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axiosInstance.delete("/user/logout");
        if (res && res.data?.success === true && res.data.message === "Logged out Successfully") {
          logout();
          localStorage.removeItem("refreshToken");
          sessionStorage.removeItem("accessToken");
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  update: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axiosInstance.patch("/user", data);
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  },

  assignees: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axiosInstance.get("/user/all");
        resolve(res);
      } catch (error) {
        reject(error);
      }
    });
  },

  verifyEmail: async () => {
    try {
      const res = await axiosInstance.post("/user/verify-email");
      return res;
    } catch (error) {
      console.error("Error verifying email", error);
    }
  }
};

export default UserService;
