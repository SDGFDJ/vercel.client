import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Axios from '../utils/Axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { IoStar, IoStarOutline, IoClose, IoTrashBinOutline } from 'react-icons/io5';

const ReviewSection = ({ productId }) => {
  const user = useSelector((state) => state.user);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await Axios.get(`/api/review/${productId}?limit=3`);
      if (res.data.success) {
        setReviews(res.data.data);
        setTotalReviews(res.data.totalReviews);
        const avg = res.data.averageRating;
        setAverageRating(typeof avg === 'number' ? avg : parseFloat(avg) || 0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addReview = async () => {
    if (!user?._id) return toast.error('You must be logged in to submit a review');
    if (!rating) return toast.error('Please select a rating');

    try {
      const res = await Axios.post('/api/review/add', {
        productId,
        userId: user._id,
        rating,
        comment,
      });
      if (res.data.success) {
        toast.success('Review submitted successfully!');
        setComment('');
        setRating(5);
        setIsModalOpen(false);
        fetchReviews();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit review');
    }
  };

  // ✅ Updated delete function
  const deleteReview = async (reviewId) => {
    if (!user?.role || user.role !== 'ADMIN') return toast.error('Access denied');
    try {
      const res = await Axios.delete(`/api/review/delete/${reviewId}`, {
        data: { userId: user._id }, // <-- send userId in body
      });
      if (res.data.success) {
        toast.success('Review deleted successfully');
        fetchReviews();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const getInitials = (name) => {
    if (!name) return 'G';
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">
            Customer Reviews ({totalReviews})
          </h3>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i}>
                {i < Math.round(averageRating) ? (
                  <IoStar className="text-yellow-400" size={20} />
                ) : (
                  <IoStarOutline className="text-gray-300" size={20} />
                )}
              </span>
            ))}
            <span className="text-gray-600 text-sm ml-2">
              {typeof averageRating === 'number' ? averageRating.toFixed(1) : '0.0'}/5
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 text-sm font-semibold"
        >
          Write a Review
        </button>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex justify-between items-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(review.name)
                  )}
                </div>
                <div>
                  <span className="font-semibold text-gray-800">{review.name}</span>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < review.rating ? (
                          <IoStar className="text-yellow-400" size={16} />
                        ) : (
                          <IoStarOutline className="text-gray-300" size={16} />
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{review.comment || 'No comment provided.'}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => deleteReview(review._id)}
                  className="text-red-500 hover:text-red-700 transition ml-2"
                  title="Delete Review"
                >
                  <IoTrashBinOutline size={20} />
                </button>
              )}
            </motion.div>
          ))}
          {totalReviews > 3 && (
            <p className="text-gray-500 text-sm">+{totalReviews - 3} more reviews</p>
          )}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Write Your Review</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-gray-800 transition"
                  aria-label="Close review form"
                >
                  <IoClose size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setRating(i + 1)}
                        className="focus:outline-none"
                      >
                        {i < rating ? (
                          <IoStar className="text-yellow-400" size={24} />
                        ) : (
                          <IoStarOutline className="text-gray-300" size={24} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about the product..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none resize-none"
                    rows={4}
                  />
                </div>
                <button
                  onClick={addReview}
                  className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 font-semibold"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReviewSection;
