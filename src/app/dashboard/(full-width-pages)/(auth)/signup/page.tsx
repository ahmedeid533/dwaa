'use client';

import { useState } from 'react';
// Assuming you have a supabase client setup, if not, you'll need to create this file.
// For example, in /utils/supabase/client.ts
// import { createBrowserClient } from '@supabase/ssr'
// export const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
import { supabase } from '@/utils/supabase/client';
// import { Metadata } from "next";

// You can uncomment this if you want to use static metadata
// export const metadata: Metadata = {
//   title: "Next.js SignUp Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js SignUp Page TailAdmin Dashboard Template",
// };

export default function SignUp() {
  return <SignUpPage />;
}

// --- MAIN SIGN-UP COMPONENT (REMOVED 'export') ---
// This component is now local to this file and not exported, which resolves the build error.
function SignUpPage() {
  // --- STATE MANAGEMENT ---
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Pharmacy'); // Default role
  const [contactPhone, setContactPhone] = useState('');
  
  // Pharmacy-specific states
  const [pharmacyName, setPharmacyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Provider-specific states
  const [providerName, setProviderName] = useState('');
  const [warehouseAddress, setWarehouseAddress] = useState('');

  // UI feedback states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- TYPE DEFINITIONS ---
  // It's good practice to define types for clarity and safety.
  interface UserMetaDataPharmacy {
    role: 'Pharmacy';
    contact_phone: string;
    pharmacy_name: string;
    address: string;
    city: string;
    license_number: string;
  }

  interface UserMetaDataProvider {
    role: 'Provider';
    contact_phone: string;
    provider_name: string;
    warehouse_address: string;
  }

  type UserMetaData = UserMetaDataPharmacy | UserMetaDataProvider;

  // --- FORM SUBMISSION HANDLER ---
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // This is the metadata that will be passed to your database trigger
      // to populate the `profiles` table.
      const userMetaData: UserMetaData = role === 'Pharmacy'
        ? {
            role: 'Pharmacy',
            contact_phone: contactPhone,
            pharmacy_name: pharmacyName,
            address: address,
            city: city,
            license_number: licenseNumber,
          }
        : {
            role: 'Provider',
            contact_phone: contactPhone,
            provider_name: providerName,
            warehouse_address: warehouseAddress,
          };

      // Call the Supabase signUp method
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // The 'data' object here is crucial. It becomes `new.raw_user_meta_data`
          // in your PostgreSQL trigger.
          data: userMetaData,
        },
      });

      if (error) {
        throw error;
      }
      
      // NOTE: The logic to update the 'profiles' table after signup is complex.
      // Your original code attempts an update immediately after signUp, but the user isn't
      // authenticated yet, and a trigger is a more common pattern for this.
      // Assuming your trigger handles populating the profiles table from the metadata,
      // an explicit update call here might be redundant or fail due to RLS.
      // If the trigger is correctly set up, this client-side update is not needed.
      // For now, we'll assume the trigger works and just show a success message.

      if (data.user) {
        setMessage('Account created successfully! Please check your email to confirm your registration.');
      }

    } catch (error: unknown) {
      console.error('Error signing up:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- DYNAMIC FORM RENDERING ---
  const renderRoleSpecificFields = () => {
    if (role === 'Pharmacy') {
      return (
        <>
          <div className="space-y-1 lg:w-1/2">
            <label htmlFor="pharmacyName" className="text-sm font-medium text-gray-300">Pharmacy Name</label>
            <input id="pharmacyName" type="text" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div className="space-y-1 lg:w-1/3">
            <label htmlFor="licenseNumber" className="text-sm font-medium text-gray-300">License Number</label>
            <input id="licenseNumber" type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div className="space-y-1 lg:w-1/2">
            <label htmlFor="address" className="text-sm font-medium text-gray-300">Address</label>
            <input id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div className="space-y-1 lg:w-1/3">
            <label htmlFor="city" className="text-sm font-medium text-gray-300">City</label>
            <input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
        </>
      );
    }

    if (role === 'Provider') {
      return (
        <>
          <div className="space-y-1 w-full">
            <label htmlFor="providerName" className="text-sm font-medium text-gray-300">Provider Name</label>
            <input id="providerName" type="text" value={providerName} onChange={(e) => setProviderName(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div className="space-y-1 w-full">
            <label htmlFor="warehouseAddress" className="text-sm font-medium text-gray-300">Warehouse Address</label>
            <input id="warehouseAddress" type="text" value={warehouseAddress} onChange={(e) => setWarehouseAddress(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
        </>
      );
    }

    return null;
  };

  // --- JSX ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-xl p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg m-4">
        <h1 className="text-3xl font-bold text-center text-cyan-400">Create Your Account</h1>
        <form onSubmit={handleSignUp} className="space-y-4 flex gap-3 flex-wrap">
          {/* --- Common Fields --- */}
          <div className="space-y-1 w-full">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div className="space-y-1 w-full">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>
          <div className="space-y-1">
            <label htmlFor="contactPhone" className="text-sm font-medium text-gray-300">Contact Phone</label>
            <input id="contactPhone" type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
          </div>

          {/* --- Role Selector --- */}
          <div className="space-y-1">
            <label htmlFor="role" className="text-sm font-medium text-gray-300">I am a...</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
              <option value="Pharmacy">Pharmacy</option>
              <option value="Provider">Provider</option>
            </select>
          </div>

          {/* --- Dynamic Fields based on Role --- */}
          {renderRoleSpecificFields()}

          {/* --- Submission Button --- */}
          <button type="submit" disabled={loading} className="w-full p-3 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* --- Feedback Messages --- */}
        {message && <p className="text-sm text-center text-green-400 p-3 bg-green-900/50 rounded-md">{message}</p>}
        {error && <p className="text-sm text-center text-red-400 p-3 bg-red-900/50 rounded-md">{error}</p>}
      </div>
    </div>
  );
}
