import './App.css';
import HomePage from "./components/HomePage";
import ProductDetails from "./components/ProductDetails";
import SearchResultsPage from "./components/SearchResultsPage";
import CartPage from "./components/CartPage";
import {Link, useNavigate, Route, Routes} from "react-router-dom";
import React, {useState, useEffect} from "react";
import CategoryPage from "./components/CategoryPage";
import CheckoutPage from "./components/CheckoutPage";
import Signup from "./components/Signup";
import PasswordResetRequest from './components/PasswordResetRequest';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';
import VerifyEmail from './components/VerifyEmail';
import Login from './components/Login';
import RegisteVendor from "./components/RegisteVendor";
import createAxiosInstance from "./utils/AxiosInstance";
import AddProduct from "./components/AddProduct";
import MyProducts from "./components/MyProducts";
import UpdateProduct from "./components/UpdateProduct";
import {useDispatch} from "react-redux";
import {logout} from "./redux/actions/usersAction";
import PrivateRoute from './components/PrivateRoute';


function App() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    }
    const [cart, setCart] = useState(
        (localStorage.getItem("cart") !== null ? JSON.parse(localStorage.getItem("cart")) : [])
    );
    const dispatch = useDispatch();
    const access = localStorage.getItem("access_token");
    const refresh = localStorage.getItem("refresh_token");
    const userInfor =  JSON.parse(localStorage.getItem("user"))
    const vendor = JSON.parse(localStorage.getItem('vendor'))
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);

    useEffect(() => {
        if (access && refresh) {
          dispatch({
            type: "RESTORE_TOKENS",
            payload: {
              token: access,
              refresh_token: refresh,
              user: userInfor,
              vendor: vendor
            }
          });
        }
        setIsLoadingAuth(false); 
    }, [dispatch]);
    if (isLoadingAuth) {
        return <div>Loading authentication...</div>;
    }

    const handleLogout = async () => {
        const authenAPI = createAxiosInstance("http://localhost:8080/api/");


        if (!refresh) {
            alert("Refresh token not found");
            return;
        }

        try {
            const res = await authenAPI.post('logout/', {refresh_token: refresh});

            if (res.status === 204) {
            dispatch(logout());
            navigate('/');
            alert("Logout successful");
        }
        } catch (error) {
            console.error("Logout failed:", error);
            console.error(error.response?.data)
            if (error.response) {
                alert("Logout failed: " + error.response.data.message || "Unknown error");
            } else {
                alert("Logout failed: Network error");
            }
        }
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?q=${searchQuery}`);
        }
    }
    return (

        <div>
            {/*navbar start*/}
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Shopping <i className="fa-solid fa-cart-shopping"></i></Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0" >
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/signup  ">Link</Link>
                            </li>
                            <li className="nav-item dropdown">
                                <p className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                                   aria-expanded="false">
                                    Category
                                </p>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/accessories">Accessories</Link></li>
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/computers">Computers</Link>
                                    </li>
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/tvs">Phones</Link></li>
                                    <li><Link className="dropdown-item"
                                              to="http://localhost:3000/categories/phones">TVs</Link></li>
                                    <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                    <li>
                                        <hr className="dropdown-divider"/>
                                    </li>
                                    <li><Link className="dropdown-item" to="/dashboard">Account</Link></li>
                                </ul>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/cart">Cart ({cart.length})</Link>
                            </li>
                            <form className="navbar navbar-expand-lg navbar-light bg-light input-form " role="search"
                                  onSubmit={handleSubmit}>
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </ul>

                        {!refresh ?
                            (
                                <div className="nav-siglog">
                                    <div className="nav-item">
                                        <Link className="nav-link" to="/signup">Signup</Link>
                                    </div>
                                    <div className="nav-item">
                                        <Link to="/login" className="nav-link">Login</Link>
                                    </div>
                                </div>) : (
                                <div className="nav-item dropdown">
                                    <p className="nav-link dropdown-toggle" href="#" role="button"
                                       data-bs-toggle="dropdown"
                                       aria-expanded="false">
                                        {userInfor.name}
                                    </p>
                                    <ul className="dropdown-menu">
                                        <li><Link className="dropdown-item"
                                                  to="/dashboard">Profile</Link>
                                        </li>
                                        <li><p className="dropdown-item"
                                               onClick={handleLogout}>Logout</p>
                                        </li>
                                    </ul>
                                </div>
                            )}

                    </div>
                </div>
            </nav>
            {/*navbar end*/}
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path='/products/:id' element={<ProductDetails/>}/>
                <Route path='/search' element={<SearchResultsPage/>}/>
                <Route path='/categories/:slug' element={<CategoryPage/>}/>
                <Route path='/signup' element={<Signup/>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/otp/verify'} element={<VerifyEmail/>}/>
                <Route path='/forget-password' element={<PasswordResetRequest/>}/>
                <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword/>}/>
                <Route path='/cart' element={<PrivateRoute><CartPage cart={cart} setCart={setCart}/></PrivateRoute>}/>
                <Route path={'/checkout'} element={<PrivateRoute><CheckoutPage cart={cart} setCart={setCart}/></PrivateRoute>}/>
                <Route path='/dashboard' element={<PrivateRoute><Profile/></PrivateRoute>}/>
                <Route path = '/register-vendor' element ={<PrivateRoute><RegisteVendor/></PrivateRoute>}/>
                <Route path='/add-product' element={<PrivateRoute><AddProduct/></PrivateRoute>}/>
                <Route path='/myproducts' element={<PrivateRoute><MyProducts/></PrivateRoute>}/>
                <Route path='/edit-product/:slug' element={<PrivateRoute><UpdateProduct/></PrivateRoute>}/>


                {/*add more routes as needed*/}
            </Routes>
        </div>
    );
}

export default App;
