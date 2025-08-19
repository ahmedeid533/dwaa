"use client";
import { BarChart3, Globe, Lock, Smartphone, Users, Zap } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

export default function FeaturesSection() {
  const { language } = useLanguage();
  const t = translations[language].features;
  const isRTL = language === 'ar';

  const featureIcons = [BarChart3, Globe, Lock, Smartphone, Users, Zap];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-gray-900 mb-4 text-center">
            {t.title}
          </h2>
          <p className="section-subtitle text-gray-600 max-w-3xl mx-auto text-center">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.items.map((feature, index) => {
            const IconComponent = featureIcons[index];
            return (
              <div key={index} className="group hover:bg-gray-50 rounded-xl p-6 transition-colors">
                <div className={`w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-lg flex items-center justify-center mb-4 transition-colors ${isRTL ? 'mr-auto' : 'ml-auto md:ml-0'}`}>
                  <IconComponent className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className={`feature-title text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {feature.title}
                </h3>
                <p className={`feature-text text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}