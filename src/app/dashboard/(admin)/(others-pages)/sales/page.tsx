'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';

// Define the new type for a Sale, based on the `orders` table
type Sale = {
  order_id: number;
  order_date: string;
  order_status: string;
  total_amount: number;
  medicine_requests: {
    medicine_name: string;
    profiles: {
      pharmacy_name: string;
      address: string;
    } | null;
  } | null;
};


export default function MySalesPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'Provider') {
      const fetchMySales = async () => {
        setIsLoading(true);
        // The query now starts from 'orders' and filters by the provider's user ID.
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(`
            order_id,
            order_date,
            order_status,
            total_amount,
            medicine_requests (
              medicine_name,
              profiles (
                pharmacy_name,
                address
              )
            )
          `)
          .eq('provider_user_id', user.id)
          .order('order_date', { ascending: false });

        if (fetchError) {
          setError('Could not fetch your sales.');
          console.error(fetchError);
        } else {
          // The fetched data now directly matches the `Sale[]` type.
          setSales(data as Sale[]);
        }
        setIsLoading(false);
      };
      fetchMySales();
    }
  }, [user, profile]);
  
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ order_status: newStatus })
      .eq('order_id', orderId);

    if (updateError) {
      setError(`Error updating status: ${updateError.message}`);
    } else {
      // Update the local state to reflect the change immediately.
      setSales(currentSales =>
        currentSales.map(sale =>
          sale.order_id === orderId ? { ...sale, order_status: newStatus } : sale
        )
      );
    }
  };

  if (authLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
  if (!user || profile?.role !== 'Provider') {
    return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                My Sales
            </h1>
            {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading your sales...</p>
            ) : error ? (
                <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>
            ) : sales.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">No Sales Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">You haven&apos;t had any deals accepted yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {sales.map(sale => {
                        const pharmacyProfile = sale.medicine_requests?.profiles;
                        return (
                            <div key={sale.order_id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                    {/* Left side: Order Info */}
                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Order #{sale.order_id}</p>
                                        <p className="font-bold text-xl text-gray-800 dark:text-white">{sale.medicine_requests?.medicine_name}</p>
                                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                            <p>
                                                To: <span className="font-semibold">{pharmacyProfile?.pharmacy_name || 'A Pharmacy'}</span>
                                            </p>
                                            <p>
                                                Address: {pharmacyProfile?.address || 'Not provided'}
                                            </p>
                                        </div>
                                        <p className="mt-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                            Total Sale: ${sale.total_amount.toFixed(2)}
                                        </p>
                                    </div>
                                    {/* Right side: Status Management */}
                                    <div className="flex items-center gap-4 w-full md:w-auto flex-shrink-0">
                                        <label htmlFor={`status-${sale.order_id}`} className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                                        <select 
                                            id={`status-${sale.order_id}`}
                                            value={sale.order_status}
                                            onChange={(e) => handleStatusUpdate(sale.order_id, e.target.value)}
                                            className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Shipped">Shipped</option>
                                            {/* <option value="Delivered">Delivered</option> */}
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
  );
}
