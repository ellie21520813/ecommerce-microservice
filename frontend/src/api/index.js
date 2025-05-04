import createAxiosInstance from "../utils/AxiosInstance";

export const authAPI = createAxiosInstance("http://localhost:8000/api/");
export const productAPI = createAxiosInstance("http://localhost:8001/api/v1/");
export const orderAPI = createAxiosInstance("http://localhost:8002/api/v2/");
