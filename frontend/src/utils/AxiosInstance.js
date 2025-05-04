import axios from "axios"
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";
import store from "../redux/store";

//const baseURL = 'http://localhost:8000/api/'

const createAxiosInstance = (customBaseURL)=>{
    const AxiosInstance = axios.create({
    	baseURL: customBaseURL,
    	headers: {
        	'Content-Type': 'application/json',
    	},
    })

    AxiosInstance.interceptors.request.use(async req => {
        const state = store.getState();
        let accessToken = state.authen.token;
        let refresh_token = state.authen.refresh_token;

        if (accessToken) {
            req.headers.Authorization = `Bearer ${accessToken}`;

            const user = jwtDecode(accessToken);
            const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

            if (!isExpired) return req;

            try {
                const resp = await axios.post(`http://localhost:8000/api/token/refresh/`, {
                    refresh: refresh_token
                });

                const newAccessToken = resp.data.access;

                console.log('new access token:', newAccessToken);

                store.dispatch({
                    type: 'UPDATE_ACCESS_TOKEN',
                    payload: newAccessToken
                });

                req.headers.Authorization = `Bearer ${newAccessToken}`;

                return req;
            } catch (e) {
                console.error('Error refreshing token', e);
                return Promise.reject(e);
            }
        } else {
            req.headers.Authorization = "";
            return req;
        }
    });
    return AxiosInstance
}
export default createAxiosInstance
