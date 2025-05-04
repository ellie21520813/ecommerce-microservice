import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {fetchProductsDetails} from "../redux/actions/productsActions";
import {useSelector} from "react-redux";
import { orderAPI, productAPI } from '../api';

const ProductDetails = ()=>{
    const {id} = useParams();
    const product = useSelector(state => state.products.productDetails)
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();
    const dispatch =useDispatch()

    useEffect(()=>{
        dispatch(fetchProductsDetails(id))
    },[dispatch, id]);

    if (!product) {
        return <div>Loading product...</div>;
    }

    const handleAddToCart = async () => {
        const cartItems ={
            product: product.id,
            quantity: quantity,
        };
        console.log("Cart request data:", cartItems);

        const updatedCart = cart.concat(cartItems);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        try{
            const response = await orderAPI.post("cart-item/", cartItems);
            console.log(response.data);
            if(response.status ===201){
                alert("Product added to cart successfully!");
                navigate('/cart');
            }
            else{
                alert("Failed to add product to cart!");
            }
        }  catch(error){
            console.log(error);
        }
    }
   return (
       <div>
           <div className="product-detail">
               <div>
                   <img src={product.image} alt={product.name} className="my-img"/>
               </div>
               <div className="detail-card">
                   <h1>{product.name}</h1>
                   <p className="product-description">{product.description}</p>
                   <p>Price: {product.price}</p>
                   <p>Stock: {product.stock}</p>
                   <div className="shipping-infor">
                       <p>Shipping address: {product.shipping_address}</p>
                       <p>Shipping policy: <a href={product.shipping_policy}>Click here</a>for shipping policy </p>
                       <p>Return policy: <a href={product.return_policy}>Click here</a> for return policy </p>
                   </div>
                   <div className="label-quantity">
                       <label htmlFor="quantity">Quantity:</label>
                       <input
                           type="number"
                           id="quantity"
                           value={quantity}
                           min="1"
                           max={product.stock}
                           onChange={(e) => setQuantity(e.target.value)}/>
                   </div>
                   <button className="btn btn-primary" onClick={()=>handleAddToCart(product)}>Add product</button>
               </div>
           </div>
           {product.vendor && (
               <div className="vendor-infor">
                   <h3>Vendor information</h3>
                   <p>Vendor: {product.vendor.user}</p>
                   <p>Contact: {product.vendor.contact_details}</p>
                   <p>Bio: {product.vendor.bio}</p>
               </div>
           )}


       </div>

   );

}


export default ProductDetails;