import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import '../styles/CartInfo.css';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

function CartInfo() {
  const token = localStorage.getItem('auth-token');
  const { cartInfo, fetchCart } = useContext(ShopContext);
  const cart = cartInfo ? cartInfo.cartItems : [];
  const navigate = useNavigate();

  useEffect(() => {
    if(token && fetchCart) {
      fetchCart();
    } 
  }, [])
  
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Tăng số lượng sản phẩm
  const handleIncrease = async (productId, currentQuantity) => {
    try {
      await axios.put(
        `http://localhost:3030/api/cart/update-cart/${productId}`,
        { quantity: currentQuantity + 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        }
      );
      fetchCart();
    } catch (err) {
      alert('Lỗi khi tăng số lượng sản phẩm!');
    }
  };

  // Giảm số lượng sản phẩm
  const handleDecrease = async (productId, currentQuantity) => {
    if (currentQuantity <= 1) return;
    try {
      await axios.put(
        `http://localhost:3030/api/cart/update-cart/${productId}`,
        { quantity: currentQuantity - 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        }
      );
      fetchCart();
    } catch (err) {
      alert('Lỗi khi giảm số lượng sản phẩm!');
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleDelete = async (productId) => {
    try {
      await axios.delete(
        `http://localhost:3030/api/cart/delete-cart-item/${productId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token,
          },
        }
      );
      fetchCart();
    } catch (err) {
      alert('Lỗi khi xóa sản phẩm khỏi giỏ hàng!');
    }
  };

  const handleCheckoutClick = () => {
    navigate('/checkout');
  }

  return (
    <div>
      <Navbar />
      <div className="cart-container">
        <h2>Giỏ Hàng</h2>
        {cart.length > 0 ? (
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item._id} className="cart-item modern-cart-item">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p className="cart-item-price">
                    {item.product.price.toLocaleString()} VND
                  </p>
                  <div className="cart-quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => handleDecrease(item.product._id, item.quantity)}
                      disabled={item.quantity <= 1}
                    >-</button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleIncrease(item.product._id, item.quantity)}
                    >+</button>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  title="Xóa sản phẩm"
                  onClick={() => handleDelete(item.product._id)}
                >×</button>
              </div>
            ))}
            <div className="cart-summary modern-cart-summary">
              <h3>Tổng cộng:</h3>
              <p>
                {cartInfo.total.toLocaleString()} VND
              </p>
            </div>
            <div className="checkout-button">
              <button onClick={handleCheckoutClick}>Thanh Toán</button>
            </div>
          </div>
        ) : (
          <p>Giỏ hàng của bạn đang trống.</p>
        )}
      </div>
    </div>
  );
}

export default CartInfo;