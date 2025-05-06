import axios from 'axios';

export const fetchCategories = () => async (dispatch) => {
    try {
        const response = await axios.get('http://localhost:8080/api/v1/category/');
        dispatch({
            type: 'SET_CATEGORIES',
            payload: response.data,
        });
    }
    catch (error){
        console.error('Error fetching categories:', error);
    }
};