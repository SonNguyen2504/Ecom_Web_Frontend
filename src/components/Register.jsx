import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const phoneNumber = formData.get('phoneNumber');

    try {
      const response = await fetch('http://localhost:3030/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, phoneNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setTimeout(() => navigate('/login'), 2000); // Redirect to Login after 2 seconds
      } else {
        setMessage(data.message || 'Đăng ký thất bại!');
      }
    } catch (error) {
      setMessage('Lỗi kết nối server!');
    }
  };

  return (
    <div className="register-container">
      <h2>Đăng Ký</h2>
      {message && (
        <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Tên người dùng</label>
          <input type="text" name="username" required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" required />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input type="text" name="phoneNumber" required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Đăng Ký</button>
      </form>
      <p className="toggle">
        Đã có tài khoản?{' '}
        <button type="button" onClick={() => navigate('/login')}>
          Đăng nhập ngay
        </button>
      </p>
    </div>
  );
}

export default Register;