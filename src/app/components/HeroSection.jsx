// "use client";
// import { useLanguage } from '@/context/LanguageContext';
// import { translations } from '@/translations/translations';

// const HeroSection = () => {
//   const { language } = useLanguage();
//   const t = translations[language].hero;

//   return (
//     <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-purple-50">
//       {/* Decorative circles */}
//       <div className="absolute top-0 start-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-100 rounded-full opacity-50 blur-3xl"></div>
//       <div className="absolute bottom-0 end-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
      
//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//         <div className="text-center">
//           <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//             {t.title}
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-600 mb-8">
//             {t.subtitle}
//           </p>
//           <div className="flex justify-center items-center gap-4">
//             <a 
//               href="#register" 
//               className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-full hover:bg-teal-600 transition-all transform hover:scale-105 shadow-lg"
//             >
//               {language === 'ar' ? 'سجل الآن' : 'Register Now'}
//             </a>
//             <a 
//               href="#about" 
//               className="px-8 py-3 bg-white text-teal-600 font-semibold rounded-full hover:bg-gray-50 transition-all border-2 border-teal-500"
//             >
//               {language === 'ar' ? 'اعرف المزيد' : 'Learn More'}
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;
"use client";
import { ArrowRight, Play } from "lucide-react"
import { Button } from "../components/ui/button"
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

export default function HeroSection() {
  const { language } = useLanguage();
  const t = translations[language].hero;
  const isRTL = language === 'ar';

  return (
    <section id="home" className="pt-2 gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-reverse' : ''}`}>
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className={`hero-title text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.title} <span className="text-[#009689]">{t.brandName}</span>
              </h1>
              <p className={`hero-subtitle text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              {t.features.map((feature, index) => (
                <div key={index} className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                  <span className="feature-text text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
							<Button onClick={() => {
								window.location.href = "#register"
							} } size="lg" className="btn-text-lg">
                {t.cta.primary}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
              <Button size="lg" variant="outline" className="btn-text-lg">
                <Play className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t.cta.secondary}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <img 
                src="/images/Mobile_app_store_badge.svg" 
                alt={t.downloadText.appStore} 
                className="h-12 w-auto" 
              />
              <img 
                src="/images/Mobile_google_play_store_badge.svg" 
                alt={t.downloadText.googlePlay} 
                className="h-12 w-auto" 
              />
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-60 h-120 bg-gray-900 rounded-3xl p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
               <div className="relative w-full h-full" key={language}> 
									<div className={`flex w-[500%] h-full ${isRTL ? 'animate-slide-rtl' : 'animate-slide'}`}>
										{/* <img
                      src="/images/herosection.jpg"
                      alt="Business Dashboard"
                      className="w-1/5 h-full object-cover"
                    /> */}
                    <img
                      src="/images/onboarding-1.png"
                      alt="Analytics View"
                      className="w-1/5 h-full object-cover"
                    />
                    <img
                      src="/images/onboarding-2.png"
                      alt="Team Collaboration"
                      className="w-1/5 h-full object-cover"
                    />
                    <img
                      src="/images/onboarding-3.png"
                      alt="Customer Management"
                      className="w-1/5 h-full object-cover"
										/>
										<img
                      src="/images/onboarding-1.png"
                      alt="Analytics View"
											className="w-1/5 h-full object-cover"
										/>
										<img
                      src="/images/onboarding-2.png"
                      alt="Team Collaboration"
                      className="w-1/5 h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full"></div>
            </div>

            <div className={`absolute -top-4 w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center shadow-lg ${isRTL ? '-right-4' : '-left-4'}`}>
              <div className="w-8 h-8 bg-primary-500 rounded-full"></div>
            </div>
            <div className={`absolute -bottom-4 w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center shadow-lg ${isRTL ? '-left-4' : '-right-4'}`}>
              <div className="w-10 h-10 bg-primary-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}