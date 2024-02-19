import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toggleLoader } from "../redux/loader-slice/loaderSlice";

const axiosInstance = axios.create({
    baseURL: "http://localhost:9090/api",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userData") ?? "{}")?.token ?? ""
        }`,
    },
});
export const setAxiosToken = (token: string) => {
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
};

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
export const put = async (url: string, payload: any) => {
    try {
        const response = await axiosInstance.put(url, payload);
        return response.data;
    } catch (error) {
        return error;
    }
};

export const AxiosInterceptor = (props: any) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const req = (request: any) => {
            dispatch(toggleLoader(true));
            return request;
        };
        const resInterceptor = (response: any) => {
            dispatch(toggleLoader(false));
            return response;
        };
        const errInterceptor = (error: any) => {
            //CAN ADD REDIRECTION LOGIC HERE
            dispatch(toggleLoader(false));
            return Promise.reject();
        };
        const reqInterceptor = axiosInstance.interceptors.request.use(req);
        const interceptor = axiosInstance.interceptors.response.use(
            resInterceptor,
            errInterceptor
        );
        return () => {
            axiosInstance.interceptors.response.eject(interceptor);
            axiosInstance.interceptors.request.eject(reqInterceptor);
        };
    }, [dispatch]);
    return props.children;
};
