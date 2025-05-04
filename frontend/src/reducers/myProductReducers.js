const initialState = {
    myProducts: [],
    productDetails: null,
    newProduct: [],
};
const myProductReducers = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_MY_PRODUCTS':
            return {
                ...state,
                myProducts: action.payload
            }

        case 'DELETE_MY_PRODUCTS':
            return {
                ...state,
                myProducts: state.myProducts.filter(myproduct => myproduct.id !== action.payload)
            };

        case 'ADD_PRODUCT':
            return {
               ...state,
                newProduct: [...state.newProduct, action.payload]
            };

        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(product =>
                    product.slug === action.payload.slug ? action.payload : product
                ),
                productDetails: state.productDetails?.slug === action.payload.slug ? action.payload : state.productDetails
            };

    
        default:
            return state;
    }
};

export default myProductReducers


