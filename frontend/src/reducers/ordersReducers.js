const initialState = {
    orders: [],
    newOrder:[]
}

const orderReducer = (state = initialState, action) => {
    switch(action.type){
        case 'SET_ORDERS':
            return {
                ...state,
                orders: action.payload
            }

        case 'ADD_ORDERS':
            return {
                ...state,
                newOrder: action.payload}
        default:
            return state
    }
}

export default orderReducer