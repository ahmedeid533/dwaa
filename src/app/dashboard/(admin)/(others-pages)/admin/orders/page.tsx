'use client';

import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions ---
interface Order {
    order_id: number;
    order_date: string;
    total_amount: number;
    order_status: string;
    // Joined data for pharmacy
    pharmacy_profile: {
        pharmacy_name: string;
    } | null;
    // Joined data for provider
    order_items: {
        deals: {
            profiles: {
                provider_name: string;
            } | null;
        } | null;
    }[];
}

// --- Main Admin Orders Component ---
export default function AdminAllOrdersPage() {
    const { profile: adminProfile, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'ascending' | 'descending' } | null>({ key: 'order_date', direction: 'descending' });

    useEffect(() => {
        if (adminProfile?.role === 'Admin') {
            const fetchAllOrders = async () => {
                setIsLoading(true);

                const { data, error: fetchError } = await supabase
                    .from('orders')
                    .select(`
                        order_id,
                        order_date,
                        total_amount,
                        order_status,
                        pharmacy_profile:profiles!orders_pharmacy_user_id_fkey(pharmacy_name),
                        order_items(
                            deals(
                                profiles(provider_name)
                            )
                        )
                    `);

                if (fetchError) {
                    console.error("Error fetching all orders:", fetchError);
                    setError("Could not fetch order data.");
                } else {
									// Transform Supabase response to match Order type
									// eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const transformedOrders: Order[] = (data as any[]).map((order) => ({
                        ...order,
                        pharmacy_profile: Array.isArray(order.pharmacy_profile) ? order.pharmacy_profile[0] ?? null : order.pharmacy_profile ?? null,
											order_items: Array.isArray(order.order_items)
													// eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? order.order_items.map((item: any) => ({
                                ...item,
                                deals: Array.isArray(item.deals) ? (item.deals[0] ?? null) : item.deals ?? null,
                            }))
                            : [],
                    }));
                    setOrders(transformedOrders);
                }
                setIsLoading(false);
            };
            fetchAllOrders();
        }
    }, [adminProfile]);
    
    // Memoized filtered and sorted orders
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;
        if (searchTerm.trim() !== '') {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.order_id.toString().includes(lower) ||
                (order.pharmacy_profile?.pharmacy_name?.toLowerCase().includes(lower)) ||
                (order.order_items[0]?.deals?.profiles?.provider_name?.toLowerCase().includes(lower))
            );
        }
        if (sortConfig !== null) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // Handle null/undefined values
                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1;
                if (bValue == null) return -1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [orders, searchTerm, sortConfig]);

    const requestSort = (key: keyof Order) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    // --- Route Protection ---
    if (authLoading) return <div className="p-8 text-center">Loading...</div>;
    if (adminProfile?.role !== 'Admin') return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1></div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">Transaction Log</h1>
            <div className="mb-6">
                <input type="text" placeholder="Search by Order ID, Pharmacy, or Provider..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"/>
            </div>

            {isLoading ? <p className="text-center text-gray-500">Loading all orders...</p> : error ? <p className="text-center text-red-500">{error}</p> : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4"><button onClick={() => requestSort('order_id')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Order ID</button></th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Pharmacy</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Provider</th>
                                <th className="p-4"><button onClick={() => requestSort('total_amount')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Total</button></th>
                                <th className="p-4"><button onClick={() => requestSort('order_status')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Status</button></th>
                                <th className="p-4"><button onClick={() => requestSort('order_date')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Date</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedOrders.map(order => (
                                <tr key={order.order_id} className="border-b dark:border-gray-700 last:border-b-0">
                                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">#{order.order_id}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{order.pharmacy_profile?.pharmacy_name || 'N/A'}</td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{order.order_items[0]?.deals?.profiles?.provider_name || 'N/A'}</td>
                                    <td className="p-4 text-gray-800 dark:text-gray-200">${order.total_amount.toFixed(2)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>{order.order_status}</span></td>
                                    <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(order.order_date).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
