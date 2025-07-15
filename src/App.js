import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail';
import CartInfo from './components/CartInfo';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/cartInfo" element={<CartInfo />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;