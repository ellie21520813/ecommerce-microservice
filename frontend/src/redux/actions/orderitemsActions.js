//import AxiosInstance from "../../utils/AxiosInstance";

import { orderAPI } from "../../api"

export const fetchOrderItems = ()=> async (dispatch)=>{
    try{
        const response = await orderAPI.get('order-item/')
        dispatch({
            type: 'SET_ORDER_ITEMS',
            payload: response.data
        })
    }
    catch (err) {
        console.error("error fetching order items", err)
    }
}