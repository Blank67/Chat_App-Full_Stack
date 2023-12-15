import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9090/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const get = async (url: string) => {
    try {
        const response = await axiosInstance.get(url);
        return response.data;
    } catch (error) {
        return error;
    }
};
export const post = async (url: string, payload: any) => {
    try {
        const response = await axiosInstance.post(url, payload);
        return response.data;
    } catch (error) {
        return error;
    }
};
