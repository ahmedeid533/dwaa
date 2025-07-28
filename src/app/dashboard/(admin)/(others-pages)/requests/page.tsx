'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

// Star Icon for displaying ratings
const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path>
    </svg>
);

// [FIXED] Define a type for the medicine request data, ensuring `profiles` is an array.
type MedicineRequest = {
  request_id: number;
  pharmacy_user_id: string; // This was missing from the query
  status: string;
  request_date: string;
  notes: string | null;
  quantity: number;
  quantity_fulfilled: number;
  medicine_name: string;
  profiles: {
    pharmacy_name: string;
    average_rating: number | null;
  }[] | null; // Supabase returns relations as an array
};

export default function ViewRequestsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<MedicineRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'Provider') {
      const fetchOpenRequests = async () => {
        setIsLoading(true);
        setError(null);

        // [FIXED] Update the select query to fetch `pharmacy_user_id`
        const { data, error: fetchError } = await supabase
          .from('medicine_requests')
          .select(`
            request_id,
            pharmacy_user_id, 
            status,
            request_date,
            notes,
            quantity,
            quantity_fulfilled,
            medicine_name,
            profiles (
              pharmacy_name,
              average_rating
            )
          `)
          .eq('status', 'Open')
          .order('request_date', { ascending: false });

        if (fetchError) {
          console.error('Error fetching requests:', fetchError);
          setError('Could not fetch medicine requests.');
        } else {
          // The fetched data now matches the `MedicineRequest[]` type.
          setRequests(data as MedicineRequest[]);
        }
        setIsLoading(false);
      };
      fetchOpenRequests();
    }
  }, [user, profile]);

  if (authLoading) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }
  if (!user || profile?.role !== 'Provider') {
    return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Open Medicine Requests
      </h1>
      
      {isLoading ? (
        <p className="text-center text-gray-500">Loading requests...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">No Open Requests</h2>
          <p className="text-gray-500 mt-2">Check back later to see new requests from pharmacies.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => {
            const remainingQuantity = req.quantity - req.quantity_fulfilled;
            if (remainingQuantity <= 0) return null;

            return (
              <div key={req.request_id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">{req.medicine_name}</h2>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      Need: {remainingQuantity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {/* [FIXED] Access the first element of the profiles array */}
                      By: <span className="font-semibold">{req.profiles?.[0]?.pharmacy_name || 'A Pharmacy'}</span>
                    </p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <span className="font-bold text-gray-700 dark:text-gray-200">
                        {/* [FIXED] Access the first element of the profiles array */}
                        {req.profiles?.[0]?.average_rating?.toFixed(1) || 'New'}
                      </span>
                    </div>
                  </div>
                  {req.notes && (
                    <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                      {req.notes}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  <button 
                    onClick={() => router.push(`/dashboard/requests/${req.request_id}`)}
                    className="w-full p-2 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors duration-300"
                  >
                    Make a Deal
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

