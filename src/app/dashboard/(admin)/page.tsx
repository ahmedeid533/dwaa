'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase/client";

// --- Type Definitions ---

interface Stats {
    totalSales?: number;
    totalOrders?: number;
    totalUsers?: number;
    openRequests?: number;
}

interface Order {
    order_id: number;
    total_amount: number;
    order_status: string;
    // Assuming 'profiles' is a to-one relationship from orders
    profiles: {
        pharmacy_name: string;
    } | null;
}

// --- Simplified Child Components (Typed) ---

const EcommerceMetrics: React.FC<{ stats: Stats }> = ({ stats }) => {
    const metrics = [
        { title: "Total Sales", value: `$${stats.totalSales?.toFixed(2) || '0.00'}` },
        { title: "Total Orders", value: stats.totalOrders || 0 },
        { title: "Total Users", value: stats.totalUsers || 0 },
        { title: "Open Requests", value: stats.openRequests || 0 },
    ];
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {metrics.map(metric => (
                <div key={metric.title} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.title}</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">{metric.value}</p>
                </div>
            ))}
        </div>
    );
};

const RecentOrders: React.FC<{ orders: Order[] }> = ({ orders }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b dark:border-gray-700">
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Order ID</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Pharmacy</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                        <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.order_id} className="border-b dark:border-gray-700 last:border-b-0">
                            <td className="p-3 text-gray-800 dark:text-gray-200">#{order.order_id}</td>
                            <td className="p-3 text-gray-600 dark:text-gray-400">{order.profiles?.pharmacy_name || 'N/A'}</td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">${order.total_amount.toFixed(2)}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>
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


// --- Main Admin Dashboard Component (Typed) ---
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
            } else if (!profile) { // Check if profile is null (not logged in)
                window.location.href = '/dashboard/signin';
            }
            return;
        }

        if (profile?.role === 'Admin') {
            const fetchAdminData = async () => {
                setIsLoading(true);

                // Fetch all data concurrently
                const [
                    profilesResponse,
                    ordersResponse,
                    requestsResponse,
                    recentOrdersResponse
                ] = await Promise.all([
                    supabase.from('profiles').select('*', { count: 'exact', head: true }),
                    supabase.from('orders').select('total_amount', { count: 'exact' }),
                    supabase.from('medicine_requests').select('*', { count: 'exact', head: true }).eq('status', 'Open'),
                    supabase.from('orders').select('*, profiles(pharmacy_name)').order('order_date', { ascending: false }).limit(5)
                ]);

                // Safely calculate total sales
                const totalSales = ordersResponse.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

                // [FIXED] Safely set stats, converting null counts to 0 to match the 'Stats' type.
                setStats({
                    totalUsers: profilesResponse.count ?? 0,
                    totalOrders: ordersResponse.count ?? 0,
                    openRequests: requestsResponse.count ?? 0,
                    totalSales
                });

                if (recentOrdersResponse.error) {
                    console.error("Error fetching recent orders:", recentOrdersResponse.error);
                } else {
                    // Safely set recent orders, providing an empty array as a fallback.
                    setRecentOrders(recentOrdersResponse.data as Order[] ?? []);
                }

                setIsLoading(false);
            };

            fetchAdminData();
        }
    }, [profile, authLoading]);

    if (authLoading || (profile?.role === 'Admin' && isLoading)) {
        return <div className="p-8 text-center">Loading Admin Dashboard...</div>;
    }

    if (profile?.role !== 'Admin') {
        return <div className="p-8 text-center">Redirecting...</div>;
    }

    return (
        <div className="space-y-6">
            <EcommerceMetrics stats={stats} />
            <RecentOrders orders={recentOrders} />
        </div>
    );
}
