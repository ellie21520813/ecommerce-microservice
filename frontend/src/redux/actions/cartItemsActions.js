//import AxiosInstance from "../../utils/AxiosInstance";
import { orderAPI } from "../../api";

export const fetchCartItems = ()=> async (dispatch)=>{
    try{
        const response = await orderAPI.get('cart-items/')
        dispatch(
            {
                type:'SET_CART_ITEMS',
                payload:response.data
            })

    }catch (e){
        console.error(e);
    }
}

export const deleteCartItems = (cartItemsId)=> async (dispatch)=>{
    try{
        await orderAPI.delete(`cart-items/${cartItemsId}/`);
        dispatch(
            {
                type:'DELETE_CART_ITEMS',
                payload: cartItemsId
            })
    }catch (e){
        console.error(e.response?.data);
        console.error(e);
    }
}