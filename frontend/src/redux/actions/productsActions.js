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

export const fetchProductsDetailsBatch = (productIds)=>async (dispatch)=>{
    try{
        const idsParam = productIds.join(',')
        const response = await productAPI.get(`product-cart/batch/?ids=${idsParam}`)
        const productMap = {}
        response.data.forEach(product => {
            productMap[product.id] = product;
        });
        dispatch({ type: 'SET_PRODUCT_BATCH', payload: productMap });
    } 
    catch (error) {
        console.error('Failed to fetch product details:', error);
    }
    
}