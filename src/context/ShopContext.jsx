import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const ShopContext = createContext();
 
const ShopContextProvider = (props) => {
    const [products, setProducts] = useState([]);
    const [cartInfo, setCartInfo] = useState(null);
    const [cart, setCart] = useState([]);
    const [cartId, setCartId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3030/api/product');

                if (response.status === 200) {
                    setProducts(response.data.data);
                    console.log('product context fetched')
                }
                else {
                    console.error('Failed to fetch products:', response.status);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();
        fetchCart();
    }, [])

    // Hàm fetchCart để cập nhật giỏ hàng khi đăng nhập
    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                console.warn('No auth token found, cart will not be fetched');
                setCart([]);
                return;
            }

            const response = await axios.get('http://localhost:3030/api/cart', {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                },
            });

            if (response.status === 200) {
                setCartId(response.data.data._id || null);
                setCart(response.data.data.cartItems || []);
                setCartInfo(response.data.data);
                console.log(response.data.data);
                console.log('Cart fetched successfully');
            } else {
                console.error('Failed to fetch cart:', response.status);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    // useEffect(() => {
    //     fetchCart();
    // }, []);
    
    const addToCart = async (productId) => {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
                console.warn('No auth token found, cannot add to cart');
                return;
            }

            const response = await axios.post(
                `http://localhost:3030/api/cart/add-to-cart/${productId}`, 
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('auth-token'),
                    },
                }
            );

            if (response.status === 200) {
                setCart(response.data.data.cartItems || []);
                alert('Product added to cart successfully');
                console.log('Product added to cart successfully');
            } else {
                console.error('Failed to add product to cart:', response.status);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    // Hàm clearCart để xóa giỏ hàng khi logout
    const clearCart = () => {
        setCart([]);
        setCartInfo(null);
        setCartId(null);
    };
    
    const getTotalCartCount = () => {
        let totalCount = 0;
        cart.forEach(item => {
            totalCount += item.quantity || 0; // Assuming each item has a quantity property
        });

        return totalCount;
    }

    const contextValue = {
        products,
        cart,
        cartId,
        cartInfo,
        getTotalCartCount,
        addToCart,
        fetchCart,
        clearCart,
    };


    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;