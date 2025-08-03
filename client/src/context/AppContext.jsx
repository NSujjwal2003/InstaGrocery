import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();
//waiter

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchProducts = async () => {
        setProducts(dummyProducts); 
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    //add to cart function
    const addToCart = (ItemId) => {
    let cartData = structuredClone(cartItems);
    if(cartData[ItemId]){
        cartData[ItemId] += 1; 
    } else {
        cartData[ItemId] = 1; 
    }
    setCartItems(cartData);
    toast.success("Item added to cart successfully!");
    }


    //update cart item quntity
    const updateCartItem = (ItemId, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[ItemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart updated successfully!");
    }

    //remove item from cart
    const removeCartItem = (ItemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[ItemId]){
            cartData[ItemId] -= 1  ;
            if(cartData[ItemId] === 0){
                delete cartData[ItemId];
            }
        }
        toast.success("Item removed from cart successfully!");
        setCartItems(cartData);
    }

    //get cart item count
    const getCartCount = () => {
        let totalCount = 0;
        for (const key in cartItems) {
            totalCount += cartItems[key];
        }
        return totalCount;
    }

    //get cart total price
    const getCartAmount = () => {
        let totalPrice = 0;
        for (const key in cartItems) {
            let itemInfo = products.find((product) => product._id === key);
            if (cartItems[key]) {
                totalPrice += itemInfo.offerPrice * cartItems[key];
            }
        }
        return Math.floor(totalPrice * 100) / 100; // Round to two decimal places
    }

    const value = {navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeCartItem, cartItems, searchQuery, setSearchQuery, getCartCount, getCartAmount};
    return <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}
//calling the waiter
