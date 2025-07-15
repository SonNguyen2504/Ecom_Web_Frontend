import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { ShopContext } from '../context/ShopContext';

function Navbar() {
  const isLoggedIn = !!localStorage.getItem('auth-token');
  const username = localStorage.getItem('username') || 'User';
  const navigate = useNavigate();

  const {getTotalCartCount, clearCart} = useContext(ShopContext);

  const handleCartClick = () => {
    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để sử dụng giỏ hàng!');
      navigate('/');
    } else {
      navigate('/cartInfo');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('username');
    if (clearCart) clearCart();
    alert('Đăng xuất thành công!');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Cửa Hàng</div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li className="navbar-username">Xin chào, {username}</li>
            <li>
              <button type="button" onClick={handleLogout}>
                Đăng Xuất
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Đăng Nhập</Link>
            </li>
            <li>
              <Link to="/register">Đăng Ký</Link>
            </li>
          </>
        )}
        <li className="cart-icon">
          <button type="button" onClick={handleCartClick}>
            🛒 Giỏ Hàng ({getTotalCartCount()})
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;