const initialState = []

const orderitemsReducer = (state=initialState, action)=>{
    switch(action.type){
        case 'SET_ORDER_ITEMS':
            return action.payload

        default:
            return state
    }
}

export default orderitemsReducer