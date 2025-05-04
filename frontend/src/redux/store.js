import { legacy_createStore as createStore ,applyMiddleware, combineReducers} from "redux";
import {thunk} from "redux-thunk";
import productsReducer from '../reducers/productsReducers';
import categoriesReducers from '../reducers/catogoriesReducers';
import cartsReducers from "../reducers/cartsReducers";
import cartItemsReducers from "../reducers/cartItemsReducers";
import orderReducer from "../reducers/ordersReducers";
import orderitemsReducer from "../reducers/orderitemsReducers";
import myProductReducers from "../reducers/myProductReducers";
import usersReducers from "../reducers/usersReducers";

const rootReducer = combineReducers({
    categories : categoriesReducers,
    products : productsReducer,
    carts : cartsReducers,
    cartitems : cartItemsReducers,
    order : orderReducer,
    orderitems: orderitemsReducer,
    myproducts: myProductReducers,
    authen: usersReducers,
})
const store =   createStore(rootReducer, applyMiddleware(thunk));

export default store;