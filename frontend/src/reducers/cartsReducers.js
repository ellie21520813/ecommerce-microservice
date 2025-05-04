const initialState =[]

const cartsReducer=(state=initialState, action)=>{
    switch(action.type){
        case 'SET_CARTS':
            return action.payload;

        default:
            return state;
    }

};

export default cartsReducer;