import React, {useEffect} from 'react';
import {Link,useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchCarts} from "../redux/actions/cartsActions";
import {deleteCartItems} from "../redux/actions/cartItemsActions";
import { fetchProductsDetailsBatch } from '../redux/actions/productsActions';

const CartPage=({cart, setCart})=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cartitems = useSelector((state) => state.carts)
    const productDetailsBatch = useSelector(state=>state.products.productBatch)
    useEffect(() => {
        dispatch(fetchCarts()).then((res)=>{
            const productIds = new Set()
            res.payload.forEach(cart => {
                cart.items.forEach(item => productIds.add(item.product));
            });
            dispatch(fetchProductsDetailsBatch(Array.from(productIds)))
        })
    }, [dispatch]);
    if (!cartitems) {
        return <div className="text-center">Loading...</div>;
    }
    const handleRemoveFromCart = (itemToRemove)=>{
        /* updateCart = cartitems.filter((item)=> item.id !== itemToRemove.id);
        localStorage.setItem("cart", JSON.stringify(updateCart));
        setCart(updateCart);*/
        dispatch(deleteCartItems(itemToRemove)).then(()=>{
            dispatch(fetchCarts())
        });
    };

    const handleUpdateQuantity = (item, newQuantity)=>{
        const updateCart = cartitems.map((cartItem)=> {
            if(item.id === cartItem.id){
                return {...cartItem, quantity: newQuantity}
            }
            return cartItem;
        });
        localStorage.setItem("cart", JSON.stringify(updateCart));
        setCart(updateCart);
    }
    const handleCheckout =()=>{
        navigate('/checkout');

    }

    const calculateTotal=()=>{
        let total = 0;
        for(const cart of cartitems){
            for(const item of cart.items){
                total += (parseFloat(item.product.price) * item.quantity)
            }
        }
        return total;
    }
    return(
        <div className="cart-page">
            <h1>Your cart</h1>
            {cart.length === 0?(
                <p>No items in the cart</p>
            ):(
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {cartitems.map((cartitem) => (
                        cartitem.items.map((item) => {
                            const product = productDetailsBatch[item.product];
                            if (!product) return null; 
                            return (
                                <tr key={item.id}>
                                    <td>
                                        <Link to={`/products/${product.id}`}>{product.name}</Link>
                                    </td>
                                    <td>${parseFloat(product.price).toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateQuantity(item, parseInt(e.target.value))}
                                        />
                                    </td>
                                    <td>${(parseFloat(product.price) * item.quantity).toFixed(2)}</td>
                                    <td><button onClick={() => handleRemoveFromCart(item.id)}>Remove</button></td>
                                </tr>
                            );
                        })
                    ))}

                    </tbody>
                </table>
            )}
            <div>
                <h2>Total: ${calculateTotal().toFixed(2)}</h2>
                <button onClick={handleCheckout}>Proceed to checkout</button>
            </div>
        </div>
    )
};


export default CartPage