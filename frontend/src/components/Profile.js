import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import AxiosInstance from "../utils/AxiosInstance";
import {useSelector, useDispatch} from "react-redux";
import {fetchOrders} from "../redux/actions/ordersActions";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(state => state.authen.token);
  const user = useSelector(state => state.authen.user);
  const orders = useSelector(state => state.order.orders);

  const [is_vendor, setIsVendor] = useState();

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
    } else {
      getSomeData();
    }
  }, [token, user, navigate]);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getSomeData = async () => {
    try {
      const res = await AxiosInstance.get('get-something/');
      setIsVendor(res.data.is_vendor);
      console.log('vendor', res.data);
    } catch (error) {
      console.error('Failed to fetch vendor data', error);
    }
  }

  const register_vendor = () => {
    navigate('/register-vendor');
  }

  if (!orders) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <div className='container'>
        <h2>hi {user && user.name}</h2>
        <p style={{textAlign: 'center'}}>Welcome to your profile</p>

        {!is_vendor ? (
          <div>
            <p>You are not a vendor</p>
            <button className='btn btn-primary' onClick={register_vendor}>Register Vendor</button>
          </div>
        ) : (
          <div>
            <p style={{textAlign: 'center'}}>You are a vendor</p>
            <p style={{textAlign: 'center'}}>
              <Link to='/add-product'>Add Product</Link> Or <Link to='/myproducts'>My Product</Link>
            </p>
          </div>
        )}
      </div>

      <h2 style={{textAlign: 'left'}}>Your Orders</h2>
      <div>
        {orders.length === 0 ? (
          <h3>You haven't orders</h3>
        ) : (
          orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((order) => (
            <div className="order-info" key={order.id}>
              <div>
                <h2>Order ID: {order.id}</h2>
                <p><strong>Name:</strong> {order.name_order}</p>
                <p><strong>Phone:</strong> {order.phone_order}</p>
                <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
                <p><strong>Total Price:</strong> ${order.total_price}</p>
              </div>

              {order.items.map((item) => (
                <div className="product-detail" key={item.id}>
                  <div>
                    <img src={`http://localhost:8000${item.product.image}`} alt={item.product.name} className="my-img" />
                  </div>
                  <div className="detail-card">
                    <h1>{item.product.name}</h1>
                    <p className="product-description">{item.product.description}</p>
                    <p>Price: {item.product.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total price: {item.product.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Profile;
