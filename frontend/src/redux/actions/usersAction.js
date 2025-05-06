import axios from "axios";
export const fetchUsers =(user_data)=>async (dispatch)=>{
    try{
        const res = await axios.post('http://localhost:8080/api/login/', user_data)
        if(res.status === 200) {
            localStorage.setItem("access_token", res.data.access_token);
            localStorage.setItem("refresh_token", res.data.refresh_token);
            localStorage.setItem("user", JSON.stringify({
                name: res.data.name,
                email: res.data.email
            }));
            localStorage.setItem("vendor", JSON.stringify(res.data.is_vendor))
            dispatch({
                type: 'LOGIN',
                payload: res.data
            });
            alert('login successfully')
        }
        return true
    }
    catch (e){
        console.log(e)
        console.log(e.response?.data)
        return false
    }
}

export const logout=()=>async (dispatch)=>{
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("vendor")
    dispatch({
        type: 'LOGOUT'
    })
}



