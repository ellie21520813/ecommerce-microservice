import React from 'react';
import {Link} from "react-router-dom";


const ProductCart = ({product}) =>{
    return(
        <div className='cart' >
            <img src ={product.image} className='card-img-top my-img' alt={product.name}/>
            <div className='card-body'>
                <h5 className='card-title'>{product.name}</h5>
                <p className='card-description'>{product.description}</p>
                <p className='card-text'>Price: ${product.price}</p>
                <Link to={`/products/${product.id}`} className='btn btn-primary'>View Details</Link>
            </div>
        </div>
    )
}

export default ProductCart;