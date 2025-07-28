'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions ---
interface UserProfile {
    id: string;
    role: 'Pharmacy' | 'Provider' | 'Admin';
    contact_phone: string;
    city: string;
    pharmacy_name: string | null;
    provider_name: string | null;
    average_rating: number | null;
}

// Star Icon for displaying ratings
const StarIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"></path>
    </svg>
);


// --- Main User Management Component ---
export default function UserManagementPage() {
    const { profile: adminProfile, loading: authLoading } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (adminProfile?.role === 'Admin') {
            const fetchUsers = async () => {
                setIsLoading(true);
                
                let query = supabase.from('profiles').select('*');

                if (searchTerm) {
                    // Search across multiple fields. Adjust as needed.
                    query = query.or(`pharmacy_name.ilike.%${searchTerm}%,provider_name.ilike.%${searchTerm}%,contact_phone.ilike.%${searchTerm}%`);
                }
                
                const { data, error: fetchError } = await query.order('created_at', { ascending: false });

                if (fetchError) {
                    console.error("Error fetching users:", fetchError);
                    setError("Could not fetch user data.");
                } else {
                    setUsers(data as UserProfile[]);
                }
                setIsLoading(false);
            };

            // Debounce search to avoid excessive queries
            const debounceTimeout = setTimeout(() => {
                fetchUsers();
            }, 300);

            return () => clearTimeout(debounceTimeout);
        }
    }, [adminProfile, searchTerm]);

    // --- Route Protection ---
    if (authLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }
    if (adminProfile?.role !== 'Admin') {
        return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Pharmacy': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Provider': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Admin': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">
                User Management
            </h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                />
            </div>

            {isLoading ? (
                <p className="text-center text-gray-500">Loading users...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Name</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Role</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Contact</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">City</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b dark:border-gray-700 last:border-b-0">
                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{user.pharmacy_name || user.provider_name || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{user.contact_phone}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{user.city}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <StarIcon className="w-4 h-4 text-yellow-400" />
                                            <span className="font-bold text-gray-700 dark:text-gray-200">
                                                {user.average_rating?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
