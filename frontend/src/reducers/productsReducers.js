const initialState = {
    products: [],
    productDetails: null,
    newProduct: [],
};

const productsReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_PRODUCTS':
            return {
                ...state,
                products: action.payload
            }

        case 'SET_PRODUCT_DETAILS':
            return {
                ...state,
                productDetails: action.payload || null
            };

        default:
            return state;
    }
};



export default productsReducer;