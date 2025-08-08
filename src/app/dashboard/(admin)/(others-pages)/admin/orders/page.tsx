'use client';

import React, { useEffect, useState, useMemo } from "react";
// Make sure the path to your AuthContext and Supabase client is correct
import { useAuth } from "@/context/AuthContext"; 
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions (Updated) ---
type OrderStatus = 'Pending' | 'Shipped' | 'Delivered' | 'Completed' | 'Cancelled';

const ALL_ORDER_STATUSES: OrderStatus[] = ['Pending', 'Shipped', 'Delivered', 'Completed', 'Cancelled'];

interface Order {
    order_id: number;
    order_date: string;
    total_amount: number;
    order_status: OrderStatus;
    pharmacy_profile: {
        pharmacy_name: string;
    } | null;
    provider_profile: {
        provider_name: string;
    } | null;
}

// --- Main Admin Orders Component ---
export default function AdminAllOrdersPage() {
    const { profile: adminProfile, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'ascending' | 'descending' } | null>({ key: 'order_date', direction: 'descending' });
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

    useEffect(() => {
        if (adminProfile?.role === 'Admin') {
            const fetchAllOrders = async () => {
                setIsLoading(true);
                setError(null);

                const { data, error: fetchError } = await supabase
                    .from('orders')
                    .select(`
                        order_id,
                        order_date,
                        total_amount,
                        order_status,
                        pharmacy_profile:profiles!orders_pharmacy_user_id_fkey(pharmacy_name),
                        provider_profile:profiles!orders_provider_user_id_fkey(provider_name)
                    `)
                    .order('order_date', { ascending: false });

                if (fetchError) {
                    console.error("Error fetching all orders:", fetchError);
                    setError("Could not fetch order data.");
                } else if (data) {
                    const transformedOrders: Order[] = (data as any[]).map((order) => ({
                        ...order,
                        pharmacy_profile: Array.isArray(order.pharmacy_profile) ? order.pharmacy_profile[0] ?? null : order.pharmacy_profile ?? null,
                        provider_profile: Array.isArray(order.provider_profile) ? order.provider_profile[0] ?? null : order.provider_profile ?? null,
                    }));
                    setOrders(transformedOrders);
                }
                setIsLoading(false);
            };
            fetchAllOrders();
        } else if (!authLoading) {
            setIsLoading(false);
        }
    }, [adminProfile, authLoading]);
    
    // --- Status Update Logic ---
    const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
        setUpdatingOrderId(orderId);
        setError(null);

        const { data, error: updateError } = await supabase
            .from('orders')
            .update({ order_status: newStatus })
            .eq('order_id', orderId)
            .select()
            .single();

        if (updateError) {
            console.error("Error updating order status:", updateError);
            setError("Failed to update order status. Please try again.");
        } else if (data) {
            // Update the order in the local state to reflect the change immediately
            setOrders(currentOrders =>
                currentOrders.map(order =>
                    order.order_id === orderId ? { ...order, order_status: data.order_status } : order
                )
            );
        }
        setUpdatingOrderId(null);
    };

    // Memoized filtered and sorted orders
    const filteredAndSortedOrders = useMemo(() => {
        let filtered = orders;
        if (searchTerm.trim() !== '') {
            const lower = searchTerm.toLowerCase();
            filtered = filtered.filter(order =>
                order.order_id.toString().includes(lower) ||
                (order.pharmacy_profile?.pharmacy_name?.toLowerCase().includes(lower)) ||
                (order.provider_profile?.provider_name?.toLowerCase().includes(lower))
            );
        }
        if (sortConfig !== null) {
            filtered = [...filtered].sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return 1;
                if (bValue == null) return -1;
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
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

    if (authLoading) return <div className="p-8 text-center">Loading user profile...</div>;
    if (adminProfile?.role !== 'Admin') return <div className="p-8 text-center text-red-500"><h1>Access Denied</h1><p>You must be an administrator to view this page.</p></div>;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-white">Transaction Log</h1>
            <div className="mb-6">
                <input type="text" placeholder="Search by Order ID, Pharmacy, or Provider..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg"/>
            </div>
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}
            {isLoading ? <p className="text-center text-gray-500">Loading all orders...</p> : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="p-4"><button onClick={() => requestSort('order_id')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Order ID</button></th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Pharmacy</th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Provider</th>
                                <th className="p-4"><button onClick={() => requestSort('total_amount')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Total</button></th>
                                <th className="p-4 font-semibold text-sm text-gray-600 dark:text-gray-300">Status</th>
                                <th className="p-4"><button onClick={() => requestSort('order_date')} className="font-semibold text-sm text-gray-600 dark:text-gray-300">Date</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAndSortedOrders.length > 0 ? (
                                filteredAndSortedOrders.map(order => (
                                    <tr key={order.order_id} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="p-4 font-medium text-gray-800 dark:text-gray-200">#{order.order_id}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{order.pharmacy_profile?.pharmacy_name || 'N/A'}</td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{order.provider_profile?.provider_name || 'N/A'}</td>
                                        <td className="p-4 text-gray-800 dark:text-gray-200">${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</td>
                                        <td className="p-4">
                                            {updatingOrderId === order.order_id ? (
                                                <span className="text-sm text-gray-500">Updating...</span>
                                            ) : (
                                                <select
                                                    value={order.order_status}
                                                    onChange={(e) => handleStatusChange(order.order_id, e.target.value as OrderStatus)}
                                                    className={`w-full p-1 text-xs font-medium rounded-md border-transparent focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.order_status)}`}
                                                    style={{ appearance: 'none', paddingRight: '1.5rem' }} // Basic styling for the select
                                                >
                                                    {ALL_ORDER_STATUSES.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(order.order_date).toLocaleDateString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-gray-500">No orders found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
