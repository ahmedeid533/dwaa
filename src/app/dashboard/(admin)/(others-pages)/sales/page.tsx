'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';

// [FIXED] Define a type for the Sales data, ensuring all nested relations are arrays to match the Supabase response.
type Sale = {
  deal_id: number;
  price_per_unit: number;
  quantity_offered: number;
  order_items: {
    orders: {
      order_id: number;
      order_date: string;
      order_status: string;
    }[] | null; // This is an array
  }[];
  medicine_requests: {
    medicine_name: string;
    profiles: {
      pharmacy_name: string;
      address: string;
    }[] | null; // This is an array
  }[] | null; // This is an array
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
        const { data, error: fetchError } = await supabase
          .from('deals')
          .select(`
            deal_id,
            price_per_unit,
            quantity_offered,
            order_items!inner(
              orders!inner(
                order_id,
                order_date,
                order_status
              )
            ),
            medicine_requests(
              medicine_name,
              profiles(
                pharmacy_name,
                address
              )
            )
          `)
          .eq('provider_user_id', user.id)
          .eq('status', 'Accepted')
          .order('created_at', { ascending: false });

        if (fetchError) {
          setError('Could not fetch your sales.');
          console.error(fetchError);
        } else {
          // The fetched data now matches the corrected `Sale[]` type.
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
      // [FIXED] Update the local state correctly and safely.
      setSales(currentSales => currentSales.map(sale => {
        const order = sale.order_items?.[0]?.orders?.[0];
        if (order?.order_id === orderId) {
          // Create a deep copy to avoid direct state mutation
          const newSale = JSON.parse(JSON.stringify(sale));
          newSale.order_items[0].orders[0].order_status = newStatus;
          return newSale;
        }
        return sale;
      }));
    }
  };

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || profile?.role !== 'Provider') {
    return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        My Sales
      </h1>
      {isLoading ? (
        <p>Loading your sales...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : sales.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">No Sales Found</h2>
          <p className="text-gray-500 mt-2">You haven&apos;t had any deals accepted yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sales.map(sale => {
            // [FIXED] Access nested data correctly from arrays.
            const order = sale.order_items?.[0]?.orders?.[0];
            if (!order) return null; // Safety check

            const request = sale.medicine_requests?.[0];
            const pharmacyProfile = request?.profiles?.[0];

            return (
              <div key={sale.deal_id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  {/* Left side: Order Info */}
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Order #{order.order_id}</p>
                    <p className="font-bold text-xl text-gray-800 dark:text-white">{request?.medicine_name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      To: <span className="font-semibold">{pharmacyProfile?.pharmacy_name || 'A Pharmacy'}</span>
                      <br />
                      Address: {pharmacyProfile?.address || 'Not provided'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Qty: <span className="font-semibold">{sale.quantity_offered}</span> | Total: <span className="font-semibold text-green-600 dark:text-green-400">${(sale.quantity_offered * sale.price_per_unit).toFixed(2)}</span>
                    </p>
                  </div>
                  {/* Right side: Status Management */}
                  <div className="flex items-center gap-4 w-full md:w-auto">
                     <label htmlFor={`status-${order.order_id}`} className="text-sm font-medium">Status:</label>
                     <select 
                        id={`status-${order.order_id}`}
                        value={order.order_status}
                        onChange={(e) => handleStatusUpdate(order.order_id, e.target.value)}
                        className="p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                     >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
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
  );
}
