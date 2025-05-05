import createAxiosInstance from "../utils/AxiosInstance";

export const authAPI = createAxiosInstance("http://0.0.0.0:8080/api/");
export const productAPI = createAxiosInstance("http://0.0.0.0:8080/api/v1/");
export const orderAPI = createAxiosInstance("http://0.0.0.0:8080/api/v2/");
