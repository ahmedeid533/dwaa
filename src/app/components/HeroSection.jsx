"use client";
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

const HeroSection = () => {
  const { language } = useLanguage();
  const t = translations[language].hero;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-purple-50">
      {/* Decorative circles */}
      <div className="absolute top-0 start-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute bottom-0 end-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {t.subtitle}
          </p>
          <div className="flex justify-center items-center gap-4">
            <a 
              href="#register" 
              className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-all transform hover:scale-105 shadow-lg"
            >
              {language === 'ar' ? 'سجل الآن' : 'Register Now'}
            </a>
            <a 
              href="#about" 
              className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-50 transition-all border-2 border-teal-500"
            >
              {language === 'ar' ? 'اعرف المزيد' : 'Learn More'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;