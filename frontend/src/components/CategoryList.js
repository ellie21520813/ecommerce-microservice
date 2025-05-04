import React from 'react';
import {Link} from 'react-router-dom'
import '../styles.css'

const CategoryList = ({categories})=>{
    return(
        <div>
            <h3>Category</h3>
            <ul>
                {categories.map((category)=>(
                    <li key={category.id}>
                        <Link to={`/categories/${category.slug}`}>{category.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );

};

export default CategoryList;