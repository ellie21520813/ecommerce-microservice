import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import ProductCart from "./ProductCart";
import '../styles.css'


const SearchResultsPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        const  fetchSearchResults = async ()=>{
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/products/?q=${searchQuery}`)
                if(!response.ok){
                    throw new Error('Failed to fetch data')
                }
                const data = await response.json();
                setSearchResult(data);
            }
            catch(error){
                console.error('Error fetching data', error);
            }
        };
        fetchSearchResults();
    }, [searchQuery]);
    return(
        <div className="search-result">
            <h1>Search Results for: "{searchQuery}"</h1>
            <div className='row'>
                {searchResult.map((product)=>(
                    <div key={product.id} className='col-md-3 mb-4'>
                        <ProductCart product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default SearchResultsPage