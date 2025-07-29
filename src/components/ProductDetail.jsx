import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Feedback from "./Feedback";
import '../styles/ProductDetail.css';
import { ShopContext } from "../context/ShopContext";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  const { addToCart } = useContext(ShopContext);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3030/api/product/${productId}`);
        if (response.status !== 200) {
          throw new Error('Network response was not ok');
        }
        const data = response.data.data;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product detail:', error);
        setMessage('Lỗi khi tải thông tin sản phẩm!');
      }
    };

    fetchProductDetail();
  }, [productId]);

  return (
    <div>
      <Navbar />
      <div className="product-detail-container">
        {message && (
          <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
        {product ? (
          <>
            <h2>{product.name}</h2>
            <img src={product.image} alt={product.name} className="product-detail-image" />
            <p className="product-detail-description">{product.description}</p>
            <p className="product-detail-price">{product.price.toLocaleString()} VND</p>
            <button type="button" className="add-to-cart" onClick={() => {addToCart(productId)}}>
              Thêm vào giỏ hàng
            </button>
            <Link to="/" className="back-link">Quay lại trang chủ</Link>
          </>
        ) : (
          <p>Loading product details...</p>
        )}
      </div>
      <Feedback productId={productId} />
    </div>
  );
};

export default ProductDetail;