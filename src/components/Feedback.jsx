import axios from "axios";
import { useEffect, useState } from "react";
import '../styles/Feedback.css';

const Feedback = ({ productId }) => {
  const [feedback, setFeedback] = useState([]);
  const [formData, setFormData] = useState({
    comment: "",
    rating: 0,
  });

  const token = localStorage.getItem('auth-token');

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const addFeedback = async () => {
    try {
      if (!token) {
        alert('Vui lòng đăng nhập để thêm phản hồi!');
        return;
      }

      if (!formData.comment || formData.rating <= 0) {
        alert('Vui lòng điền đầy đủ thông tin phản hồi và đánh giá!');
        return;
      }

      const response = await axios.post(`http://localhost:3030/api/feedback/${productId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
      });

      if (response.status === 200) {
        console.log('Feedback added successfully:', response.data);
        setFormData({ comment: "", rating: 0 });
        fetchFeedback();
      } else {
        console.error('Failed to add feedback:', response.status);
      }
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`http://localhost:3030/api/feedback/${productId}`);
      console.log('Feedback fetched successfully:', response.data.data);
      if (response.status === 200) {
        setFeedback(response.data.data);
      } else {
        console.error('Failed to fetch feedback:', response.status);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [productId]);

  return (
    <div>
      <div className="feedback-container">
        <h3>Phản Hồi</h3>
        {feedback.length > 0 ? (
          feedback.map((item) => (
            <div key={item._id} className="feedback-item">
              <p><strong>{item.user.username}</strong>:</p>
              <p>{item.comment}</p>
              <p className="feedback-rating">
                Rating: {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
              </p>
            </div>
          ))
        ) : (
          <p>Chưa có phản hồi nào cho sản phẩm này.</p>
        )}
      </div>
      <div className="add-feedback">
        <h4>Thêm Phản Hồi</h4>
        <input
          name="comment"
          value={formData.comment}
          onChange={changeHandler}
          type="text"
          placeholder="Hãy nhập phản hồi của bạn về sản phẩm"
          className="feedback-input"
        />
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${formData.rating >= star ? 'filled' : ''}`}
              onClick={() => handleRatingClick(star)}
            >
              {formData.rating >= star ? '★' : '☆'}
            </span>
          ))}
        </div>
        <button className="add-comment" onClick={addFeedback}>
          Thêm Phản Hồi
        </button>
      </div>
    </div>
  );
};

export default Feedback;