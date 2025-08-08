'use client';

import React, { useEffect, useState } from "react";
// Make sure the path to your AuthContext and Supabase client is correct
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions (Updated) ---

interface Stats {
    totalSales?: number;
    totalOrders?: number;
    totalUsers?: number;
    openRequests?: number;
}

// I've updated the Order type to include the provider's profile,
// matching the structure from your other admin page for consistency.
interface Order {
    order_id: number;
    total_amount: number;
    order_status: string;
    pharmacy_profile: {
        pharmacy_name: string;
    } | null;
    provider_profile: {
        provider_name: string;
    } | null;
}

// --- Helper Function for Status Colors ---
// This helper function dynamically colors the order status badges.
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
};


// --- Simplified Child Components (Updated with new colors) ---

const EcommerceMetrics: React.FC<{ stats: Stats }> = ({ stats }) => {
    const metrics = [
        { title: "Total Sales", value: `$${stats.totalSales?.toFixed(2) || '0.00'}` },
        { title: "Total Orders", value: stats.totalOrders || 0 },
        { title: "Total Users", value: stats.totalUsers || 0 },
        { title: "Open Requests", value: stats.openRequests || 0 },
    ];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {metrics.map(metric => (
                <div key={metric.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 tracking-wide">{metric.title}</h3>
                    <p className="text-3xl font-bold text-[#08d9b3] mt-2">{metric.value}</p>
                </div>
            ))}
        </div>
    );
};

// The RecentOrders component is updated to show the provider and use dynamic status colors.
const RecentOrders: React.FC<{ orders: Order[] }> = ({ orders }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Pharmacy</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Provider</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                        <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.order_id} className="border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="p-4 font-medium text-[#08d9b3]">#{order.order_id}</td>
                            <td className="p-4 text-gray-600 dark:text-gray-400">{order.pharmacy_profile?.pharmacy_name || 'N/A'}</td>
                            <td className="p-4 text-gray-600 dark:text-gray-400">{order.provider_profile?.provider_name || 'N/A'}</td>
                            <td className="p-4 text-gray-800 dark:text-gray-200">${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</td>
                            <td className="p-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status)}`}>
                                    {order.order_status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);


// --- Main Admin Dashboard Component (Updated) ---
export default function AdminDashboard() {
    const { profile, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<Stats>({});
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && profile?.role !== 'Admin') {
            if (profile?.role === 'Pharmacy') {
                window.location.href = '/dashboard/request-medicine';
            } else if (profile?.role === 'Provider') {
                window.location.href = '/dashboard/requests';
            } else if (!profile) {
                window.location.href = '/dashboard/signin';
            }
            return;
        }

        if (profile?.role === 'Admin') {
            const fetchAdminData = async () => {
                setIsLoading(true);

                // --- Updated Supabase Query for Recent Orders ---
                // This query now correctly fetches related profiles for both pharmacy and provider.
                const [
                    profilesResponse,
                    ordersResponse,
                    requestsResponse,
                    recentOrdersResponse
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('orders').select('total_amount', { count: 'exact' }),
                    supabase.from('medicine_requests').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
                    supabase.from('orders').select(`
                        order_id,
                        total_amount,
                        order_status,
                        pharmacy_profile:profiles!orders_pharmacy_user_id_fkey(pharmacy_name),
                        provider_profile:profiles!orders_provider_user_id_fkey(provider_name)
                    `).order('order_date', { ascending: false }).limit(5)
                ]);

                const totalSales = ordersResponse.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

                setStats({
                    totalUsers: profilesResponse.count ?? 0,
                    totalOrders: ordersResponse.count ?? 0,
                    openRequests: requestsResponse.count ?? 0,
                    totalSales
                });

                if (recentOrdersResponse.error) {
                    console.error("Error fetching recent orders:", recentOrdersResponse.error);
                } else if (recentOrdersResponse.data) {
                    // This transformation ensures the profile data is correctly shaped before setting state.
                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const transformedOrders: Order[] = (recentOrdersResponse.data as any[]).map((order) => ({
                        ...order,
                        pharmacy_profile: Array.isArray(order.pharmacy_profile) ? order.pharmacy_profile[0] ?? null : order.pharmacy_profile ?? null,
                        provider_profile: Array.isArray(order.provider_profile) ? order.provider_profile[0] ?? null : order.provider_profile ?? null,
                    }));
                    setRecentOrders(transformedOrders);
                }

                setIsLoading(false);
            };

            fetchAdminData();
        }
    }, [profile, authLoading]);

    if (authLoading || (profile?.role === 'Admin' && isLoading)) {
        return <div className="flex items-center justify-center min-h-screen text-lg text-gray-500 dark:text-gray-400">Loading Admin Dashboard...</div>;
    }

    if (profile?.role !== 'Admin') {
        return <div className="flex items-center justify-center min-h-screen text-lg text-gray-500 dark:text-gray-400">Redirecting...</div>;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen space-y-6 p-4 sm:p-8">
            <EcommerceMetrics stats={stats} />
            <RecentOrders orders={recentOrders} />
        </div>
    );
}
