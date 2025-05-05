//import AxiosInstance from "../../utils/AxiosInstance";

import { productAPI } from "../../api";


export const getMyProducts = ()=> async (dispatch)=>{
    try{
        const response = await productAPI.get('my-product/');
        dispatch({
            type: 'SET_MY_PRODUCTS',
            payload: response.data});
    }
    catch(error){
        console.error(error.response?.data);
        console.error('Error fetching my products',error);
    }
}

export const deleteMyProduct = (myproductId)=> async (dispatch)=>{
    try{
        await productAPI.delete(`my-product/${myproductId}/`);
        dispatch({type:'DELETE_MY_PRODUCTS', payload: myproductId
        })
    }catch (e){
        console.error(e.response?.data);
        console.error(e);
    }
}

export const addProduct=(productData)=> async (dispatch)=>{
    try{
        const response = await productAPI.post("my-product/", productData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        });
        console.log('response: ',response)
        if (response.status === 201) {
            dispatch({
                type: 'ADD_PRODUCT',
                payload: response.data
            });
            alert('Product created successfully');
        }
    }
    catch (error) {
        console.log(error)
        console.error(error.response?.data)
        alert('Error adding product')
    }
}

export const updateProduct=(slug, dataUpdate)=> async (dispatch)=>{
    try{
        const response = await productAPI.put(`my-product/${slug}/`, dataUpdate, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response)

            if (response.status === 200) {
                dispatch({
                    type: 'UPDATE_PRODUCT',
                    payload: response.data
                });
                alert('Product update successfully');
            }
        }
        catch(error){
            console.error('Error update product details',error);
            console.error(error.response?.data)
            console.error(error)
        }
}
