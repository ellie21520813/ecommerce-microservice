//import AxiosInstance from "../../utils/AxiosInstance";

import { orderAPI } from "../../api";

export  const  fetchCarts = ()=> async (dispatch)=>{
    try{
        const response = await orderAPI.get("cart/")
        dispatch({type:'SET_CARTS', payload: response.data});
        return { payload: response.data }
    } catch(e){
        console.error("error to fetching",e);
    }
};