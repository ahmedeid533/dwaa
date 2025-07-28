'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';

// Star Icon for displaying ratings
const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path>
    </svg>
);

// [FIXED] Define a type for the Deal data, where `profiles` is an array.
type Deal = {
  deal_id: number;
  price_per_unit: number;
  quantity_offered: number;
  status: string;
  profiles: {
    provider_name: string;
    average_rating: number | null;
  }[] | null; // Supabase returns related tables as an array
};

type RequestDetails = {
    medicine_name: string;
    quantity: number;
    quantity_fulfilled: number;
};

export default function ViewDealsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const requestId = params.requestId as string;

  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAccepting, setIsAccepting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'Pharmacy' && requestId) {
      const fetchDeals = async () => {
        setIsLoading(true);
        setError(null);

        const { data: requestData, error: requestError } = await supabase
          .from('medicine_requests')
          .select('medicine_name, quantity, quantity_fulfilled, pharmacy_user_id')
          .eq('request_id', requestId)
          .single();

        if (requestError || !requestData || requestData.pharmacy_user_id !== user.id) {
          setError("Could not find this request or you don't have permission to view it.");
          setIsLoading(false);
          return;
        }
        setRequestDetails(requestData);

        // This query correctly fetches the related profile data.
        const { data: dealsData, error: dealsError } = await supabase
          .from('deals')
          .select(`
            deal_id,
            price_per_unit,
            quantity_offered,
            status,
            profiles (
              provider_name,
              average_rating
            )
          `)
          .eq('request_id', requestId)
          .order('price_per_unit', { ascending: true });

        if (dealsError) {
          setError('Could not fetch deals for this request.');
        } else {
          // The fetched data structure now matches the updated `Deal[]` type.
          setDeals(dealsData as Deal[]);
        }
        setIsLoading(false);
      };
      fetchDeals();
    }
  }, [user, profile, requestId]);

  const handleAcceptDeal = async (dealId: number) => {
    if (!user) {
        setError("You must be logged in to accept a deal.");
        return;
    }
    setIsAccepting(dealId);
    setError(null);
    setMessage(null);

    try {
        const { data, error: rpcError } = await supabase.rpc('accept_deal_and_create_order', {
            p_deal_id: dealId,
            p_pharmacy_user_id: user.id
        });

        if (rpcError) throw rpcError;

        setMessage(`Successfully created Order #${data[0].order_id}! Redirecting...`);
        setTimeout(() => router.push('/dashboard/orders'), 3000);
    } catch (err) {
        console.error("Error accepting deal:", err);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(`Failed to accept deal: ${errorMessage}`);
    } finally {
        setIsAccepting(null);
    }
  };

  if (authLoading || isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (error && !deals.length) return <div className="p-8 text-center text-red-500"><h1>Error</h1><p>{error}</p></div>;
  if (!user || profile?.role !== 'Pharmacy') return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;

  const remainingQuantity = requestDetails ? requestDetails.quantity - requestDetails.quantity_fulfilled : 0;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
        Deals for: {requestDetails?.medicine_name}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">You need <span className="font-bold">{remainingQuantity}</span> more units.</p>
      
      {message && <div className="mb-4 p-4 text-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">{message}</div>}
      {error && !message && <div className="mb-4 p-4 text-center bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">{error}</div>}

      {deals.length === 0 && !isLoading ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">No Deals Yet</h2>
        </div>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => (
            <div key={deal.deal_id} className={`p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-opacity ${deal.status !== 'Pending' ? 'opacity-50 bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}`}>
              <div>
                <div className="flex items-center gap-4 mb-1">
                    <p className="font-semibold text-lg text-gray-800 dark:text-white">
                        {/* [FIXED] Access the first element of the profiles array */}
                        From: {deal.profiles?.[0]?.provider_name || 'A Provider'}
                    </p>
                    <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="font-bold text-gray-700 dark:text-gray-200">
                             {/* [FIXED] Access the first element of the profiles array */}
                            {deal.profiles?.[0]?.average_rating?.toFixed(1) || 'New'}
                        </span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Offering <span className="font-bold">{deal.quantity_offered}</span> units at 
                    <span className="font-bold text-green-600 dark:text-green-400"> ${deal.price_per_unit.toFixed(2)}</span> each.
                </p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total: <span className="font-semibold">${(deal.quantity_offered * deal.price_per_unit).toFixed(2)}</span>
                </p>
              </div>
              <div className="w-full sm:w-auto">
                {deal.status === 'Pending' ? (
                    <button 
                      onClick={() => handleAcceptDeal(deal.deal_id)}
                      disabled={isAccepting !== null}
                      className="w-full bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                      {isAccepting === deal.deal_id ? 'Accepting...' : 'Accept Deal'}
                    </button>
                ) : (
                    <span className={`font-bold py-2 px-6 rounded-lg ${deal.status === 'Accepted' ? 'text-green-500 bg-green-100 dark:bg-green-900' : 'text-red-500 bg-red-100 dark:bg-red-900'}`}>
                        {deal.status}
                    </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
