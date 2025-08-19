"use client";
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

export default function PartnersSection() {
  const { language } = useLanguage();
  const t = translations[language].partners;
  const isRTL = language === 'ar';

  const partners = [
    { name: "elazaby", logo: "/images/elazaby.jpg" },
    { name: "Misr-Pharmacies", logo: "/images/Misr-Pharmacies-Egypt-8170-1578571549-og.webp" },
    { name: "Logo-Care", logo: "/images/Logo-Care.png" },
    { name: "over-sea", logo: "/images/over-sea.png" },
    { name: "eipico", logo: "/images/eipico.png" },
    { name: "eva", logo: "/images/eva.png" }
  ];

  // تكرار للسلايدر المستمر
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 overflow-hidden gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isRTL ? 'text-right' : 'text-left'} md:text-center`}>
          <h2 className="section-title text-gray-900 mb-4">
            {t?.title || 'شركاؤنا'}
          </h2>
          <p className="section-subtitle text-gray-600">
            {t?.subtitle || 'نتشرف بالعمل مع أفضل الشركات'}
          </p>
        </div>

        {/* Slider Container */}
        <div className="partners-slider-container">
          <div className="partners-slider">
            {duplicatedPartners.map((partner, index) => (
              <div key={index} className="partner-item">
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className="partner-logo"
                  onError={(e) => {
                    console.log(`Error loading image: ${partner.logo}`);
                    e.target.src = `https://via.placeholder.com/150x50/10b981/white?text=${partner.name}`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Static Grid للـ fallback */}
        <div className="static-partners-grid">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center p-4">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="partner-logo-static"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}