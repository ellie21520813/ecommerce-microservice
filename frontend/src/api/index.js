import createAxiosInstance from "../utils/AxiosInstance";

export const authAPI = createAxiosInstance("http://localhost:8080/api/");
export const productAPI = createAxiosInstance("http://localhost:8080/api/v1/");
export const orderAPI = createAxiosInstance("http://localhost:8080/api/v2/");
