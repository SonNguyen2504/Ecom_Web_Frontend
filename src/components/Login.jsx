import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import { ShopContext } from '../context/ShopContext';

function Login() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { fetchCart } = useContext(ShopContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
      const response = await axios.post('http://localhost:3030/api/auth/login', {
        username,
        password,
      }, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      if (response.status === 200) {
        setMessage('Đăng nhập thành công!');
        localStorage.setItem('auth-token', data.token || 'dummy-token');
        localStorage.setItem('username', data.username || username); // Lưu username
        // Gọi fetchCart để cập nhật giỏ hàng
        if (fetchCart) fetchCart();
        navigate('/'); // Redirect to Home after successful login
      } else {
        setMessage(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      setMessage('Lỗi kết nối server!');
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng Nhập</h2>
      {message && (
        <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Đăng Nhập</button>
      </form>
      <p className="toggle">
        Chưa có tài khoản?{' '}
        <button type="button" onClick={() => navigate('/register')}>
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}

export default Login;