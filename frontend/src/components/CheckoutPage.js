import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {fetchCarts} from "../redux/actions/cartsActions";
import {createOrder} from "../redux/actions/ordersActions";

const CheckoutPage=()=>{
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart_items = useSelector(state => state.carts)
    console.log(cart_items)
    useEffect(()=>{
        dispatch(fetchCarts())
    },[dispatch]);
    const calculateTotal=()=>{
        let total = 0;
        for(const cart of cart_items){
            for(const item of cart.items){
                total += (parseFloat(item.product.price) * item.quantity)
            }
        }
        return total;
    }


    const [formdata, setFormData] =useState(
        {
            name_order:"",
            email_order:"",
            phone_order:"",
            shipping_address:"",
            total_price: calculateTotal()

        }
    )

    const [paymentMethod, setPaymentMethod] = useState("")
    const handleOnchange = (e) =>{
        setFormData({...formdata, [e.target.name]: e.target.value})
    }
    const {name_order,  email_order, phone_order, shipping_address} = formdata

    const handleSubmit= async(e)=>{
        e.preventDefault();
        if(formdata){
            try{
                const orderData = {
                    ...formdata,
                    order_items: cart_items[0].items.map(item => ({
                    product_id: item.product.id,
                    quantity: item.quantity
                    }))
                };
                console.log(orderData);
                dispatch(createOrder(orderData))
                    .then(() => navigate('/dashboard'))
                    .catch((err) => console.error("Order creation failed:", err));
            } catch(error){
                console.error("Error creating order:", error);
                alert('Error creating order')
            }
            localStorage.removeItem("cart")
        }
        else {
            alert('Please fill in all fields')

        }

        /*if(paymentMethod === "momo"){
            navigate("/momo-payment")
        }
        else if(paymentMethod === "paypal"){
            navigate("/paypal-payment")
        }*/

    }
    return(
        <div>
            <h2>Checkout Page</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name_order"> Name: </label>
                    <input
                        type="text"
                        id="name_order"
                        value={name_order}
                        name="name_order"
                        onChange={handleOnchange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email_order"> Email: </label>
                    <input
                        type="email"
                        id="email_order"
                        name="email_order"
                        value={email_order}
                        onChange={handleOnchange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone_order"> Phone: </label>
                    <input
                        type="text"
                        id="phone_order"
                        value={phone_order}
                        name="phone_order"
                        onChange={handleOnchange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="shipping_address"> Address: </label>
                    <input
                        type="text"
                        id="shipping_address"
                        value={shipping_address}
                        name="shipping_address"
                        onChange={handleOnchange}
                        required
                    />
                </div>
                <div>
                    <h4>Payment Method</h4>
                    <div>
                        <input
                            type="radio"
                            id="momo"
                            name="paymentMethod"
                            value="momo"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        />
                        <label htmlFor="momo"> Momo</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="paypal"
                            name="paymentMethod"
                            value="paypal"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        />
                        <label htmlFor="paypal"> PayPal</label>
                    </div>
                    <div>
                        <h4>Oder summary: </h4>
                        <table>
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart_items.map((cart) => (
                                cart.items.map((item) =>
                                    <tr key={item.product.id}>
                                        <td>
                                            <Link to={`/products/${item.product.slug}`}>{item.product.name}</Link>
                                        </td>
                                        <td>${parseFloat(item.product.price).toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                defaultValue={item.quantity}
                                            />
                                        </td>
                                        <td>
                                            ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                )
                            ))}
                            </tbody>
                        </table>

                        <p>Total: ${calculateTotal().toFixed(2)}</p>
                    </div>
                </div>
                <button type="submit">Place oder</button>
            </form>

        </div>
    )
}

export default CheckoutPage;