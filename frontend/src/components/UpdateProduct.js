import React from 'react'
import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import { fetchProductsDetails} from "../redux/actions/productsActions";
import {fetchCategories} from "../redux/actions/categoriesActions";
import {updateProduct} from "../redux/actions/myProductActions";

const UpdateProduct=()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {slug} = useParams()
    const productDetails = useSelector(state => state.products.productDetails)
    const categories = useSelector(state => state.categories)
    const [formData, setFormData] = useState({
        category:"",
        name:"",
        description:"",
        price:0,
        stock:0,
        image: null,
        is_flashsale: false,
    })
    const {category, name, description, price, stock, image, is_flashsale} = formData
    useEffect(()=>{
        dispatch(fetchProductsDetails(slug))
        dispatch(fetchCategories())
    }, [dispatch, slug])

    useEffect(() => {
        if (productDetails) {
            setFormData({
                category: productDetails.category?.id || "",
                name: productDetails.name || "",
                description: productDetails.description || "",
                price: productDetails.price || 0,
                stock: productDetails.stock || 0,
                image: productDetails.image || null,
                is_flashsale: productDetails.is_flashsale || false,
            });
        }
    }, [productDetails]);

    if (!productDetails||!categories) {
        return <div className="text-center">Loading...</div>;
    }
    const handleChange = (e) => {
        const {name, type, files, value} = e.target
        setFormData({
            ...formData,
            [name]: type === 'file'? files[0] : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const formDatatoSend = new FormData();
            formDatatoSend.append('name', name);
            formDatatoSend.append('description', description);
            formDatatoSend.append('price', price);
            formDatatoSend.append('stock', stock);
            if (image instanceof File) {
                        formDatatoSend.append('image', image);
                    }
            formDatatoSend.append('is_flashsale', is_flashsale);
            formDatatoSend.append('category', category);

            dispatch(updateProduct(slug, formDatatoSend))
                .then(() => navigate('/myproducts'))
                .catch((err) => console.error("Update product creation failed:", err));

        }
        catch(error){
            console.error(error.response?.data)
            console.error(error)
        }
    }

    return(
        <div className='container'>
            <h1 className="text-center my-4">Product Update</h1>
            <form onSubmit={handleSubmit} className="p-4 border rounded bg-light" encType="multipart/form-data">
                <div className="form-group mt-2">
                    <label>Category</label>
                    <select name="category" className="form-control" value={category} onChange={handleChange}>
                    <option value="">{productDetails.category?.name || "Loading..."}</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row mt-3">
                    <div className="col-md-4">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            value={name}
                            onChange={handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            value={price}
                            onChange={handleChange}/>
                    </div>
                    <div className="col-md-4">
                        <label>Stock</label>
                        <input
                            type="number"
                            name="stock"
                            className="form-control"
                            value={stock}
                            onChange={handleChange}/>
                    </div>
                </div>
                <div className="form-group mt-3">
                    <label>Description</label>
                    <textarea
                        name="description"
                        className="form-control"
                        value={description}
                        onChange={handleChange}/>
                </div>

                <div className="form-group mt-3">
                    <label>Product Image</label>
                    <img src={image} className='card-img-top my-img' alt={name}
                         style={{ width: "150px", height: "150px", objectFit: "cover" }}/>
                    {image && (
                        <p className="mt-2 text-muted">Current file: {image.split('/').pop()}</p>
                    )}
                    <input
                        type="file"
                        name="image"
                        className="form-control-file"
                        onChange={handleChange}/>
                </div>

                <div className="form-check mt-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        name="is_flashsale"
                        checked={is_flashsale}
                        onChange={handleChange}/>
                    <label className="form-check-label">Flash Sale</label>
                </div>

                <button type="submit" className="btn btn-primary mt-4">Add Product</button>
            </form>

        </div>
    )
}

export default UpdateProduct