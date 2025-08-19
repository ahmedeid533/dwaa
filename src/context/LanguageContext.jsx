// "use client";
// import { createContext, useContext, useState, useEffect } from 'react';

// const LanguageContext = createContext();

// export const useLanguage = () => {
//   const context = useContext(LanguageContext);
//   if (!context) {
//     throw new Error('useLanguage must be used within a LanguageProvider');
//   }
//   return context;
// };

// export const LanguageProvider = ({ children }) => {
//   const [language, setLanguage] = useState('en');

//   useEffect(() => {
//     // Set document direction
//     document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
//     document.documentElement.lang = language;
//   }, [language]);

//   const toggleLanguage = () => {
//     setLanguage(prev => prev === 'en' ? 'ar' : 'en');
//   };

//   return (
//     <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };
"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Set document direction and language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Remove existing styles if they exist
    const existingStyles = document.getElementById('dwaalink-styles');
    if (existingStyles) {
      document.head.removeChild(existingStyles);
    }

    // Add comprehensive styles with unified typography
		if (!window.location.href.includes('/dashboard')) { 
			const styles = document.createElement('style');
    styles.id = 'dwaalink-styles';
    styles.innerHTML = `
      /* ===== TYPOGRAPHY SYSTEM ===== */
      
      /* Import Google Fonts */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
      
      /* Base Typography */
      * {
        font-feature-settings: "kern" 1, "liga" 1;
        text-rendering: optimizeLegibility;
      }
      
      [dir="ltr"] {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      [dir="rtl"] {
        font-family: 'Cairo', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      /* Hero Section Typography */
      .hero-title {
        font-size: clamp(2.5rem, 5vw, 4rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.025em;
      }
      
      .hero-subtitle {
        font-size: clamp(1.125rem, 2.5vw, 1.5rem);
        font-weight: 600;
        line-height: 1.6;
        opacity: 0.8;
      }
      
      /* Section Titles */
      .section-title {
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 700;
        line-height: 1.2;
        letter-spacing: -0.02em;
      }
      
      .section-subtitle {
        font-size: clamp(1rem, 2vw, 1.25rem);
        font-weight: 600;
        line-height: 1.6;
        opacity: 0.75;
      }
      
      /* Card Titles */
      .card-title {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1.3;
        letter-spacing: -0.01em;
      }
      
      .card-subtitle {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.4;
      }
      
      .card-text {
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.6;
      }
      
      /* Feature Typography */
      .feature-title {
        font-size: 1.35rem;
        font-weight: 600;
        line-height: 1.3;
      }
      
      .feature-text {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.5;
      }
      
      /* Navigation Typography */
      .nav-link {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.4;
        letter-spacing: -0.01em;
      }
      
      /* Button Typography */
      .btn-text {
        font-size: 0.875rem;
        font-weight: 600;
        line-height: 1.4;
        letter-spacing: 0.01em;
      }
      
      .btn-text-lg {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.4;
        letter-spacing: 0.01em;
      }
      
      /* Footer Typography */
      .footer-title {
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.4;
      }
      
      .footer-link {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.5;
      }
      
      /* Stats Typography */
      .stat-number {
        font-size: clamp(2rem, 4vw, 3rem);
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.02em;
      }
      
      .stat-label {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.3;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      
      /* Arabic Typography Adjustments */
      [dir="rtl"] .hero-title {
        font-weight: 700;
        letter-spacing: 0;
      }
      
      [dir="rtl"] .section-title {
        font-weight: 600;
        letter-spacing: 0;
      }
      
      [dir="rtl"] .card-title,
      [dir="rtl"] .feature-title {
        font-weight: 600;
        letter-spacing: 0;
      }
      
      [dir="rtl"] .nav-link,
      [dir="rtl"] .btn-text,
      [dir="rtl"] .btn-text-lg {
        letter-spacing: 0;
      }

      /* Brand Colors and Gradients */
      .gradient-text {
        color: #10b981;
        font-weight: bold;
      }
      
      .brand-text {
        color: #10b981;
        font-weight: bold;
      }
      
      .gradient-bg {
        background: linear-gradient(135deg, #f0fdfa, #faf5ff);
      }
      
      /* Primary Color System */
      .text-primary-500 {
        color: #10b981;
      }
      
      .text-primary-600 {
        color: #059669;
      }
      
      .bg-primary-100 {
        background-color: #d1fae5;
      }
      
      .bg-primary-200 {
        background-color: #a7f3d0;
      }
      
      .bg-primary-500 {
        background-color: #10b981;
      }
      
      .bg-primary-600 {
        background-color: #059669;
      }
      
      .border-primary-500 {
        border-color: #10b981;
      }
      
      .hover\\:bg-primary-600:hover {
        background-color: #059669;
      }
      
      .hover\\:bg-primary-200:hover {
        background-color: #a7f3d0;
      }
      
      /* Shadow System */
      .shadow-card {
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      }
      
      .shadow-card-hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      /* Slide Animation */
.animate-slide {
  animation: slide 15s infinite ease-in-out;
}

.animate-slide-rtl {
  animation: slide-rtl 15s infinite ease-in-out;
}

@keyframes slide {
  0% { transform: translateX(0); }
  20% { transform: translateX(-20%); }
  40% { transform: translateX(-40%); }
  60% { transform: translateX(-60%); }
  80% { transform: translateX(-80%); }
  100% { transform: translateX(0); }
}

@keyframes slide-rtl {
  0% { transform: translateX(0); }
  20% { transform: translateX(20%); }
  40% { transform: translateX(40%); }
  60% { transform: translateX(60%); }
  80% { transform: translateX(80%); }
  100% { transform: translateX(0); }
}
      
      /* Fade In Animation */
      .fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Loading Animation */
      .loading {
        position: relative;
        overflow: hidden;
      }
      
      .loading::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      /* RTL Support */
      [dir="rtl"] .space-x-3 > :not([hidden]) ~ :not([hidden]) {
        margin-right: 0.75rem;
        margin-left: 0;
      }
      
      [dir="rtl"] .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
        --tw-space-x-reverse: 1;
        margin-right: calc(0.75rem * var(--tw-space-x-reverse));
        margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));
      }
      
      [dir="rtl"] .lg\\:grid-flow-col-reverse {
        grid-auto-flow: column reverse;
      }
      
      [dir="rtl"] .grid-flow-col-reverse {
        grid-auto-flow: column reverse;
      }
      
      /* Text Alignment */
      [dir="rtl"] .text-right {
        text-align: right;
      }
      
      [dir="rtl"] .text-left {
        text-align: left;
      }
      
      [dir="ltr"] .text-right {
        text-align: right;
      }
      
      [dir="ltr"] .text-left {
        text-align: left;
      }
      
      .text-center {
        text-align: center;
      }
      
      /* Margin and Padding RTL */
      [dir="rtl"] .ml-2 {
        margin-left: 0;
        margin-right: 0.5rem;
      }
      
      [dir="rtl"] .mr-2 {
        margin-right: 0;
        margin-left: 0.5rem;
      }
      
      [dir="rtl"] .ml-4 {
        margin-left: 0;
        margin-right: 1rem;
      }
      
      [dir="rtl"] .mr-4 {
        margin-right: 0;
        margin-left: 1rem;
      }
      
      [dir="rtl"] .ms-2 {
        margin-inline-start: 0.5rem;
      }
      
      [dir="rtl"] .ms-3 {
        margin-inline-start: 0.75rem;
      }
      
      [dir="rtl"] .ms-4 {
        margin-inline-start: 1rem;
      }
      
      [dir="ltr"] .ms-2 {
        margin-left: 0.5rem;
      }
      
      [dir="ltr"] .ms-3 {
        margin-left: 0.75rem;
      }
      
      [dir="ltr"] .ms-4 {
        margin-left: 1rem;
      }
      
      /* Icon Rotation for RTL */
      [dir="rtl"] .rotate-180 {
        transform: rotate(180deg);
      }
      
      /* Flexbox RTL */
      [dir="rtl"] .flex-row-reverse {
        flex-direction: row-reverse;
      }
      
      /* Positioning RTL */
      [dir="rtl"] .-left-4 {
        left: auto;
        right: -1rem;
      }
      
      [dir="rtl"] .-right-4 {
        right: auto;
        left: -1rem;
      }
      
      /* Features Section Specific Styles */
      .group:hover .bg-primary-100 {
        background-color: #a7f3d0;
      }
      
      .group:hover .bg-primary-200 {
        background-color: #86efac;
      }
      
      .group:hover .w-12 {
        transform: scale(1.05);
        transition: transform 0.2s ease-in-out;
      }
      
      /* Grid Hover Effects */
      .hover\\:bg-gray-50:hover {
        background-color: #f9fafb;
      }
      
      /* Button Hover Effects */
      .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 300ms;
      }
      
      .transition-colors {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
      }
      
      .transition-shadow {
        transition-property: box-shadow;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 200ms;
      }
      
      .hover\\:scale-105:hover {
        transform: scale(1.05);
      }
      
      .hover\\:shadow-md:hover {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      .hover\\:shadow-xl:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      
      /* Focus States */
      .focus\\:outline-none:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }
      
      .focus\\:ring-2:focus {
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
      }
      
      /* Remove existing typography classes and use new system */
      .text-sm { display: none; }
      .text-xl { display: none; }
      .text-2xl { display: none; }
      .text-3xl { display: none; }
      .font-semibold { display: none; }
      .font-bold { display: none; }
      
      /* Rest of existing styles... */
      /* Responsive Grid System */
      .grid {
        display: grid;
      }
      
      .gap-8 {
        gap: 2rem;
      }
      
      .gap-12 {
        gap: 3rem;
      }
      
      @media (min-width: 640px) {
        .sm\\:px-6 {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
      }
      
      @media (min-width: 768px) {
        .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        
        .md\\:grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        
        .md\\:p-12 {
          padding: 3rem;
        }
        
        [dir="rtl"] .md\\:ml-0 {
          margin-left: auto;
          margin-right: 0;
        }
        
        [dir="ltr"] .md\\:ml-0 {
          margin-left: 0;
          margin-right: auto;
        }
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        
        .lg\\:grid-cols-3 {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        
        .lg\\:px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }
      }
      
      /* Partners Section Styles */
      .partners-slider-container {
        width: 100%;
        overflow: hidden;
        position: relative;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 1rem;
        padding: 2rem 0;
      }
      
      .partners-slider {
        display: flex;
        width: calc(200% + 4rem);
        animation: slide-partners 30s linear infinite;
      }
      
      .partner-item {
        flex: 0 0 auto;
        width: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 2rem;
      }
      
      .partner-logo {
        height: 3rem;
        width: auto;
        max-width: 150px;
        filter: grayscale(100%) opacity(0.4);
        transition: all 0.3s ease;
      }
      
      .partner-logo:hover {
        filter: grayscale(0%) opacity(1);
        transform: scale(1.1);
      }
      
      @keyframes slide-partners {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }
      
      [dir="rtl"] .partners-slider {
        animation: slide-partners-rtl 30s linear infinite;
      }
      
      @keyframes slide-partners-rtl {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(50%);
        }
      }
      
      /* Utility Classes */
      .max-w-7xl {
        max-width: 80rem;
      }
      
      .max-w-3xl {
        max-width: 48rem;
      }
      
      .max-w-4xl {
        max-width: 56rem;
      }
      
      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }
      
      .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      
      .py-20 {
        padding-top: 5rem;
        padding-bottom: 5rem;
      }
      
      .p-6 {
        padding: 1.5rem;
      }
      
      .p-8 {
        padding: 2rem;
      }
      
      .mb-3 {
        margin-bottom: 0.75rem;
      }
      
      .mb-4 {
        margin-bottom: 1rem;
      }
      
      .mb-6 {
        margin-bottom: 1.5rem;
      }
      
      .mb-16 {
        margin-bottom: 4rem;
      }
      
      .space-y-4 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1rem;
      }
      
      .leading-relaxed {
        line-height: 1.625;
      }
      
      /* Colors */
      .text-gray-600 {
        color: #6b7280;
      }
      
      .text-gray-700 {
        color: #374151;
      }
      
      .text-gray-900 {
        color: #111827;
      }
      
      .text-white {
        color: #ffffff;
      }
      
      .bg-white {
        background-color: #ffffff;
      }
            .bg-gray-50 {
        background-color: #f9fafb;
      }
      
      /* Rounded Corners */
      .rounded-xl {
        border-radius: 0.75rem;
      }
      
      .rounded-2xl {
        border-radius: 1rem;
      }
      
      .rounded-lg {
        border-radius: 0.5rem;
      }
      
      .rounded-full {
        border-radius: 9999px;
      }
      
      /* Flexbox */
      .flex {
        display: flex;
      }
      
      .inline-flex {
        display: inline-flex;
      }
      
      .items-center {
        align-items: center;
      }
      
      .items-start {
        align-items: flex-start;
      }
      
      .justify-center {
        justify-content: center;
      }
      
      .flex-shrink-0 {
        flex-shrink: 0;
      }
      
      /* Width and Height */
      .w-6 {
        width: 1.5rem;
      }
      
      .w-12 {
        width: 3rem;
      }
      
      .w-full {
        width: 100%;
      }
      
      .h-6 {
        height: 1.5rem;
      }
      
      .h-12 {
        height: 3rem;
      }
      
      /* Footer 4 Column Layout */
      footer .gradient-text {
        background: linear-gradient(135deg, #10b981, #059669);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      footer a:hover .w-4,
      footer a:hover .w-5 {
        transform: scale(1.1);
        transition: transform 0.2s ease-in-out;
      }

      footer .hover\\:text-primary-500:hover {
        color: #10b981;
      }

      [dir="rtl"] footer .justify-end {
        justify-content: flex-end;
      }

      [dir="rtl"] footer .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
        margin-right: 1rem;
        margin-left: 0;
      }

      [dir="rtl"] footer .space-x-3 > :not([hidden]) ~ :not([hidden]) {
        margin-right: 0.75rem;
        margin-left: 0;
      }

      [dir="rtl"] footer .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        margin-right: 1rem;
        margin-left: 0;
      }

      [dir="rtl"] footer .space-x-6 > :not([hidden]) ~ :not([hidden]) {
        margin-right: 1.5rem;
        margin-left: 0;
      }

      @media (max-width: 768px) {
        footer .grid {
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        footer .space-y-4 {
          text-align: center;
        }
        
        [dir="rtl"] footer .space-y-4 {
          text-align: center;
        }
      }

      @media (min-width: 768px) and (max-width: 1023px) {
        footer .md\\:grid-cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1024px) {
        footer .lg\\:grid-cols-4 {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      footer .space-y-3 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 0.75rem;
      }

      footer .space-y-4 > :not([hidden]) ~ :not([hidden]) {
        margin-top: 1rem;
      }

      /* Header Styles */
      header .gradient-text {
        background: linear-gradient(135deg, #10b981, #059669);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      header .hover\\:text-primary-600:hover {
        color: #059669;
      }

      [dir="rtl"] header .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
        margin-right: 1rem;
        margin-left: 0;
      }

      [dir="rtl"] header .space-x-4 > :not([hidden]) ~ :not([hidden]) {
        margin-right: 1rem;
        margin-left: 0;
      }

      [dir="rtl"] header .space-x-8 > :not([hidden]) ~ :not([hidden]) {
        margin-right: 2rem;
        margin-left: 0;
      }

      [dir="rtl"] header .flex-row-reverse {
        flex-direction: row-reverse;
      }

      [dir="rtl"] header .ml-2 {
        margin-left: 0;
        margin-right: 0.5rem;
      }

      [dir="rtl"] header .mr-2 {
        margin-right: 0;
        margin-left: 0.5rem;
      }

      header {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }

      header .mobile-menu {
        animation: slideDown 0.3s ease-out;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 768px) {
        [dir="rtl"] header .text-right {
          text-align: right;
        }
        
        [dir="rtl"] header .justify-between {
          justify-content: space-between;
        }
      }

      header a {
        transition: color 0.2s ease-in-out;
      }

      header button {
        transition: all 0.2s ease-in-out;
      }

      @media (min-width: 768px) {
        header .hidden.md\\:flex {
          display: flex;
        }
      }

      @media (max-width: 767px) {
        header .md\\:hidden {
          display: block;
        }
      }

      /* Additional Partners Styles */
      .partner-logo-static {
        height: 3rem;
        width: auto;
        max-width: 150px;
        filter: grayscale(100%) opacity(0.4);
        transition: all 0.3s ease;
      }

      .partner-logo-static:hover {
        filter: grayscale(0%) opacity(1);
        transform: scale(1.1);
      }

      .static-partners-grid {
        display: none;
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem;
        margin-top: 2rem;
      }

      @media (min-width: 768px) {
        .static-partners-grid {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      @media (min-width: 1024px) {
        .static-partners-grid {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      .partners-slider-container:hover .partners-slider {
        animation-play-state: paused;
      }

      .partner-item:hover .partner-logo {
        filter: grayscale(0%) opacity(1) drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        transform: scale(1.15);
      }

      @media (max-width: 768px) {
        .partner-item {
          width: 150px;
          padding: 0 1rem;
        }
        
        .partner-logo,
        .partner-logo-static {
          height: 2.5rem;
          max-width: 120px;
        }
        
        .partners-slider-container {
          padding: 1.5rem 0;
        }
      }

      @media (max-width: 480px) {
        .partner-item {
          width: 120px;
          padding: 0 0.5rem;
        }
        
        .partner-logo,
        .partner-logo-static {
          height: 2rem;
          max-width: 100px;
        }
      }

      .partners-slider-container::before,
      .partners-slider-container::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2rem;
        z-index: 2;
        pointer-events: none;
      }

      .partners-slider-container::before {
        left: 0;
        background: linear-gradient(to right, rgba(240, 253, 250, 1), rgba(240, 253, 250, 0));
      }

      .partners-slider-container::after {
        right: 0;
        background: linear-gradient(to left, rgba(240, 253, 250, 1), rgba(240, 253, 250, 0));
      }

      @media (prefers-color-scheme: dark) {
        .partners-slider-container::before {
          background: linear-gradient(to right, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0));
        }
        
        .partners-slider-container::after {
          background: linear-gradient(to left, rgba(17, 24, 39, 1), rgba(17, 24, 39, 0));
        }
      }

      .partners-slider {
        will-change: transform;
      }

      .partner-logo,
      .partner-logo-static {
        will-change: filter, transform;
      }

      @media (prefers-reduced-motion: reduce) {
        .partners-slider {
          animation: none;
        }
        
        .static-partners-grid {
          display: grid;
        }
        
        .partners-slider-container {
          display: none;
        }
      }

      /* RTL Grid Support */
      [dir="rtl"] .grid {
        text-align: right;
      }
      
      [dir="ltr"] .grid {
        text-align: left;
      }
      
      @media (max-width: 767px) {
        [dir="rtl"] .mr-auto,
        [dir="ltr"] .ml-auto {
          margin-left: auto;
          margin-right: auto;
        }
      }
    `;
    
    document.head.appendChild(styles);
    
    // Add body class for language
    document.body.classList.remove('lang-en', 'lang-ar');
    document.body.classList.add(`lang-${language}`);
		}
    
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const setLanguageWithPersistence = (newLanguage) => {
    setLanguage(newLanguage);
    // Save to localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('dwaalink-language', newLanguage);
    }
  };

  // Initialize language from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('dwaalink-language');
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
        setLanguage(savedLanguage);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: setLanguageWithPersistence, 
      toggleLanguage 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};