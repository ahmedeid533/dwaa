"use client";

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
  }

  interface UserMetaDataProvider extends BaseUserMetaData {
    role: 'Provider';
    provider_name: string;
    warehouse_address: string;
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
            city: city,
            license_number: licenseNumber,
          }
        : {
            role: 'Provider',
            first_name: firstName,
            last_name: lastName,
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
        setError(err.message + (err.message.includes("Database") ? " maybe the license number is already used by another pharmacy.":""));
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
            <Label htmlFor="pharmacyName">Pharmacy Name<span className="text-error-500">*</span></Label>
            <Input id="pharmacyName" type="text" defaultValue={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} placeholder="Enter pharmacy name" />
          </div>
          {/* License Number */}
          <div>
            <Label htmlFor="licenseNumber">License Number<span className="text-error-500">*</span></Label>
            <Input id="licenseNumber" type="text" defaultValue={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="Enter license number" />
          </div>
          {/* City */}
          <div>
            <Label htmlFor="city">City<span className="text-error-500">*</span></Label>
            <Input id="city" type="text" defaultValue={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
          </div>
          {/* Address */}
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address<span className="text-error-500">*</span></Label>
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
            <Label htmlFor="providerName">Provider Name<span className="text-error-500">*</span></Label>
            <Input id="providerName" type="text" defaultValue={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Enter your company name" />
          </div>
          {/* Warehouse Address */}
          <div className="sm:col-span-2">
            <Label htmlFor="warehouseAddress">Warehouse Address<span className="text-error-500">*</span></Label>
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
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Create an Account
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your details to sign up!
            </p>
          </div>
          <div>
            {/* Social Auth Buttons */}
            {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"/><path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"/><path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"/><path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"/></svg>
                Sign up with Google
              </button>
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg width="21" className="fill-current" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" /></svg>
                Sign up with X
              </button>
            </div> */}
            {/* Divider */}
            {/* <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">Or</span>
              </div>
            </div> */}

            <form onSubmit={handleSignUp}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="fname">First Name<span className="text-error-500">*</span></Label>
                    <Input type="text" id="fname" name="fname" placeholder="Enter your first name" defaultValue={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  {/* Last Name */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="lname">Last Name<span className="text-error-500">*</span></Label>
                    <Input type="text" id="lname" name="lname" placeholder="Enter your last name" defaultValue={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email<span className="text-error-500">*</span></Label>
                  <Input type="email" id="email" name="email" placeholder="Enter your email" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password<span className="text-error-500">*</span></Label>
                  <div className="relative">
                    <Input id="password" name="password" placeholder="Enter your password" type={showPassword ? "text" : "password"} defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />}
                    </span>
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                    <Label htmlFor="role">I am signing up as a...<span className="text-error-500">*</span></Label>
                    <select
                        id="role"
                        defaultValue={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="relative z-20 w-full px-4 py-3 text-sm transition-all duration-150 ease-in-out bg-white border border-gray-200 rounded-lg outline-none appearance-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:border-brand-500"
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
                  <button type="submit" disabled={loading} className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-400 disabled:cursor-not-allowed">
                    {loading ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?{" "}
                <Link href="/dashboard/signin" className="text-brand-500 hover:text-brand-600 dark:text-brand-400">
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