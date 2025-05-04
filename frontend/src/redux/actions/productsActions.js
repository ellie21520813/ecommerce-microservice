//import AxiosInstance from "../../utils/AxiosInstance";
import { productAPI } from "../../api";

export const fetchProducts = ()=> async (dispatch)  =>{
    try{
        const response = await productAPI.get('product/');
        dispatch({
            type: 'SET_PRODUCTS',
            payload: response.data});
    }
    catch(error){
        console.error('Error fetching products',error);
    }
};

export const fetchProductsDetails=(id)=> async (dispatch) =>{
    try{
        const response = await productAPI.get(`product/${id}/`);
        dispatch({
            type: 'SET_PRODUCT_DETAILS',
            payload: response.data
        });
    }
    catch(error){
        console.error('Error fetching product details',error);
    }
}

