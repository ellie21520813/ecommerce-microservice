const initialState = [];

const categoriesReducers = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_CATEGORIES':
            return action.payload;
        default:
            return state;
    }
}

export default categoriesReducers;