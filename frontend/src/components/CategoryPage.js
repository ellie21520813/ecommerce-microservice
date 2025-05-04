import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom'
import axios from "axios";


const CategoryPage=() =>{
    const {slug} = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(()=>{
        const fetchCategorytAndProducts = async () =>{
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/products/?category=${slug}`);
                const data = response.data;
                const currentCategory = data.find((product)=>product.category.slug===slug);
                const filteredProducts = data.filter((product) => product.category.slug === slug);
                setCategory(currentCategory.category);
                setProducts(filteredProducts);
            }
            catch(error){
                console.error('Error fetching category and products', error);
            }
        };
        fetchCategorytAndProducts();

    }, [slug]);
    if(!category || products.length === 0){
        return <div>Loading...</div>
    }

    return(
        <div className="category-product">
            <h2>{category.name}</h2>
            <div className="row">
                {products.map((product)=>(
                    <div key={product.id} className="col-md-3 mb-4">
                        <div className="card">
                            <img src={product.image} alt={product.name} className="my-img card-img-top" />
                            <div className="card-body">
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.description}</p>
                                <p className="card-text">Price: {product.price} </p>
                                <p className="card-text">Stock: {product.stock}</p>
                                <Link to={`/products/${product.slug}`} className="btn btn-primary">View Details</Link>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};


export default CategoryPage