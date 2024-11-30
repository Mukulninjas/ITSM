import { axiosInstance } from ".";

export const CreateUser = async (values) => {
    try {
        const response = await axiosInstance.post("/admin/createuser", values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const FetchUsers = async () => {
    try {
        const response = await axiosInstance.get("/admin/users");
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const EditUser  = async (values) => {
    try {
        const response = await axiosInstance.put("/admin/edituser", values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}

export const DeleteUser = async (values) => {
    try {
        const response = await axiosInstance.post("/admin/deleteuser", values);
        return response.data;
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}