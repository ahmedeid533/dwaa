'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';

// Define a type for the medicine request data
type MedicineRequest = {
  request_id: number;
  status: string;
  request_date: string;
  notes: string | null;
  quantity: number; // Original total quantity
  quantity_fulfilled: number; // New field for fulfilled amount
  medicine_name: string;
  profiles: {
    pharmacy_name: string;
  } | null;
};

export default function MakeDealPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const requestId = params.requestId as string;

  // State for the specific request and form inputs
  const [request, setRequest] = useState<MedicineRequest | null>(null);
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [quantityOffered, setQuantityOffered] = useState<string>('');

  // UI State
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && requestId) {
      const fetchRequestDetails = async () => {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
          .from('medicine_requests')
          .select('*, profiles(pharmacy_name)')
          .eq('request_id', requestId)
          .single(); // Fetch a single record

        if (fetchError) {
          setError('Could not find the requested item.');
          console.error(fetchError);
        } else {
          const reqData = data as MedicineRequest;
          setRequest(reqData);
          // Pre-fill the quantity offered with the REMAINING quantity
          const remaining = reqData.quantity - reqData.quantity_fulfilled;
          setQuantityOffered(remaining > 0 ? remaining.toString() : '0');
        }
        setIsLoading(false);
      };
      fetchRequestDetails();
    }
  }, [user, requestId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !request) {
      setError('Cannot submit deal. User or request data is missing.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

		try {
			const { error: insertError } = await supabase.from('deals').insert([{
			request_id: request.request_id,
			provider_user_id: user.id,
			price_per_unit: parseFloat(pricePerUnit),
			quantity_offered: parseInt(quantityOffered, 10),
			}]);

			if (insertError) {
			setError(`Failed to submit deal: ${insertError.message}`);
			} else {
			setMessage('Your deal has been submitted successfully!');
			setTimeout(() => router.push('/dashboard/requests'), 2000);
			}
		} finally {
			setIsSubmitting(false);
		}
  };

  if (authLoading || isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!user || profile?.role !== 'Provider') {
    return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
  }

  if (error && !request) {
      return <div className="p-8 text-center text-red-500"><h1>Error</h1><p>{error}</p></div>;
  }
  
  const remainingQuantity = request ? request.quantity - request.quantity_fulfilled : 0;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-white">
        Make a Deal
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Submit your offer for the request below.</p>
      
      {/* Request Details Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{request?.medicine_name}</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Remaining Qty: {remainingQuantity}
            </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          From: <span className="font-semibold">{request?.profiles?.pharmacy_name || 'A Pharmacy'}</span>
        </p>
        {request?.notes && <p className="mt-4 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md">{request.notes}</p>}
      </div>

      {/* Deal Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
            <label htmlFor="quantityOffered" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity You Can Provide
            </label>
            <input
              id="quantityOffered"
              type="number"
              value={quantityOffered}
              onChange={(e) => setQuantityOffered(e.target.value)}
              required
              min="1"
              max={remainingQuantity} // Can't offer more than what's remaining
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
        </div>
        <div>
            <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price Per Unit ($)
            </label>
            <input
              id="pricePerUnit"
              type="number"
              step="0.01"
              min="0.01"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              required
              placeholder="e.g., 12.50"
              className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
            />
        </div>
        <div>
            <button type="submit" disabled={isSubmitting} className="w-full p-3 font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:bg-gray-500">
              {isSubmitting ? 'Submitting Deal...' : 'Submit Deal'}
            </button>
        </div>
        {message && <p className="text-sm text-center text-green-500">{message}</p>}
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
      </form>
    </div>
  );
}
