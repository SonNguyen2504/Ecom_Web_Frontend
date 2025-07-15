import { useContext } from 'react';
import Navbar from './Navbar';
import '../styles/Home.css';
import '../styles/all.css';
import { Link, Outlet } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

function Home() {
  const {products} = useContext(ShopContext);

  return (
    <div>
      <Navbar />
      <div className="home-container">
        <h2>Danh Sách Sản Phẩm</h2>
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <h3>
                  <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>
                <p className="product-price">{product.price.toLocaleString()} VND</p>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào hoặc đã xảy ra lỗi khi tải sản phẩm!</p>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Home;