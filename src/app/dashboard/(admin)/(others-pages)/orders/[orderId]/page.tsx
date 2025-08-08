'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';

// Define a type for the review data
type Review = {
    rating: number;
    comment: string | null;
};

// Define a type for the detailed Order data.
// The `reviews` property is correctly typed as an array.
type OrderDetails = {
  order_id: number;
  order_date: string;
  order_status: string;
  total_amount: number;
  pharmacy_user_id: string;
  provider_user_id: string;
  medicine_requests: {
    medicine_name: string;
  } | null;
  provider: {
    provider_name: string;
  } | null;
  order_items: {
    quantity_fulfilled: number;
    deals: {
      price_per_unit: number;
    } | null;
  }[];
  reviews: Review[];
};


// Star rating component (unchanged)
const StarRating = ({ rating, setRating, disabled = false }: { rating: number, setRating: (r: number) => void, disabled?: boolean }) => {
    return (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => !disabled && setRating(star)}
                    className={`w-8 h-8 ${!disabled && 'cursor-pointer'} ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
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

  // Encapsulate fetch logic to be reusable.
  const fetchOrderDetails = useCallback(async () => {
    if (!user || !orderId) return;

    // The raw data from Supabase might have `reviews` as an object or null
    const { data: rawData, error: fetchError } = await supabase
      .from('orders')
      .select(`
        order_id,
        order_date,
        order_status,
        total_amount,
        pharmacy_user_id,
        provider_user_id,
        medicine_requests ( medicine_name ),
        provider:profiles!orders_provider_user_id_fkey ( provider_name ),
        order_items (
          quantity_fulfilled,
          deals ( price_per_unit )
        ),
        reviews ( * )
      `)
      .eq('order_id', orderId)
      .single();

    if (fetchError || !rawData || rawData.pharmacy_user_id !== user.id) {
      setError('Could not find this order or you do not have permission to view it.');
      console.error('Fetch Error:', fetchError?.message);
    } else {
      // [FIXED] This block normalizes the data structure.
      // Because 'reviews' is a one-to-one relationship, Supabase returns it as a single object.
      // We check if `rawData.reviews` exists and is not an array, and if so, wrap it in an array
      // to match the `OrderDetails` type. This ensures the rest of the component logic works correctly.
      const normalizedData = {
        ...rawData,
        reviews: rawData.reviews && !Array.isArray(rawData.reviews) ? [rawData.reviews] : (rawData.reviews || []),
      };
      
      setOrder(normalizedData as OrderDetails);
      setError(null);
    }
  }, [user, orderId]);

  useEffect(() => {
    if (profile?.role === 'Pharmacy') {
      setIsLoading(true);
      fetchOrderDetails().finally(() => {
        setIsLoading(false);
      });
    }
  }, [profile, fetchOrderDetails]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    const { error: updateError } = await supabase
      .from('orders').update({ order_status: newStatus }).eq('order_id', order.order_id);
    if (updateError) {
        setError(`Error updating status: ${updateError.message}`);
    } else {
        // Optimistically update the status in the UI
        setOrder({ ...order, order_status: newStatus });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
        setError("Please select a rating.");
        return;
    }
    if (!order || !user) {
        setError("Order data is missing.");
        return;
    }
    
    const providerId = order.provider_user_id;
    if (!providerId) {
        setError("Could not find provider for this order.");
        return;
    }

    setIsSubmittingReview(true);
    const { error: reviewError } = await supabase
      .from('reviews')
      .insert([{
          order_id: order.order_id,
          reviewer_user_id: user.id,
          reviewed_user_id: providerId,
          rating: rating,
          comment: comment
      }]);
    
    // On success or if a duplicate error occurs (e.g., from a double-click),
    // re-fetch the order details to ensure the UI shows the latest state.
    if (reviewError) {
      if (reviewError.message.includes('duplicate key value')) {
        await fetchOrderDetails();
      } else {
        setError(`Error submitting review: ${reviewError.message}`);
      }
    } else {
      await fetchOrderDetails();
    }
    setIsSubmittingReview(false);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading order details...</div>;
  if (error) return <div className="p-8 text-center text-red-500"><h1>Error</h1><p>{error}</p></div>;
  if (!order) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Order not found.</div>

  // This logic now works correctly because `order.reviews` is guaranteed to be an array.
  const orderItem = order.order_items?.[0];
  const deal = orderItem?.deals;
  const providerName = order.provider?.provider_name;
  const existingReview = order.reviews?.[0];

  const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
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

            <div className="space-y-6">
                {/* Order Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Order Summary</h2>
                    <div className="border-t dark:border-gray-700 pt-4">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-lg text-gray-900 dark:text-white">{order.medicine_requests?.medicine_name}</p>
                            <p className="font-bold text-lg text-gray-900 dark:text-white">${order.total_amount.toFixed(2)}</p>
                        </div>
                        {orderItem && deal && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantity: {orderItem.quantity_fulfilled} x ${deal.price_per_unit.toFixed(2)}
                            </p>
                        )}
                    </div>
                    <div className="border-t dark:border-gray-700 mt-4 pt-4">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Provider Information</h3>
                        <p className="font-medium text-gray-600 dark:text-gray-300 mt-1">{providerName || 'N/A'}</p>
                    </div>
                </div>
                
                {/* Actions & Review Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Actions & Review</h2>
                    <div className="border-t dark:border-gray-700 pt-4 space-y-4">
                        {order.order_status === 'Shipped' && (
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">If you have received this order, please mark it as delivered.</p>
                                <button onClick={() => handleUpdateStatus('Delivered')} className="bg-[#08d9b3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#07c0a0] transition-colors">
                                    Mark as Delivered
                                </button>
                            </div>
                        )}

                        {/* This conditional rendering now works correctly */}
                        {order.order_status === 'Delivered' && !existingReview && (
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
                                    className="w-full p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                                />
                                <button type="submit" disabled={isSubmittingReview} className="mt-2 bg-[#08d9b3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#07c0a0] disabled:bg-gray-400 transition-colors">
                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        )}

                        {/* This block will now display correctly when a review exists */}
                        {existingReview && (
                            <div>
                                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">Your Review</h3>
                                <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                                    <StarRating rating={existingReview.rating} setRating={() => {}} disabled={true} />
                                    {existingReview.comment ? (
                                        <p className="mt-2 text-gray-600 dark:text-gray-300 italic">“{existingReview.comment}”</p>
                                    ) : (
                                        <p className="mt-2 text-gray-500 dark:text-gray-400 italic">No comment provided.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
