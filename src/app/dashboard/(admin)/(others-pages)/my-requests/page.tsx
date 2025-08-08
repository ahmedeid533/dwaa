'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type MyRequest = {
  request_id: number;
  status: 'Open' | 'Processing' | 'Closed'; // More specific status types
  request_date: string;
  medicine_name: string;
  quantity: number;
};

// --- Helper Function for Status Colors (for consistency) ---
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Closed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
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
          .in('status', ['Open', 'Processing']) // Fetch open and processing requests
          .order('request_date', { ascending: false });

        if (fetchError) {
          setError('Could not fetch your requests.');
          console.error(fetchError);
        } else {
          setRequests(data as MyRequest[]);
        }
        setIsLoading(false);
      };
      fetchMyRequests();
    }
  }, [user, profile]);
  
  if (authLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading...</div>;
  if (!user || profile?.role !== 'Pharmacy') {
    return (
        <div className="p-8 text-center text-red-500">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                My Medicine Requests
            </h1>
            {isLoading ? (
                <p className="text-center text-gray-500 dark:text-gray-400">Loading your requests...</p>
            ) : error ? (
                <p className="text-center text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</p>
            ) : requests.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">No Open Requests Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">You don't have any open or processing medicine requests.</p>
                    <button onClick={() => router.push('/dashboard/request-medicine')} className="mt-6 bg-[#08d9b3] text-white font-semibold py-2 px-5 rounded-lg hover:bg-[#07c0a0] transition-colors duration-300 shadow-sm">
                        Make a New Request
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req.request_id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-lg transition-shadow duration-300">
                            <div className="flex-grow">
                                <p className="font-bold text-lg text-gray-900 dark:text-white">{req.medicine_name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Requested on: {new Date(req.request_date).toLocaleDateString()} | Quantity: {req.quantity}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(req.status)}`}>
                                    {req.status}
                                </span>
                                <button 
                                    onClick={() => router.push(`/dashboard/my-requests/${req.request_id}`)}
                                    className="w-full sm:w-auto text-center font-semibold py-2 px-4 rounded-lg transition-colors duration-300 text-[#08d9b3] bg-[#08d9b3]/10 hover:bg-[#08d9b3]/20">
                                    View Deals
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
