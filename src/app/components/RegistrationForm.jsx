'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';
import { supabase } from '@/utils/supabase/client';

// This is the final, merged component with corrected UI.
const RegistrationForm = () => {
  const { language } = useLanguage();
  const t = translations[language].registration;
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Pharmacy',
    contact_phone: '',
    city: '',
    pharmacy_name: '',
    address: '',
    license_number: '',
    provider_name: '',
    warehouse_address: ''
  });

  const egyptianCities = [ 'Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'Tanta', 'Asyut', 'Ismailia', 'Fayyum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'Minya', 'Beni Suef', 'Hurghada', 'Qena', 'Sohag', 'Shibin El Kom', 'Banha', 'Kafr el-Sheikh' ]; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = t.required;
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email address.";
    if (!formData.password || formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (!formData.role) newErrors.role = t.required;
    if (!formData.contact_phone) newErrors.contact_phone = t.required;
    if (!formData.city) newErrors.city = t.required;
    if (formData.role === 'Pharmacy') {
      if (!formData.pharmacy_name) newErrors.pharmacy_name = t.required;
      if (!formData.address) newErrors.address = t.required;
      if (!formData.license_number) newErrors.license_number = t.required;
    } else if (formData.role === 'Provider') {
      if (!formData.provider_name) newErrors.provider_name = t.required;
      if (!formData.warehouse_address) newErrors.warehouse_address = t.required;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoading(true);
    setErrors({});
    setMessage('');
    setShowSuccess(false);

    try {
      const userMetaData = formData.role === 'Pharmacy'
        ? {
            role: 'Pharmacy',
            contact_phone: formData.contact_phone,
            city: formData.city,
            pharmacy_name: formData.pharmacy_name,
            address: formData.address,
            license_number: formData.license_number,
          }
        : {
            role: 'Provider',
            contact_phone: formData.contact_phone,
            city: formData.city,
            provider_name: formData.provider_name,
            warehouse_address: formData.warehouse_address,
          };

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: userMetaData,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      setShowSuccess(true);
      setMessage(t.registrationSuccess);

    } catch (err) {
      console.error('Error signing up:', err);
      let friendlyMessage = err.message;
      if (err.message.includes("Database error saving new user")) {
        friendlyMessage = "A database error occurred. The license number may already be in use.";
      } else if (err.message.includes("User already registered")) {
        friendlyMessage = "An account with this email already exists.";
      }
      setErrors({ form: friendlyMessage });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  // --- NEW UI STRUCTURE ---
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 md:p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{t.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-800 rounded-lg text-center">
            {message}
          </div>
        )}
        {errors.form && (
          <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-800 rounded-lg text-center">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email and Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.email} <span className="text-red-500">*</span></label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.email ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`} />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.password} <span className="text-red-500">*</span></label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.password ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`} />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t.accountType} <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'Pharmacy' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="Pharmacy" checked={formData.role === 'Pharmacy'} onChange={handleInputChange} className="sr-only" />
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.role === 'Pharmacy' ? 'border-blue-500' : 'border-gray-400'}`}>
                    {formData.role === 'Pharmacy' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-200">{t.pharmacy}</span>
                </div>
              </label>
              <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.role === 'Provider' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                <input type="radio" name="role" value="Provider" checked={formData.role === 'Provider'} onChange={handleInputChange} className="sr-only" />
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${formData.role === 'Provider' ? 'border-purple-500' : 'border-gray-400'}`}>
                    {formData.role === 'Provider' && <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-200">{t.provider}</span>
                </div>
              </label>
            </div>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.contactPhone} <span className="text-red-500">*</span></label>
              <input type="text" name="contact_phone" value={formData.contact_phone} onChange={handleInputChange} placeholder={language === 'ar' ? '01234567890' : '01234567890'} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.contact_phone ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`} />
              {errors.contact_phone && <p className="mt-1 text-sm text-red-600">{errors.contact_phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.city} <span className="text-red-500">*</span></label>
              <select name="city" value={formData.city} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.city ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`}>
                <option value="">{language === 'ar' ? 'اختر المدينة' : 'Select City'}</option>
                {egyptianCities.map(city => (<option key={city} value={city}>{city}</option>))}
              </select>
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
          </div>

          {/* Role Specific Fields */}
          {formData.role === 'Pharmacy' && (
            <div className="space-y-6 pt-4 border-t dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.pharmacyName} <span className="text-red-500">*</span></label>
                <input type="text" name="pharmacy_name" value={formData.pharmacy_name} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.pharmacy_name ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`} />
                {errors.pharmacy_name && <p className="mt-1 text-sm text-red-600">{errors.pharmacy_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.address} <span className="text-red-500">*</span></label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.address ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`} />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.licenseNumber} <span className="text-red-500">*</span></label>
                <input type="text" name="license_number" value={formData.license_number} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.license_number ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/50'}`} />
                {errors.license_number && <p className="mt-1 text-sm text-red-600">{errors.license_number}</p>}
              </div>
            </div>
          )}
          {formData.role === 'Provider' && (
            <div className="space-y-6 pt-4 border-t dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.providerName} <span className="text-red-500">*</span></label>
                <input type="text" name="provider_name" value={formData.provider_name} onChange={handleInputChange} className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.provider_name ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/50'}`} />
                {errors.provider_name && <p className="mt-1 text-sm text-red-600">{errors.provider_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t.warehouseAddress} <span className="text-red-500">*</span></label>
                <textarea name="warehouse_address" value={formData.warehouse_address} onChange={handleInputChange} rows="3" className={`w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border rounded-lg focus:ring-2 ${errors.warehouse_address ? 'border-red-300 ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-purple-500 focus:ring-purple-500/50'}`} />
                {errors.warehouse_address && <p className="mt-1 text-sm text-red-600">{errors.warehouse_address}</p>}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-6">
            <button type="submit" disabled={isSubmitting || !formData.role} className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform ${isSubmitting || !formData.role ? 'bg-gray-400 cursor-not-allowed' : formData.role === 'Pharmacy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700'}`}>
              {isSubmitting ? t.submitting : t.submit}
            </button>
          </div>
				</form>
				<div className="mt-8 text-center">
          <p className="text-md text-gray-600">
            {language === 'ar' 
              ? 'إذا كان لديك حساب بالفعل، يرجى'
              : 'if you already have an account, please'
						}
						<a href="/dashboard/signin" className="text-blue-600 hover:underline ml-1">
							{language === 'ar' ? 'تسجيل الدخول' : 'Login'}
						</a>

          </p>
        </div>
				<div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {language === 'ar' 
              ? 'بالتسجيل، أنت توافق على شروط الخدمة وسياسة الخصوصية'
              : 'By registering, you agree to our Terms of Service and Privacy Policy'
            }
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
