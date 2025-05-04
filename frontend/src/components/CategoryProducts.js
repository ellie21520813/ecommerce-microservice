import React from 'react';
import {Link} from 'react-router-dom'
import '../styles.css'

const CategoryProducts = ({ category, products})=>{
    const categoryProducts = products.filter(
        (product) => product.category.id === category.id
    );
    return(
        <div className="category-products">
            <h3>{category.name}</h3>
            <div className="row">
                {categoryProducts.map(product => (
                    <div key={product.id} className="col-md-3 mb-4">
                        <div className="card">
                            <img src={product.image} alt={product.name} className="my-img card-img-top"/>
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">Price: {product.price} $</p>
                                <p className="card-text">Stock: {product.stock}</p>
                                <Link to={`/products/${product.id}`} className="btn btn-primary">View detail</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default CategoryProducts