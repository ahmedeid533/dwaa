// components/Header.jsx
"use client";
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].header;

  return (
    <header className="fixed top-0 w-full bg-white shadow-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 rtl:flex-row-reverse">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg" 
                  alt="DawaaLink Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl font-bold text-gray-800">{t.logo}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 rtl:gap-8">
            <Link href="#about" className="text-gray-600 hover:text-teal-500 transition-colors">
              {t.about}
            </Link>
            <Link href="#privacy" className="text-gray-600 hover:text-teal-500 transition-colors">
              {t.privacy}
            </Link>
            <Link href="/dashboard/signin" className="text-gray-600 hover:text-teal-500 transition-colors">
              {t.login}
            </Link>
            <Link 
              href="#register" 
              className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              {t.register}
            </Link>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-full hover:border-teal-500 transition-colors"
            >
              <span className="text-sm font-medium">{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="text-sm px-3 py-1 border border-gray-300 rounded-full"
            >
              {language === 'en' ? 'ع' : 'E'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-teal-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="#about" className="block px-3 py-2 text-gray-600 hover:text-teal-500">
                {t.about}
              </Link>
              <Link href="#privacy" className="block px-3 py-2 text-gray-600 hover:text-teal-500">
                {t.privacy}
              </Link>
              <Link href="/login" className="block px-3 py-2 text-gray-600 hover:text-teal-500">
                {t.login}
              </Link>
              <Link 
                href="#register" 
                className="block w-full text-center bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors font-medium mt-4"
              >
                {t.register}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;