import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import Navbar from "./Navbar";
import '../styles/Checkout.css';

const Checkout = () => {
    const { cart, cartId, clearCart, fetchCart } = useContext(ShopContext);
    const token = localStorage.getItem('auth-token');
    const [formData, setFormData] = useState({
        address: "",
        phone: "",
        paymentMethod: "COD",
    })

    console.log('Cart ID:', cartId);

    const changeHandler = (e) => {
        console.log('Form data changed:', e.target.name, e.target.value);
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handlePlaceOrder = async () => {
        try {
            if (!token) {
                alert('Vui lòng đăng nhập để đặt hàng!');
                return;
            }

            if(!formData.address || !formData.phone) {
                alert('Vui lòng điền đầy đủ thông tin địa chỉ và số điện thoại!');
                return;
            }

            const response = await axios.post(`http://localhost:3030/api/order/create-order/${cartId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                }
            );

            console.log('Order response:', response);

            if (response.status === 201) {
                console.log('Order placed successfully:', response.data);
                alert('Đặt hàng thành công!');
                // Reset form data after successful order
                setFormData({
                    address: "",
                    phone: "",
                    paymentMethod: "COD",
                });
                clearCart(); // Clear cart after placing order
            }

        } catch (error) {
            console.error('Error placing order:', error);
        }
    }


    return (
        <div>
            <Navbar />
            <h1>Trang thanh toán</h1>
            <div className="cart-container">
                <h2>Giỏ Hàng</h2>
                {cart.length > 0 ? (
                    <div className="cart-list">
                        {cart.map((item) => (
                            <div key={item._id} className="cart-item">
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
                                    <p>Số lượng: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Giỏ hàng của bạn đang trống.</p>
                )}
            </div>
            <div className="order-info">
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={changeHandler}
                    placeholder="Nhập địa chỉ của bạn tại đây"
                />
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={changeHandler}
                    placeholder="Nhập số điện thoại của bạn tại đây"
                />
                <select name="paymentMethod" value={formData.paymentMethod} onChange={changeHandler}>
                    <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                    <option value="Card">Thanh toán qua thẻ</option>
                </select>
            </div>
            <div className="checkout-button">
                <button onClick={() => {handlePlaceOrder()}}>Đặt hàng</button>
            </div>
        </div>
    );
}

export default Checkout;