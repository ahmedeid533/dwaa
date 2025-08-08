'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/utils/supabase/client';
import Image from 'next/image';

// Define a type for our medicine search results
type MedicineSearchResult = {
  medicine_id: number;
  commercial_name: string;
  medicine_image: string | null;
};

export default function RequestMedicinePage() {
  const { user, profile, loading: authLoading } = useAuth();

  // Form state
  const [medicineName, setMedicineName] = useState<string>('');
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineSearchResult | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Search state
  const [searchResults, setSearchResults] = useState<MedicineSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // UI feedback state
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Debounce function to delay search queries
  function debounce<T extends (arg: string) => unknown>(func: T, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (arg: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        Promise.resolve(func(arg));
      }, delay);
    };
  }

  // Memoized debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('medicine_id, commercial_name, medicine_image')
        .ilike('commercial_name', `%${searchTerm}%`) // Case-insensitive search
        .limit(5);

      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
      }
      setIsSearching(false);
    }, 300), // 300ms delay
    []
  );

  useEffect(() => {
    if (medicineName && !selectedMedicine) {
      debouncedSearch(medicineName);
    }
  }, [medicineName, selectedMedicine, debouncedSearch]);

  const handleSelectMedicine = (medicine: MedicineSearchResult) => {
    setSelectedMedicine(medicine);
    setMedicineName(medicine.commercial_name);
    setSearchResults([]); // Hide search results
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !selectedMedicine) {
      setError('You must select a valid medicine from the search results.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const { error: insertError } = await supabase
      .from('medicine_requests')
      .insert([{
        pharmacy_user_id: user.id,
        medicine_name: selectedMedicine.commercial_name,
        quantity: parseInt(quantity, 10),
        notes: notes,
        status: 'Open',
      }]);

      if (insertError) throw new Error(insertError.message);

      setMessage('Your medicine request has been submitted successfully!');
      setMedicineName('');
      setSelectedMedicine(null);
      setQuantity('');
      setNotes('');
    } catch (err) {
      if (err instanceof Error) {
      setError(`Failed to submit request: ${err.message}`);
      } else {
      setError('Failed to submit request: Unknown error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading user data...</div>;
  
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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                Request New Medicine
            </h1>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Medicine Search Input */}
                    <div className="relative">
                        <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Search for Medicine
                        </label>
                        <input
                            id="medicineName"
                            type="text"
                            value={medicineName}
                            onChange={(e) => {
                                setMedicineName(e.target.value);
                                setSelectedMedicine(null); // Reset selection on new input
                            }}
                            required
                            placeholder="Start typing a medicine name..."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                        />
                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((med) => (
                                    <li
                                        key={med.medicine_id}
                                        onClick={() => handleSelectMedicine(med)}
                                        className="flex items-center p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Image
                                            src={med.medicine_image || 'https://placehold.co/40x40/cccccc/000000?text=N/A'}
                                            alt={med.commercial_name}
                                            width={40}
                                            height={40}
                                            className="rounded-md mr-4 object-cover"
                                            onError={(e) => e.currentTarget.src = 'https://placehold.co/40x40/cccccc/000000?text=N/A'}
                                        />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">{med.commercial_name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {isSearching && <p className="text-sm text-gray-500 mt-2">Searching...</p>}
                    </div>

                    {/* Other Form Fields */}
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Quantity
                        </label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                            min="1"
                            placeholder="e.g., 5"
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                        />
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            placeholder="Any specific details or requirements..."
                            className="w-full p-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#08d9b3] focus:border-[#08d9b3] transition"
                        ></textarea>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={submitting || !selectedMedicine}
                            className="w-full p-3 font-semibold text-white bg-[#08d9b3] rounded-lg hover:bg-[#07c0a0] disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                            {submitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 p-3 text-sm text-center text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/50 rounded-lg">{message}</p>}
                {error && <p className="mt-4 p-3 text-sm text-center text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/50 rounded-lg">{error}</p>}
            </div>
        </div>
    </div>
  );
}
