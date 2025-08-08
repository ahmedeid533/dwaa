'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions (Updated) ---
// The 'status' field is now included and is essential.
type ProfileStatus = 'under_review' | 'active' | 'inactive' | 'banned';

interface UserProfile {
    id: string;
    role: 'Pharmacy' | 'Provider' | 'Admin';
    status: ProfileStatus;
    contact_phone: string;
    city: string;
    pharmacy_name: string | null;
    provider_name: string | null;
    average_rating: number | null;
    created_at: string;
}

// --- Icons ---
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
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

    useEffect(() => {
        if (adminProfile?.role === 'Admin') {
            const fetchUsers = async () => {
                setIsLoading(true);
                const { data, error: fetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (fetchError) {
                    console.error("Error fetching users:", fetchError);
                    setError("Could not fetch user data.");
                } else {
                    // Filter users based on search term client-side for simplicity
                    const filteredData = data.filter(user => {
                        const name = user.pharmacy_name || user.provider_name || '';
                        const phone = user.contact_phone || '';
                        return name.toLowerCase().includes(searchTerm.toLowerCase()) || phone.includes(searchTerm);
                    });
                    setUsers(filteredData as UserProfile[]);
                }
                setIsLoading(false);
            };
            fetchUsers();
        }
    }, [adminProfile, searchTerm]);

    // --- Status Update Logic ---
    const handleStatusChange = async (userId: string, newStatus: ProfileStatus) => {
        setUpdatingUserId(userId);
        setError(null);

        const { data, error: updateError } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', userId)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating status:", updateError);
            setError("Failed to update user status. Please try again.");
        } else if (data) {
            // Update the user in the local state to reflect the change immediately
            setUsers(currentUsers =>
                currentUsers.map(user =>
                    user.id === userId ? { ...user, status: data.status } : user
                )
            );
        }
        setUpdatingUserId(null);
    };

    // --- Helper Functions for UI ---
    const getStatusColor = (status: ProfileStatus) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'under_review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    // Determines which status options are available based on the current status
    const getNextStatuses = (currentStatus: ProfileStatus): ProfileStatus[] => {
        switch (currentStatus) {
            case 'under_review': return ['active', 'inactive'];
            case 'active': return ['inactive', 'banned'];
            case 'inactive': return ['active'];
            case 'banned': return []; // Banned is a final state
            default: return [];
        }
    };

    // --- Route Protection ---
    if (authLoading) return <div className="p-8 text-center">Loading...</div>;
    if (adminProfile?.role !== 'Admin') return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">User Management</h1>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"
                />
            </div>
             {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            {isLoading ? <p className="text-center text-gray-500">Loading users...</p> : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Name</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Role</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Contact</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Rating</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => {
                                const nextStatuses = getNextStatuses(user.status);
                                const isSelf = user.id === adminProfile?.id;
                                return (
                                    <tr key={user.id} className="border-b dark:border-gray-700 last:border-b-0">
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{user.pharmacy_name || user.provider_name || 'N/A'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{user.role}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(user.status)}`}>
                                                {user.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{user.contact_phone}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1">
                                                <StarIcon className="w-4 h-4 text-yellow-400" />
                                                <span className="font-bold text-gray-700 dark:text-gray-200">{user.average_rating?.toFixed(1) || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {updatingUserId === user.id ? (
                                                <span className="text-sm text-gray-500">Updating...</span>
                                            ) : (
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleStatusChange(user.id, e.target.value as ProfileStatus)}
                                                    disabled={isSelf || nextStatuses.length === 0}
                                                    className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <option value={user.status} disabled>{user.status.replace('_', ' ')}</option>
                                                    {nextStatuses.map(status => (
                                                        <option key={status} value={status} className="capitalize">{status.replace('_', ' ')}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
