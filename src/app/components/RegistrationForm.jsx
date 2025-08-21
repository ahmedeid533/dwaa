
// "use client"

// import { useState } from "react"
// import { ArrowRight } from "lucide-react"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { useLanguage } from '@/context/LanguageContext';
// import { translations } from '@/translations/translations';

// export default function RegistrationSection() {
//   const { language } = useLanguage();
//   const t = translations[language].registration;
//   const isRTL = language === 'ar';

//   const [formData, setFormData] = useState({
//     role: "",
//     contact_phone: "",
//     city: "",
//     pharmacy_name: "",
//     address: "",
//     license_number: "",
//     provider_name: "",
//     warehouse_address: "",
//   })

//   const [files, setFiles] = useState({
//     license_file: null,
//     operation_license: null,
//     registration_doc: null,
//   })

//   const [errors, setErrors] = useState({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [showSuccess, setShowSuccess] = useState(false)

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }))
//     }
//   }

//   const handleFileChange = (name, file) => {
//     setFiles((prev) => ({ ...prev, [name]: file }))
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }))
//     }
//   }

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.role) newErrors.role = t.required
//     if (!formData.contact_phone) newErrors.contact_phone = t.required
//     if (!formData.city) newErrors.city = t.required

//     if (formData.role === "Pharmacy") {
//       if (!formData.pharmacy_name) newErrors.pharmacy_name = t.required
//       if (!formData.address) newErrors.address = t.required
//       if (!formData.license_number) newErrors.license_number = t.required
//       if (!files.license_file) newErrors.license_file = t.required
//       if (!files.operation_license) newErrors.operation_license = t.required
//     } else if (formData.role === "Provider") {
//       if (!formData.provider_name) newErrors.provider_name = t.required
//       if (!formData.warehouse_address) newErrors.warehouse_address = t.required
//       if (!files.registration_doc) newErrors.registration_doc = t.required
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     if (!validateForm()) return

//     setIsSubmitting(true)
//     await new Promise((resolve) => setTimeout(resolve, 2000))
//     setShowSuccess(true)
//     setFormData({
//       role: "",
//       contact_phone: "",
//       city: "",
//       pharmacy_name: "",
//       address: "",
//       license_number: "",
//       provider_name: "",
//       warehouse_address: "",
//     })
//     setFiles({
//       license_file: null,
//       operation_license: null,
//       registration_doc: null,
//     })
//     setIsSubmitting(false)
//     setTimeout(() => setShowSuccess(false), 5000)
//   }

//   return (
//     <section id="contact" className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-reverse' : ''}`}>
//           <div className="space-y-6">
//             <div>
//               <h2 className={`section-title text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
//                 {t.headerTitle}
//               </h2>
//               <p className={`section-subtitle text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
//                 {t.headerSubtitle}
//               </p>
//             </div>

//             <div className="space-y-4">
//               {t.benefits.map((item, index) => (
//                 <div key={index} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
//                   <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
//                     <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
//                   </div>
//                   <span className="feature-text text-gray-700">{item}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gray-50 rounded-2xl p-8">
//             <div className="mb-6">
//               <h3 className={`card-title text-gray-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                 {t.title}
//               </h3>
//               <p className={`card-text text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
//                 {t.subtitle}
//               </p>
//             </div>

//             {showSuccess && (
//               <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
//                 <p className={`text-green-800 feature-title ${isRTL ? 'text-right' : 'text-center'}`}>
//                   {t.successMessage}
//                 </p>
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className={`block footer-title text-gray-700 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
//                   {t.accountType} <span className="text-red-500">*</span>
//                 </label>
//                 <div className="grid grid-cols-2 gap-4">
//                   {[
//                     { key: "Pharmacy", label: t.pharmacy },
//                     { key: "Provider", label: t.provider }
//                   ].map((role) => (
//                     <label
//                       key={role.key}
//                       className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                         formData.role === role.key
//                           ? "border-primary-500 bg-primary-50"
//                           : "border-gray-200 hover:border-gray-300"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="role"
//                         value={role.key}
//                         checked={formData.role === role.key}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                       />
//                       <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
//                         <div
//                           className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
//                             formData.role === role.key ? "border-primary-500" : "border-gray-300"
//                           } ${isRTL ? 'ml-3' : 'mr-3'}`}
//                         >
//                           {formData.role === role.key && <div className="w-3 h-3 rounded-full bg-primary-500"></div>}
//                         </div>
//                         <span className="feature-title text-gray-900">{role.label}</span>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//                 {errors.role && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.role}</p>}
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                     {t.contactPhone} <span className="text-red-500">*</span>
//                   </label>
//                   <Input
//                     name="contact_phone"
//                     value={formData.contact_phone}
//                     onChange={handleInputChange}
//                     placeholder={t.contactPhonePlaceholder}
//                     className={`${errors.contact_phone ? "border-red-300" : ""} ${isRTL ? 'text-right' : 'text-left'}`}
//                   />
//                   {errors.contact_phone && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.contact_phone}</p>}
//                 </div>

//                 <div>
//                   <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                     {t.city} <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
//                       errors.city ? "border-red-300" : "border-gray-300"
//                     } ${isRTL ? 'text-right' : 'text-left'}`}
//                   >
//                     <option value="">{t.selectCity}</option>
//                     {t.cities.map((city, index) => (
//                       <option key={city} value={city}>
//                         {city}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.city && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.city}</p>}
//                 </div>
//               </div>

//               {formData.role === "Pharmacy" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.pharmacyName} <span className="text-red-500">*</span>
//                     </label>
//                     <Input
//                       name="pharmacy_name"
//                       value={formData.pharmacy_name}
//                       onChange={handleInputChange}
//                       className={`${errors.pharmacy_name ? "border-red-300" : ""} ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.pharmacy_name && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.pharmacy_name}</p>}
//                   </div>

//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.address} <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="address"
//                       value={formData.address}
//                       onChange={handleInputChange}
//                       rows={3}
//                       className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
//                         errors.address ? "border-red-300" : "border-gray-300"
//                       } ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.address && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.address}</p>}
//                   </div>

//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.licenseNumber} <span className="text-red-500">*</span>
//                     </label>
//                     <Input
//                       name="license_number"
//                       value={formData.license_number}
//                       onChange={handleInputChange}
//                       className={`${errors.license_number ? "border-red-300" : ""} ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.license_number && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.license_number}</p>}
//                   </div>

//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.licenseFile} <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                       onChange={(e) => handleFileChange("license_file", e.target.files?.[0] || null)}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.license_file && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.license_file}</p>}
//                   </div>

//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.operationLicense} <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                       onChange={(e) => handleFileChange("operation_license", e.target.files?.[0] || null)}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.operation_license && (
//                       <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.operation_license}</p>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {formData.role === "Provider" && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.providerName} <span className="text-red-500">*</span>
//                     </label>
//                     <Input
//                       name="provider_name"
//                       value={formData.provider_name}
//                       onChange={handleInputChange}
//                       className={`${errors.provider_name ? "border-red-300" : ""} ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.provider_name && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.provider_name}</p>}
//                   </div>

//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.warehouseAddress} <span className="text-red-500">*</span>
//                     </label>
//                     <textarea
//                       name="warehouse_address"
//                       value={formData.warehouse_address}
//                       onChange={handleInputChange}
//                       rows={3}
//                       className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
//                         errors.warehouse_address ? "border-red-300" : "border-gray-300"
//                       } ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.warehouse_address && (
//                       <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.warehouse_address}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label className={`block footer-title text-gray-700 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
//                       {t.registrationDoc} <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="file"
//                       accept=".pdf,.jpg,.jpeg,.png"
//                       onChange={(e) => handleFileChange("registration_doc", e.target.files?.[0] || null)}
//                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${isRTL ? 'text-right' : 'text-left'}`}
//                     />
//                     {errors.registration_doc && <p className={`mt-1 card-text text-red-600 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.registration_doc}</p>}
//                   </div>
//                 </div>
//               )}

//               <Button type="submit" size="lg" className="w-full btn-text-lg" disabled={isSubmitting || !formData.role}>
//                 {isSubmitting ? (
//                   <span className="flex items-center justify-center">
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     {t.submitting}
//                   </span>
//                 ) : (
//                   <>
//                     {t.submit}
//                     <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
//                   </>
//                 )}
//               </Button>

//               <p className={`footer-link text-gray-500 ${isRTL ? 'text-right' : 'text-center'}`}>
//                 {t.termsText}{" "}
//                 <a href="#" className="text-primary-600 hover:underline">
//                   {t.termsOfService}
//                 </a>{" "}
//                 {t.and}{" "}
//                 <a href="#" className="text-primary-600 hover:underline">
//                   {t.privacyPolicy}
//                 </a>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   )
// }
'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useLanguage } from '@/context/LanguageContext'
import { translations } from '@/translations/translations'
import { supabase } from '@/utils/supabase/client' // Import Supabase client

export default function RegistrationSection() {
  const { language } = useLanguage()
  const t = translations[language].registration
  const isRTL = language === 'ar'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    contact_phone: '',
    city: '',
    pharmacy_name: '',
    address: '',
    license_number: '',
    provider_name: '',
    warehouse_address: '',
  })

  // const [files, setFiles] = useState({
  //   license_file: null,
  //   operation_license: null,
  //   registration_doc: null,
  // })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log("value ==> ", value);
    console.log("name ==> ", name);
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // const handleFileChange = (name, file) => {
  //   setFiles((prev) => ({ ...prev, [name]: file }))
  //   if (errors[name]) {
  //     setErrors((prev) => ({ ...prev, [name]: '' }))
  //   }
  // }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = t.required
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = t.invalidEmail
    if (!formData.password || formData.password.length < 6)
      newErrors.password = t.passwordLength
    if (!formData.role) newErrors.role = t.required
    if (!formData.contact_phone) newErrors.contact_phone = t.required
    if (!formData.city) newErrors.city = t.required

    if (formData.role === 'Pharmacy') {
      if (!formData.pharmacy_name) newErrors.pharmacy_name = t.required
      if (!formData.address) newErrors.address = t.required
      if (!formData.license_number) newErrors.license_number = t.required
      // if (!files.license_file) newErrors.license_file = t.required
      // if (!files.operation_license) newErrors.operation_license = t.required
    } else if (formData.role === 'Provider') {
      if (!formData.provider_name) newErrors.provider_name = t.required
      if (!formData.warehouse_address) newErrors.warehouse_address = t.required
      // if (!files.registration_doc) newErrors.registration_doc = t.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setMessage('')
    setErrors({})
		setShowSuccess(false)
		console.log(formData);

		try {
			const userData = {
        // user_id: userId,
        role: formData.role,
        contact_phone: formData.contact_phone,
        city: formData.city,
        // ...filePaths, // Include file paths in the profile data
      }

      if (formData.role === 'Pharmacy') {
        userData.pharmacy_name = formData.pharmacy_name
        userData.address = formData.address
        userData.license_number = formData.license_number
      } else if (formData.role === 'Provider') {
        userData.provider_name = formData.provider_name
        userData.warehouse_address = formData.warehouse_address
      }
      // 1. Sign up the user with email and password
      const {
        // data: { user },
        error: authError,
      } = await supabase.auth.signUp({
        email: formData.email,
				password: formData.password,
				options: {
					data: userData,
				},
      })

      if (authError) {
        throw new Error(authError.message)
      }

      // 2. Upload files to Supabase Storage
      // const userId = user.id
      // const uploadPromises = []
      // const filePaths = {}

      // for (const [key, file] of Object.entries(files)) {
      //   if (file) {
      //     const filePath = `${userId}/${key}-${file.name}`
      //     uploadPromises.push(
      //       supabase.storage.from('registration-docs').upload(filePath, file)
      //     )
      //     filePaths[key] = filePath // Store the path for later use
      //   }
      // }

      // const uploadResults = await Promise.all(uploadPromises)
      // const uploadError = uploadResults.find((result) => result.error)
      // if (uploadError) {
      //   throw new Error('File upload failed: ' + uploadError.error.message)
      // }

      // 3. Insert user data into the appropriate database table
      

      setShowSuccess(true)
      setMessage(t.successMessage)
      setFormData({
        email: '',
        password: '',
        role: '',
        contact_phone: '',
        city: '',
        pharmacy_name: '',
        address: '',
        license_number: '',
        provider_name: '',
        warehouse_address: '',
      })
      // setFiles({
      //   license_file: null,
      //   operation_license: null,
      //   registration_doc: null,
      // })
    } catch (err) {
      console.error('Registration failed:', err)
      let friendlyMessage = t.submissionError
      if (err.message.includes('User already registered')) {
        friendlyMessage = t.userExists
      } else if (err.message.includes('license number')) {
        friendlyMessage = t.licenseExists
      } else {
        friendlyMessage = err.message
      }
      setErrors({ form: friendlyMessage })
      setShowSuccess(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="register" className="md:py-20 pb-0  bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center ${
            isRTL ? 'lg:grid-flow-col-reverse' : ''
          }`}
        >
          {/* Left section for marketing text */}
          <div className="space-y-6">
            <div>
              <h2
                className={`section-title text-gray-900 mb-4 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {t.headerTitle}
              </h2>
              <p
                className={`section-subtitle text-gray-600 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {t.headerSubtitle}
              </p>
            </div>
            <div className="space-y-4">
              {t.benefits.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'
                  }`}
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  </div>
                  <span className="feature-text text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right section for the registration form */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="mb-6">
              <h3
                className={`card-title text-gray-900 mb-2 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {t.title}
              </h3>
              <p
                className={`card-text text-gray-600 ${
                  isRTL ? 'text-right' : 'text-left'
                }`}
              >
                {t.subtitle}
              </p>
            </div>
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  showSuccess
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}
              >
                <p
                  className={`text-sm ${
                    showSuccess ? 'text-green-800' : 'text-red-800'
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
            {errors.form && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-center">{errors.form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email and Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block footer-title text-gray-700 mb-2 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t.email} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.emailPlaceholder}
                    className={`${errors.email ? 'border-red-300' : ''} ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />
                  {errors.email && (
                    <p
                      className={`mt-1 card-text text-red-600 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={`block footer-title text-gray-700 mb-2 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t.password} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t.passwordPlaceholder}
                    className={`${errors.password ? 'border-red-300' : ''} ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />
                  {errors.password && (
                    <p
                      className={`mt-1 card-text text-red-600 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Existing form fields */}
              <div>
                <label
                  className={`block footer-title text-gray-700 mb-3 ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {t.accountType} <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'Pharmacy', label: t.pharmacy },
                    { key: 'Provider', label: t.provider },
                  ].map((role) => (
                    <label
                      key={role.key}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.role === role.key
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.key}
                        checked={formData.role === role.key}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`flex items-center ${
                          isRTL ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.role === role.key
                              ? 'border-primary-500'
                              : 'border-gray-300'
                          } ${isRTL ? 'ml-3' : 'mr-3'}`}
                        >
                          {formData.role === role.key && (
                            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
                          )}
                        </div>
                        <span className="feature-title text-gray-900">
                          {role.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.role && (
                  <p
                    className={`mt-1 card-text text-red-600 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {errors.role}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block footer-title text-gray-700 mb-2 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t.contactPhone} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    placeholder={t.contactPhonePlaceholder}
                    className={`${errors.contact_phone ? 'border-red-300' : ''} ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  />
                  {errors.contact_phone && (
                    <p
                      className={`mt-1 card-text text-red-600 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {errors.contact_phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block footer-title text-gray-700 mb-2 ${
                      isRTL ? 'text-right' : 'text-left'
                    }`}
                  >
                    {t.city} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
                      errors.city ? 'border-red-300' : 'border-gray-300'
                    } ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="">{t.selectCity}</option>
                    {t.cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p
                      className={`mt-1 card-text text-red-600 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {errors.city}
                    </p>
                  )}
                </div>
              </div>

              {formData.role === 'Pharmacy' && (
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.pharmacyName} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="pharmacy_name"
                      value={formData.pharmacy_name}
                      onChange={handleInputChange}
                      className={`${errors.pharmacy_name ? 'border-red-300' : ''} ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                    {errors.pharmacy_name && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.pharmacy_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.address} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {errors.address && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.licenseNumber} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="license_number"
                      value={formData.license_number}
                      onChange={handleInputChange}
                      className={`${
                        errors.license_number ? 'border-red-300' : ''
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {errors.license_number && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.license_number}
                      </p>
                    )}
                  </div>
                  {/* <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.licenseFile} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange('license_file', e.target.files?.[0] || null)
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                    {errors.license_file && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.license_file}
                      </p>
                    )}
                  </div> */}
                  {/* <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.operationLicense} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(
                          'operation_license',
                          e.target.files?.[0] || null
                        )
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                    {errors.operation_license && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.operation_license}
                      </p>
                    )}
                  </div> */}
                </div>
              )}

              {formData.role === 'Provider' && (
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.providerName} <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="provider_name"
                      value={formData.provider_name}
                      onChange={handleInputChange}
                      className={`${
                        errors.provider_name ? 'border-red-300' : ''
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {errors.provider_name && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.provider_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.warehouseAddress} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="warehouse_address"
                      value={formData.warehouse_address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
                        errors.warehouse_address ? 'border-red-300' : 'border-gray-300'
                      } ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    {errors.warehouse_address && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.warehouse_address}
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <label
                      className={`block footer-title text-gray-700 mb-2 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {t.registrationDoc} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(
                          'registration_doc',
                          e.target.files?.[0] || null
                        )
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent card-text ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    />
                    {errors.registration_doc && (
                      <p
                        className={`mt-1 card-text text-red-600 ${
                          isRTL ? 'text-right' : 'text-left'
                        }`}
                      >
                        {errors.registration_doc}
                      </p>
                    )}
                  </div> */}
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full btn-text-lg"
                disabled={isSubmitting || !formData.role}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t.submitting}
                  </span>
                ) : (
                  <>
                    {t.submit}
                    <ArrowRight
                      className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`}
                    />
                  </>
                )}
              </Button>
            </form>

            <p
              className={`footer-link text-gray-500 mt-6 ${
                isRTL ? 'text-right' : 'text-center'
              }`}
            >
              {t.termsText}{' '}
              <a href="privacy" className="text-primary-600 hover:underline">
                {t.termsOfService}
              </a>{' '}
              {t.and}{' '}
              <a href="privacy" className="text-primary-600 hover:underline">
                {t.privacyPolicy}
              </a>
						</p>
						{/* now message tell him to log in if he is a user  */}
						<p
  className={`text-md text-gray-600 mt-2 ${
    isRTL ? 'text-right' : 'text-center'
  }`}
>
  {isRTL
    ? 'إذا كان لديك حساب بالفعل، يرجى'
    : 'If you already have an account, please'}{' '}
  <a
    href="/dashboard/signin"
    className={`text-primary-600 hover:underline ${isRTL ? 'mr-1' : 'ml-1'}`}
  >
    {isRTL ? 'تسجيل الدخول' : 'Login'}
  </a>
</p>

          </div>
        </div>
      </div>
    </section>
  )
}