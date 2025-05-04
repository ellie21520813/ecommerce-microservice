const initialState =[];

const cartItemsReducer = (state = initialState, action)=>{
    switch(action.type){
        case 'DELETE_CART_ITEMS':
            return state.filter(cartItem => cartItem.id!== action.payload);

        case 'SET_CART_ITEMS':
            return action.payload
        default:
            return state;
    }
};

export default cartItemsReducer;