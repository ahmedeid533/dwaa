'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';

// Define a type for the review data
type Review = {
    rating: number;
    comment: string | null;
};

// [FIXED] Define a type for the detailed Order data, ensuring nested relations are arrays.
type OrderDetails = {
  order_id: number;
  order_date: string;
  order_status: string;
  total_amount: number;
  pharmacy_user_id: string;
  medicine_requests: {
    medicine_name: string;
  }[] | null; // Supabase returns this as an array
  order_items: {
    quantity_fulfilled: number;
    deals: {
      price_per_unit: number;
      provider_user_id: string;
      profiles: {
        provider_name: string;
      }[] | null; // Profiles is also a nested array
    }[] | null; // Deals is also a nested array
  }[];
  reviews: Review[] // Check for existing reviews
};


// Star rating component
const StarRating = ({ rating, setRating }: { rating: number, setRating: (r: number) => void }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => setRating(star)}
                    className={`w-8 h-8 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                </svg>
            ))}
        </div>
    );
};


export default function OrderDetailsPage() {
  const { user, profile } = useAuth();
  const params = useParams();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for the review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (user && profile?.role === 'Pharmacy' && orderId) {
      const fetchOrderDetails = async () => {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            order_id, order_date, order_status, total_amount, pharmacy_user_id,
            medicine_requests (medicine_name),
            order_items (
              quantity_fulfilled,
              deals (
                price_per_unit, provider_user_id,
                profiles (provider_name)
              )
            ),
            reviews (*)
          `)
          .eq('order_id', orderId)
          .single();

        if (fetchError || !data || data.pharmacy_user_id !== user.id) {
          setError('Could not find this order or you do not have permission to view it.');
        } else {
          // The fetched data structure now matches the updated `OrderDetails` type.
          setOrder(data as OrderDetails);
        }
        setIsLoading(false);
      };
      fetchOrderDetails();
    }
  }, [user, profile, orderId]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    // NOTE: Using a modal for errors is better than `alert()` in a real app.
    const { error: updateError } = await supabase
      .from('orders').update({ order_status: newStatus }).eq('order_id', order.order_id);
    if (updateError) {
        setError(`Error updating status: ${updateError.message}`);
    } else {
        setOrder({ ...order, order_status: newStatus });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !order || !user) {
        setError("Please select a rating.");
        return;
    }
    
    // [FIXED] Access the nested providerId correctly from the arrays.
    const providerId = order.order_items[0]?.deals?.[0]?.provider_user_id;
    if (!providerId) {
        setError("Could not find provider for this order.");
        return;
    }

    setIsSubmittingReview(true);
    const { data, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
          order_id: order.order_id,
          reviewer_user_id: user.id,
          reviewed_user_id: providerId,
          rating: rating,
          comment: comment
      }])
      .select()
      .single();
    
    if (reviewError) {
        setError(`Error submitting review: ${reviewError.message}`);
    } else if (data) {
        // Update local state to show the new review instantly
        setOrder({ ...order, reviews: [...order.reviews, data as Review] });
    }
    setIsSubmittingReview(false);
  };

  if (isLoading) return <div className="p-8 text-center">Loading order details...</div>;
  if (error) return <div className="p-8 text-center text-red-500"><h1>Error</h1><p>{error}</p></div>;
  if (!order) return <div className="p-8 text-center">Order not found.</div>

  // [FIXED] Safely access nested data from arrays.
  const orderItem = order.order_items?.[0];
  const deal = orderItem?.deals?.[0];
  const provider = deal?.profiles?.[0];
  const existingReview = order.reviews?.[0];

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                Order #{order.order_id}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Placed on: {new Date(order.order_date).toLocaleDateString()}
            </p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.order_status)}`}>
            {order.order_status}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Order Summary and Provider Info */}
        <div>
            <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
            <div className="border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                    {/* [FIXED] Access medicine_name from the first item in the array */}
                    <p className="font-bold text-lg">{order.medicine_requests?.[0]?.medicine_name}</p>
                    <p className="font-bold text-lg">${order.total_amount.toFixed(2)}</p>
                </div>
                {orderItem && deal && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quantity: {orderItem.quantity_fulfilled} x ${deal.price_per_unit.toFixed(2)}
                    </p>
                )}
            </div>
        </div>
        <div>
            <h2 className="text-lg font-semibold mb-2">Provider Information</h2>
            <div className="border-t dark:border-gray-700 pt-4">
                {/* [FIXED] Access provider_name from the nested array structure */}
                <p className="font-medium">{provider?.provider_name || 'N/A'}</p>
            </div>
        </div>

        {/* Actions Section */}
        <div className="border-t dark:border-gray-700 pt-4">
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            {order.order_status === 'Delivered' && (
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If you have received this order, please mark it as complete.</p>
                    <button onClick={() => handleUpdateStatus('Completed')} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700">
                        Mark as Completed
                    </button>
                </div>
            )}

            {order.order_status === 'Completed' && !existingReview && (
                <form onSubmit={handleReviewSubmit}>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Thank you for your order! Please rate your experience with the provider.</p>
                    <div className="mb-4">
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment (optional)..."
                        rows={3}
                        className="w-full p-2 bg-gray-100 dark:bg-gray-700 border rounded-md"
                    />
                    <button type="submit" disabled={isSubmittingReview} className="mt-2 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-400">
                        {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                </form>
            )}

            {existingReview && (
                <div>
                    <h3 className="font-semibold">Your Review</h3>
                    <div className="flex items-center mt-1">
                        <StarRating rating={existingReview.rating} setRating={() => {}} />
                    </div>
                    {existingReview.comment && <p className="mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md text-sm">{existingReview.comment}</p>}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
