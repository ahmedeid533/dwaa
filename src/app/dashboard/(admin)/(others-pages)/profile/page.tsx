'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext'; // Assuming you have an AuthContext
import { supabase } from '@/utils/supabase/client'; // Your Supabase client

// --- Type Definitions ---
type ProfileStatus = 'under_review' | 'approved' | 'rejected';
type UserRole = 'Pharmacy' | 'Provider' | 'Admin';

// [FIXED] Defined a specific type for the profile data to avoid using 'any'.
type Profile = {
    id: string;
    role: UserRole;
    contact_phone: string | null;
    created_at: string;
    pharmacy_name: string | null;
    address: string | null;
    city: string | null;
    license_number: string | null;
    provider_name: string | null;
    warehouse_address: string | null;
    average_rating: number;
    status: ProfileStatus;
};


// --- Helper Components & Icons ---

const Icon = ({ name, className, fill = "none" }: { name: string, className?: string, fill?: string }) => {
    const icons: { [key: string]: React.JSX.Element } = {
        user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
        phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />,
        mapPin: (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </>
        ),
        shieldCheck: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />,
        star: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-3.152a.563.563 0 00-.652 0l-4.725 3.152a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
    };
    return <svg xmlns="http://www.w3.org/2000/svg" fill={fill} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>{icons[name]}</svg>;
};

const StarRatingDisplay = ({ rating }: { rating: number }) => {
    const totalStars = 5;
    return (
        <div className="flex items-center">
            {[...Array(totalStars)].map((_, index) => (
                <Icon key={index} name="star" fill="currentColor" className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
        </div>
    );
};

const StatusBadge = ({ status }: { status: ProfileStatus }) => {
    const statusStyles: { [key: string]: string } = {
        under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return (
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ').toUpperCase()}
        </span>
    );
};


// --- Main Profile Page Component ---

export default function ProfilePage() {
    const { user } = useAuth();
    // [FIXED] Used the specific 'Profile' type for state.
    const [profile, setProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState<Partial<Profile>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            setError('Failed to fetch profile data.');
            console.error(error);
        } else if (data) {
            setProfile(data);
            setFormData(data);
        }
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setError(null);

        // [FIXED] Explicitly create the update object to avoid unused variable errors.
        // This object only contains the fields that should be editable by the user.
        const updateData = {
            contact_phone: formData.contact_phone,
            pharmacy_name: formData.pharmacy_name,
            address: formData.address,
            city: formData.city,
            license_number: formData.license_number,
            provider_name: formData.provider_name,
            warehouse_address: formData.warehouse_address,
        };

        const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id);

        if (updateError) {
            setError('Failed to update profile. Please try again.');
            console.error(updateError);
        } else {
            await fetchProfile();
            setIsEditing(false);
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        if (profile) {
            setFormData(profile);
        }
        setIsEditing(false);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading profile...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500"><h1>Error</h1><p>{error}</p></div>;
    }

    if (!profile) {
        return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Profile not found.</div>;
    }

    const renderField = (name: keyof Profile, label: string, icon: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#08d9b3] focus:border-[#08d9b3] sm:text-sm"
                />
            ) : (
                <div className="flex items-center mt-1">
                    <Icon name={icon} className="h-5 w-5 text-gray-400 mr-2" />
                    <p className="text-gray-800 dark:text-gray-200">{profile[name] || 'Not provided'}</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    {/* --- Profile Header --- */}
                    <div className="p-6 sm:p-8 bg-[#08d9b3]">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                    {profile.role === 'Pharmacy' ? profile.pharmacy_name : profile.provider_name}
                                </h1>
                                <p className="text-sm text-cyan-100 mt-1">{profile.role}</p>
                            </div>
                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="mt-4 sm:mt-0 bg-white/20 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- Profile Body --- */}
                    <div className="p-6 sm:p-8">
                        {/* --- Status and Rating --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Status</h3>
                                <div className="mt-2">
                                    <StatusBadge status={profile.status} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Rating</h3>
                                <div className="mt-2 flex items-center gap-2">
                                    <StarRatingDisplay rating={profile.average_rating} />
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">{Number(profile.average_rating).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        {/* --- Profile Details --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {renderField('contact_phone', 'Contact Phone', 'phone')}
                            
                            {profile.role === 'Pharmacy' ? (
                                <>
                                    {renderField('address', 'Pharmacy Address', 'mapPin')}
                                    {renderField('city', 'City', 'mapPin')}
                                    {renderField('license_number', 'License Number', 'shieldCheck')}
                                </>
                            ) : (
                                <>
                                    {renderField('warehouse_address', 'Warehouse Address', 'mapPin')}
                                </>
                            )}
                        </div>

                        {/* --- Edit Mode Actions --- */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="bg-[#08d9b3] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#07c0a0] disabled:bg-[#08d9b3]/50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
