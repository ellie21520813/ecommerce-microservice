const initialState={
    user: null,
    token: null,
    refresh_token: null,
    isAuthenticated: false,
    vendor: null
}

const usersReducers = (state=initialState, action)=>{
    switch (action.type) {
        case 'LOGIN':
            return{
                ...state,
                user: {
                    'name': action.payload.name,
                    'email': action.payload.email
                },
                token: action.payload.access_token,
                refresh_token: action.payload.refresh_token,
                isAuthenticated: true,
                vendor: action.payload.is_vendor
            };

        case 'LOGOUT':
            return{
                ...state,
                user: null,
                token: null,
                refresh_token: null,
                isAuthenticated: false,
                vendor: null
            }

        case 'UPDATE_ACCESS_TOKEN':
            return {
                ...state,
                token: action.payload 
            };

        case "RESTORE_TOKENS":
            return {
                ...state,
                token: action.payload.token,
                refresh_token: action.payload.refresh_token,
                user: action.payload.user,
                isAuthenticated: true,
                vendor: action.payload.vendor
            };
        default:
            return state
    }
}
export default usersReducers