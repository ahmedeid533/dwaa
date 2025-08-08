'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// Define a type for the Order data
type Order = {
  order_id: number;
  request_id: number;
  order_date: string;
  total_amount: number;
  order_status: string;
};

// --- Helper Function for Status Colors (for consistency) ---
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

export default function MyOrdersPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true); // Ref to track the first load

  useEffect(() => {
    if (user && profile?.role === 'Pharmacy') {
      const fetchMyOrders = async () => {
        // Only show the main "Loading..." message on the first fetch
        if (isInitialLoad.current) {
          setIsLoading(true);
        }
        
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('order_id, request_id, order_date, total_amount, order_status')
          .eq('pharmacy_user_id', user.id)
          .order('order_date', { ascending: false });

        if (fetchError) {
          setError('Could not fetch your orders.');
          console.error(fetchError);
        } else {
          setOrders(data);
        }
        
        if (isInitialLoad.current) {
          setIsLoading(false);
          isInitialLoad.current = false;
        }
      };

      fetchMyOrders(); // Fetch immediately on load

      // Set up an interval to poll for new data every 5 seconds
      // const intervalId = setInterval(fetchMyOrders, 5000);

      // Cleanup the interval when the component unmounts
      // return () => clearInterval(intervalId);
    }
  }, [user, profile]);
  
  if (authLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
  if (!user || profile?.role !== 'Pharmacy') {
    return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                My Orders
            </h1>
            {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading your orders...</p>
            ) : error ? (
                <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>
            ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">No Orders Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">You haven&apos;t placed any orders yet.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/30">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Order ID</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Date</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Total</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.order_id} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">#{order.order_id}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(order.order_date).toLocaleDateString()}</td>
                                    <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">${order.total_amount.toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                                            {order.order_status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => router.push(`/dashboard/orders/${order.order_id}`)}
                                            className="font-medium text-[#08d9b3] hover:text-[#07c0a0] hover:underline">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
}
