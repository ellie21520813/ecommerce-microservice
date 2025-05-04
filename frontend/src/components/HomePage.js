import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchCategories} from "../redux/actions/categoriesActions";
import {fetchProducts} from "../redux/actions/productsActions";
import CategoryProducts from "../components/CategoryProducts";
import CategoryList from "../components/CategoryList";
import FlashSaleProducts from "../components/FlashSaleProducts";
import TopSellingProducts from "../components/TopSellingProducts";
import '../styles.css'

const HomePage = ()=>{
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.categories);
    const products = useSelector((state)=> state.products.products);

    useEffect(()=>{
        dispatch(fetchCategories());
        dispatch(fetchProducts());
    }, [dispatch]);
    console.log('products', products)

    const flashsaleproduct = products.filter(product => product.is_flashsale).slice(0,5)
    return(
        <div className="home-page">
            {/*first row for listing categories or flash sale products*/}
            <div className="row">
                <div className="col-md-3">
                    <CategoryList categories={categories} />
                </div>
                <div className="col-md-9">
                    <FlashSaleProducts products={flashsaleproduct} />
                </div>
                {/*second row for listing top selling products*/}
                <div className='row'>
                    <TopSellingProducts products = {products}/>
                </div>
                {/*forth and fith row for product*/}
                {categories.map((category)=>(
                    <div key = {category.id} className='row'>
                        <CategoryProducts category = {category} products = {products}/>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default HomePage