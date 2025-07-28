"use client";
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

const AboutSection = () => {
  const { language } = useLanguage();
  const t = translations[language].about;

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              {t.description1}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t.description2}
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8 mt-20">
          {/* Pharmacy Benefits */}
          <div className="bg-gradient-to-br from-teal-50 to-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ms-4 rtl:mr-4 rtl:ml-0">
                {t.pharmacyTitle}
              </h3>
            </div>
            <ul className="space-y-4">
              {t.pharmacyBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ms-3 rtl:mr-3 rtl:ml-0 text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Supplier Benefits */}
          <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ms-4 rtl:mr-4 rtl:ml-0">
                {t.supplierTitle}
              </h3>
            </div>
            <ul className="space-y-4">
              {t.supplierBenefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ms-3 rtl:mr-3 rtl:ml-0 text-gray-700 leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a 
            href="#register" 
            className="inline-flex items-center px-8 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl"
          >
            {language === 'ar' ? 'ابدأ الآن' : 'Get Started Now'}
            <svg className="w-5 h-5 ms-2 rtl:mr-2 rtl:ml-0 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;