'use client';

import { supabase } from '@/utils/supabase/client';
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";

export default function SignUpForm() {
  // --- STATE MANAGEMENT ---
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form input states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Pharmacy'); // Default role
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState('');

  // Pharmacy-specific states
  const [pharmacyName, setPharmacyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  // Provider-specific states
  const [providerName, setProviderName] = useState('');
  const [warehouseAddress, setWarehouseAddress] = useState('');
  
  // --- TYPE DEFINITIONS ---
  interface BaseUserMetaData {
    role: 'Pharmacy' | 'Provider';
    first_name: string;
    last_name: string;
  }

  interface UserMetaDataPharmacy extends BaseUserMetaData {
    role: 'Pharmacy';
    pharmacy_name: string;
    address: string;
    city: string;
    license_number: string;
    contact_phone: string;
  }

  interface UserMetaDataProvider extends BaseUserMetaData {
    role: 'Provider';
    provider_name: string;
    warehouse_address: string;
    contact_phone: string;
  }

  type UserMetaData = UserMetaDataPharmacy | UserMetaDataProvider;

  // --- FORM SUBMISSION HANDLER ---
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isChecked) {
      setError("You must agree to the Terms and Conditions and Privacy Policy.");
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const userMetaData: UserMetaData = role === 'Pharmacy'
        ? {
            role: 'Pharmacy',
            first_name: firstName,
            last_name: lastName,
            pharmacy_name: pharmacyName,
            address: address,
            contact_phone: phone,
            city: city,
            license_number: licenseNumber,
          }
        : {
            role: 'Provider',
            first_name: firstName,
            last_name: lastName,
            contact_phone: phone,
            provider_name: providerName,
            warehouse_address: warehouseAddress,
          };

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: userMetaData,
        },
      });

      if (signUpError) {
        throw signUpError;
      }
      console.log("data ==> ", data);
      // Check if the user was created for the first time or updated do that by check the time difference for maximum 5 seconds
      if (data.user && data.user.created_at && data.user.updated_at) {
        const createdAt = new Date(data.user.created_at);
        const updatedAt = new Date(data.user.updated_at);
        // Allow a maximum of 2 seconds difference to consider it a new user absolutely
        const differenceInSeconds = (updatedAt.getTime() - createdAt.getTime()) / 1000;
        console.log("differenceInSeconds ==> ", differenceInSeconds);
        // If the difference is less than 2 seconds, we consider it a new user
        if (Math.abs(differenceInSeconds) < 2) {
          setMessage('Account created! Please check your email to confirm your registration you will be redirect to dashboard in 3.');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 3000); // Redirect after 3 seconds
        } else {
          setError('Account already exists with this email. Please sign in or use a different email.');
        }
      }

    } catch (err: unknown) {
      console.error('Error signing up:', err);
      if (err instanceof Error) {
        setError(err.message + (err.message.includes("Database") ? " maybe the license number is already used by another pharmacy." : ""));
      } else {
        setError('An unexpected error occurred during sign-up.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- DYNAMIC FORM FIELD RENDERER ---
  const renderRoleSpecificFields = () => {
    if (role === 'Pharmacy') {
      return (
        <>
          {/* Pharmacy Name */}
          <div className="sm:col-span-2">
            <Label htmlFor="pharmacyName">Pharmacy Name<span className="text-red-500">*</span></Label>
            <Input id="pharmacyName" type="text" defaultValue={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} placeholder="Enter pharmacy name" />
          </div>
          {/* License Number */}
          <div>
            <Label htmlFor="licenseNumber">License Number<span className="text-red-500">*</span></Label>
            <Input id="licenseNumber" type="text" defaultValue={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Enter license number" />
          </div>
          {/* City */}
          <div>
            <Label htmlFor="city">City<span className="text-red-500">*</span></Label>
            <Input id="city" type="text" defaultValue={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
          </div>
          {/* Address */}
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address<span className="text-red-500">*</span></Label>
            <Input id="address" type="text" defaultValue={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter pharmacy address" />
          </div>
        </>
      );
    }

    if (role === 'Provider') {
      return (
        <>
          {/* Provider Name */}
          <div className="sm:col-span-2">
            <Label htmlFor="providerName">Provider Name<span className="text-red-500">*</span></Label>
            <Input id="providerName" type="text" defaultValue={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Enter your company name" />
          </div>
          {/* Warehouse Address */}
          <div className="sm:col-span-2">
            <Label htmlFor="warehouseAddress">Warehouse Address<span className="text-red-500">*</span></Label>
            <Input id="warehouseAddress" type="text" defaultValue={warehouseAddress} onChange={(e) => setWarehouseAddress(e.target.value)} placeholder="Enter warehouse address" />
          </div>
        </>
      );
    }
    return null;
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-2xl sm:text-3xl dark:text-white/90">
              Create an Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="fname">First Name<span className="text-red-500">*</span></Label>
                    <Input type="text" id="fname" name="fname" placeholder="Enter your first name" defaultValue={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  {/* Last Name */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="lname">Last Name<span className="text-red-500">*</span></Label>
                    <Input type="text" id="lname" name="lname" placeholder="Enter your last name" defaultValue={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email<span className="text-red-500">*</span></Label>
                  <Input type="email" id="email" name="email" placeholder="Enter your email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                {/* phone */}
                <div>
                  <Label htmlFor="phone">Phone Number<span className="text-red-500">*</span></Label>
                  <Input id="phone" type="tel" defaultValue={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter phone number" />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password<span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? "text" : "password"} defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? <EyeIcon className="text-gray-500 dark:text-gray-400" /> : <EyeCloseIcon className="text-gray-500 dark:text-gray-400" />}
                    </span>
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                    <Label htmlFor="role">I am signing up as a...<span className="text-red-500">*</span></Label>
                    <select
                        id="role"
                        defaultValue={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="relative z-20 w-full px-4 py-3 text-sm transition-all duration-150 ease-in-out bg-white border border-gray-300 rounded-lg outline-none appearance-none dark:bg-gray-800 dark:border-gray-700 focus:border-[#08d9b3] focus:ring-1 focus:ring-[#08d9b3] dark:focus:border-[#08d9b3]"
                    >
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Provider">Provider / Distributor</option>
                    </select>
                </div>
                
                {/* Dynamically Rendered Fields */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {renderRoleSpecificFields()}
                </div>

                {/* Checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox className="w-5 h-5" checked={isChecked} onChange={setIsChecked} />
                  <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                    By creating an account you agree to the{" "}
                    <Link href="/terms" className="text-gray-800 dark:text-white/90 hover:underline">Terms and Conditions</Link>, and our{" "}
                    <Link href="/privacy" className="text-gray-800 dark:text-white hover:underline">Privacy Policy</Link>
                  </p>
                </div>

                {/* Feedback Messages */}
                {error && <p className="p-3 text-sm text-center text-red-500 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">{error}</p>}
                {message && <p className="p-3 text-sm text-center text-green-600 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-400">{message}</p>}

                {/* Submit Button */}
                <div>
                  <button type="submit" disabled={loading} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-[#08d9b3] shadow-theme-xs hover:bg-[#07c0a0] disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link href="/dashboard/signin" className="text-[#08d9b3] hover:text-[#07c0a0]">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
