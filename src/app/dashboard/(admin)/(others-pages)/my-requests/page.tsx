'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type MyRequest = {
  request_id: number;
  status: string;
  request_date: string;
  medicine_name: string;
  quantity: number;
};

export default function MyRequestsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [requests, setRequests] = useState<MyRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.role === 'Pharmacy') {
      const fetchMyRequests = async () => {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('medicine_requests')
          .select('request_id, status, request_date, medicine_name, quantity')
					.eq('pharmacy_user_id', user.id)
					.eq('status', "Open")
          .order('request_date', { ascending: false });

        if (fetchError) {
          setError('Could not fetch your requests.');
          console.error(fetchError);
        } else {
          setRequests(data);
        }
        setIsLoading(false);
      };
      fetchMyRequests();
    }
  }, [user, profile]);
  
  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!user || profile?.role !== 'Pharmacy') {
    return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        My Medicine Requests
      </h1>
      {isLoading ? (
        <p>Loading your requests...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">No Requests Found</h2>
          <p className="text-gray-500 mt-2">You haven&apos;t made any medicine requests yet.</p>
          <button onClick={() => router.push('/dashboard/request-medicine')} className="mt-4 bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700">
            Make a New Request
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req.request_id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="font-bold text-lg text-gray-800 dark:text-white">{req.medicine_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Requested on: {new Date(req.request_date).toLocaleDateString()} | Status: <span className="font-semibold">{req.status}</span>
                </p>
              </div>
              <button 
                onClick={() => router.push(`/dashboard/my-requests/${req.request_id}`)}
                className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                View Deals
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
