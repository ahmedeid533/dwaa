'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';

// Define a type for a single notification
export type Notification = {
	notification_id: number;
	message: string;
	is_read: boolean;
	link_to: string | null;
	created_at: string;
};

// Define the shape of your context data
interface Profile {
	id: string;
	[key: string]: unknown;
}

interface AuthContextType {
	user: User | null;
	session: Session | null;
	profile: Profile | null;
	loading: boolean;
	notifications: Notification[];
	markNotificationAsRead: (notificationId: number) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [loading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	useEffect(() => {
		// This listener fires whenever the auth state changes.
		const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		// Fetch the initial session
		const getInitialSession = async () => {
			const { data: { session } } = await supabase.auth.getSession();
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		};

		getInitialSession();

		// Cleanup the listener on component unmount
		return () => {
			authListener?.subscription?.unsubscribe();
		};
	}, []);

	// Fetch the user's profile and notifications when the user state changes
	useEffect(() => {
		if (user) {
			const fetchProfile = async () => {
				const { data, error } = await supabase
					.from('profiles')
					.select('*')
					.eq('id', user.id)
					.single();
				if (error) {
					console.error('Error fetching profile:', error);
				} else {
					setProfile(data as Profile);
				}
			};

			const fetchNotifications = async () => {
				const { data, error } = await supabase
					.from('notifications')
					.select('*')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false });

				if (error) {
					console.error('Error fetching notifications:', error);
				} else {
					setNotifications((data as Notification[]) || []);
				}
			};

			fetchProfile();
			fetchNotifications();
		} else {
			setProfile(null);
			setNotifications([]);
		}
	}, [user]);

	// Function to mark a notification as read
	const markNotificationAsRead = async (notificationId: number) => {
		const { error } = await supabase
			.from('notifications')
			.update({ is_read: true })
			.eq('notification_id', notificationId);

		if (error) {
			console.error('Error marking notification as read:', error);
		} else {
			setNotifications(notifications.map(n =>
				n.notification_id === notificationId ? { ...n, is_read: true } : n
			));
		}
	};

	const value: AuthContextType = {
		session,
		user,
		profile,
		loading,
		notifications,
		markNotificationAsRead,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a custom hook to use the auth context easily
export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
