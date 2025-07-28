'use client';

import React, { useEffect, useState, useRef } from "react";
import { useAuth, Notification } from "@/context/AuthContext"; // Import useAuth and the Notification type
import { supabase } from "@/utils/supabase/client"; // Import supabase client for polling
import { useSidebar } from "@/context/SidebarContext";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';

// --- Notification Icon ---
const BellIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 22.0001 12 22.0001C11.6496 22.0001 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


// --- NotificationDropdown Component with Polling ---
const NotificationDropdown: React.FC = () => {
    const { notifications: initialNotifications, markNotificationAsRead: markAsReadInContext, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Sync with context when it first loads
    useEffect(() => {
        setNotifications(initialNotifications);
    }, [initialNotifications]);

    // Effect for polling every 5 seconds
    useEffect(() => {
        if (!user) return; // Don't poll if the user is not logged in

        const fetchNotifications = async () => {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            
            if (error) {
                console.error('Error polling for notifications:', error);
            } else {
                setNotifications(data || []);
            }
        };

        const intervalId = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [user]);


    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.is_read) {
            // Call the context function to update the database
            if (markAsReadInContext) {
                markAsReadInContext(notification.notification_id);
            }
            // Also update local state immediately for instant UI feedback
            setNotifications(notifications.map(n => 
                n.notification_id === notification.notification_id ? { ...n, is_read: true } : n
            ));
        }
        setIsOpen(false);
    };
    
    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden">
                    <div className="p-3 font-semibold border-b dark:border-gray-700">Notifications</div>
                    <ul className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <li key={n.notification_id} onClick={() => handleNotificationClick(n)} className={`p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${!n.is_read ? 'font-bold' : 'font-normal text-gray-500 dark:text-gray-400'}`}>
                                    <Link href={n.link_to || '#'}>
                                        <p className="text-sm">{n.message}</p>
                                        <p className="text-xs text-cyan-500">{new Date(n.created_at).toLocaleString()}</p>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="p-4 text-sm text-center text-gray-500">No notifications</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

// --- Simple Icons for the Dropdown ---
const ProfileIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);


const UserDropdown: React.FC = () => {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/dashboard/signin');
    };

    // Effect to handle clicks outside of the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading || !user) return null;

    const getDisplayName = (): string => {
        if (profile && typeof profile.pharmacy_name === 'string' && profile.pharmacy_name) {
            return profile.pharmacy_name;
        }
        if (profile && typeof profile.provider_name === 'string' && profile.provider_name) {
            return profile.provider_name;
        }
        if (user && user.email) {
            return user.email;
        }
        return 'U'; // Fallback
    };

    const displayName = getDisplayName();
    const initial = displayName.charAt(0).toUpperCase();
    const imageSrc = `https://placehold.co/40x40/000000/FFFFFF?text=${initial}`;
    const accountName = displayName === 'U' ? 'My Account' : displayName;

    // [FIXED] Replaced the problematic expression with the already-safe `displayName` variable.
    // We can adjust the fallback logic if needed, but this guarantees a string.
    const dropdownHeaderText = (displayName !== 'U' && displayName !== user.email) ? displayName : '';


    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 focus:outline-none">
                {user?.email &&
                    <Image
                        width={40}
                        height={40}
                        className="rounded-full"
                        src={imageSrc}
                        alt="User"
                    />
                }
                <span className="hidden lg:block font-medium text-gray-700 dark:text-gray-300">
                    {accountName}
                </span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b dark:border-gray-700">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">{dropdownHeaderText}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>
                    <ul>
                        <li>
                            <Link href="/dashboard/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ProfileIcon />
                                My Profile
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <LogoutIcon />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};




// --- AppHeader Component ---
const AppHeader: React.FC = () => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const { user } = useAuth(); // Get user to conditionally render header items

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-50 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex items-center justify-between grow lg:px-6">
        <div className="flex items-center gap-2 px-3 py-3 sm:gap-4 lg:py-4">
          <button
            className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg z-50 dark:text-gray-400 lg:h-11 lg:w-11 lg:border dark:border-gray-800"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z" fill="currentColor"/></svg> : <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z" fill="currentColor"/></svg>}
          </button>
          
          <h1 className="hidden lg:block font-bold text-xl text-gray-800 dark:text-white">Pharma-Connect</h1>
        </div>

        {/* Right side of header */}
        <div className="flex items-center gap-4 px-3 py-3 lg:py-0">
            <ThemeToggleButton />
            {user && (
                <>
                    <NotificationDropdown />
                    <UserDropdown />
                </>
            )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
