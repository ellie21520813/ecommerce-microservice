import React from 'react';
import {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {fetchCategories} from "../redux/actions/categoriesActions";
import {useNavigate} from "react-router-dom";
import {addProduct} from "../redux/actions/myProductActions";

const AddProduct=()=>{
  const [formData, setFormData] = useState({
    category:"",
    name:"",
    slug:"",
    description:"",
    price:0,
    stock:0,
    image:null,
    is_flashsale: false,
  })
  const {category, name, slug, description, price, stock, image, is_flashsale} = formData
  const categories = useSelector(state => state.categories)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(()=>{
    dispatch(fetchCategories())
  },[dispatch])

  const handleSubmit= async (e)=>{
    e.preventDefault()
    if(formData){
      try{
        const formDataToSend = new FormData();
        formDataToSend.append("category", category);
        formDataToSend.append("name", name);
        formDataToSend.append("slug", slug);
        formDataToSend.append("description", description);
        formDataToSend.append("price", price);
        formDataToSend.append("stock", stock);
        formDataToSend.append("is_flashsale", is_flashsale);
        formDataToSend.append("image", image);
        console.log("FormData chứa:");
          for (let pair of formDataToSend.entries()) {
          console.log(pair[0], pair[1]);
        }

        dispatch(addProduct(formDataToSend))
                  .then(() => navigate('/myproducts'))
                  .catch((err) => console.error("Add product creation failed:", err));
      }
      catch (error) {
        console.log(error)
        console.error(error.response?.data)
        alert('Error adding product')
      }
    }
    else{
      alert('Please fill in all fields')
    }


  }
  const handleChange=(e)=>{
    const {name, type, files, value} = e.target
        setFormData({...formData,
            [name]: type === 'file' ? files[0] : value
        })
    //setFormData({...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className="container">
      <h1 className="text-center my-4">Add Product</h1>
      <form onSubmit={handleSubmit} className="p-4 border rounded bg-light" encType="multipart/form-data">
        <div className="form-group mt-2">
          <label>Category</label>
          <select name="category" className="form-control" value={category} onChange={handleChange}>
            <option value="">Select Category</option>
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
                onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Price</label>
            <input
                type="number"
                name="price"
                className="form-control"
                value={price}
                onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label>Stock</label>
            <input
                type="number"
                name="stock"
                className="form-control"
                value={stock}
                onChange={handleChange} />
          </div>
        </div>

        <div className="form-group mt -3">
          <label>Slug</label>
          <input
              type="text"
              name="slug"
              className="form-control"
              value={slug}
              onChange={handleChange} />
          <small className="text-muted">Use hyphens (-) to separate words</small>
        </div>

        <div className="form-group mt-3">
          <label>Description</label>
          <textarea
              name="description"
              className="form-control"
              value={description}
              onChange={handleChange} />
        </div>

        <div className="form-group mt-3">
          <label>Product Image</label>
          <input
              type="file"
              name="image"
              className="form-control-file"
              onChange={handleChange} />
        </div>

        <div className="form-check mt-3">
          <input
              type="checkbox"
              className="form-check-input"
              name="is_flashsale"
              checked={is_flashsale}
              onChange={handleChange} />
          <label className="form-check-label">Flash Sale</label>
        </div>

        <button type="submit" className="btn btn-primary mt-4">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;