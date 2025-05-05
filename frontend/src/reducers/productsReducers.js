const initialState = {
    products: [],
    productDetails: null,
    newProduct: [],
    productBatch:{}
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

        case 'SET_PRODUCT_BATCH':
            return{
                ...state,
                productBatch: action.payload
            }

        default:
            return state;
    }
};



export default productsReducer;