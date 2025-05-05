import React, {useState} from 'react';
import { useNavigate} from "react-router-dom";
import { productAPI, authAPI } from '../api';

const RegisteVendor = ()=>{
    const navigate = useNavigate()
    const [formdata, setFormData] = useState({
        bio:"",
        contact_detail:"",
        bank_detail:"",
        shipping_policy:"",
        return_policy:"",
    })
    const {bio, contact_detail, bank_detail, shipping_policy, return_policy} = formdata
    const handleOnchange =(e)=>{
        setFormData({...formdata, [e.target.name]: e.target.value})
    }
    const handlesubmitRegister= async (e)=>{
        e.preventDefault()
        try{
            console.log(formdata)
            const response = await productAPI.post('vendor/',formdata)
            console.log(response)
            if(response.status  === 201){
                navigate('/dashboard')
                alert('Vendor Registration Successful')
            }
        }
        catch(error){
            alert(error.response.data.Detail)
            console.error(error.response?.data)
        }
    }

    return(
        <div>
            <h1>Vendor Registration</h1>
            <form onSubmit={handlesubmitRegister}>
                <div>
                    <label htmlFor="bio">Bio</label>
                    <input
                        type="text"
                        id="bio"
                        name="bio"
                        value={bio}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="contact_detail">Contact Details</label>
                    <input
                        type="text"
                        id="contact_detail"
                        name="contact_detail"
                        value={contact_detail}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="bank_detail">Bank Details</label>
                    <input
                        type="text"
                        id="bank_detail"
                        name="bank_detail"
                        value={bank_detail}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="shipping_policy">Shipping Policy</label>
                    <input
                        type="text"
                        id="shipping_policy"
                        name="shipping_policy"
                        value={shipping_policy}
                        onChange={handleOnchange}
                        required/>
                </div>
                <div>
                    <label htmlFor="return_policy">Return Policy</label>
                    <input
                        type="text"
                        id="return_policy"
                        name="return_policy"
                        value={return_policy}
                        onChange={handleOnchange}
                        required/>
                </div>
                <button  type='submit'>Register Vendor</button>
            </form>
        </div>
    )
}

export default RegisteVendor;