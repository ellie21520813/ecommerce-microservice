import React from 'react'
import {Link} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getMyProducts, deleteMyProduct} from "../redux/actions/myProductActions";

const MyProducts=()=>{
    const dispatch = useDispatch();
    const mylistproducts = useSelector(state=>state.myproducts.myProducts);
    useEffect(()=>{
        dispatch(getMyProducts())
    },[dispatch])
    console.log(mylistproducts)

    if (!Array.isArray(mylistproducts)) {
        return <div>Loading...</div>;
    }

    const handleRemoveFromMyProduct = (itemToRemove)=>{
            dispatch(deleteMyProduct(itemToRemove)).then(()=>{
                alert('Removed  product '+itemToRemove +' from my products')
                dispatch(getMyProducts())
            });
        };

    return(
        <div>
            <h1>My Products</h1>
            <h5>This is the list of products I've sold.</h5>
            <div className="category-products">
                <div className="row">
                    {mylistproducts.map(product => (
                        <div key={product.id} className="col-md-3 mb-4">
                            <div className="card">
                                <img src={product.image} alt={product.name} className="my-img card-img-top"/>
                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <h6 className="card-text">Category: {product.category.name}</h6>
                                    <p className="card-text">Description: {product.description}</p>
                                    <p className="card-text">Price: {product.price} $</p>
                                    <p className="card-text">Stock: {product.stock}</p>
                                    <div className= "d-flex justify-content-center gap-2">
                                        <Link to={`/products/${product.id}`} className="btn btn-primary">View detail</Link>
                                        <Link to={`/edit-product/${product.id}`} className="btn btn-primary">Update</Link>
                                        <button className="btn btn-primary" onClick={() => handleRemoveFromMyProduct(product.id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyProducts