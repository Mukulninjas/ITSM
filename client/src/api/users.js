import { axiosInstance } from ".";

export const LoginUser = async (values) => {
    try {
        const response = await axiosInstance.post("/auth/login", values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const ForgotPassword = async (values) => {
    try {
        const response = await axiosInstance.post("/auth/forgotpassword", values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const ResetPassword = async (values) => {
    try {
        const response = await axiosInstance.post(`/auth/resetpasswordwithtoken`, values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const Ticket = async (values) => {
    try {
        const response = await axiosInstance.post("/user/createticket", values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const FetchTickets = async (values) => {
    try {
        const response = await axiosInstance.get(`/user/tickets`);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}