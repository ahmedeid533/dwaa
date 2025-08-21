// "use client";
// import Link from 'next/link';
// import { useLanguage } from '@/context/LanguageContext';

// const Footer = () => {
//   const { language } = useLanguage();
//   const currentYear = new Date().getFullYear();

//   const footerContent = {
//     en: {
//       quickLinks: "Quick Links",
//       about: "About the App",
//       privacy: "Privacy Policy",
//       support: "Technical Support",
//       copyright: `© ${currentYear} DawaaLink. All rights reserved.`,
//       madeWith: "Made with",
//       by: "by DawaaLink Team"
//     },
//     ar: {
//       quickLinks: "روابط سريعة",
//       about: "عن التطبيق",
//       privacy: "سياسة الخصوصية",
//       support: "الدعم الفني",
//       copyright: `© ${currentYear} دواء لينك. جميع الحقوق محفوظة.`,
//       madeWith: "صنع بـ",
//       by: "بواسطة فريق دواء لينك"
//     }
//   };

//   const t = footerContent[language];

//   return (
//     <footer className="bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {/* Logo and Description */}
//           <div>
//             <div className="flex items-center mb-4">
//               <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center">
//                 <span className="text-white font-bold text-xl">{language === 'ar' ? 'د' : 'D'}</span>
//               </div>
//               <span className="text-xl font-bold ms-2">{language === 'ar' ? 'دواء لينك' : 'DawaaLink'}</span>
//             </div>
//             <p className="text-gray-400 leading-relaxed">
//               {language === 'ar' 
//                 ? 'منصة رقمية تربط بين الصيدليات ومخازن الأدوية بشكل ذكي وآمن'
//                 : 'A digital platform that intelligently and securely connects pharmacies with medical warehouses'
//               }
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">{t.quickLinks}</h3>
//             <ul className="space-y-2">
//               <li>
//                 <Link href="#about" className="text-gray-400 hover:text-teal-400 transition-colors">
//                   {t.about}
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#privacy" className="text-gray-400 hover:text-teal-400 transition-colors">
//                   {t.privacy}
//                 </Link>
//               </li>
//               <li>
//                 <Link href="#register" className="text-gray-400 hover:text-teal-400 transition-colors">
//                   {language === 'ar' ? 'التسجيل' : 'Register'}
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Support */}
//           <div>
//             <h3 className="text-lg font-semibold mb-4">{t.support}</h3>
//             <div className="space-y-3">
//               <a 
//                 href="mailto:support@dawaalink.com" 
//                 className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
//               >
//                 <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 support@dawaalink.com
//               </a>
//               <a 
//                 href="tel:+201234567890" 
//                 className="flex items-center text-gray-400 hover:text-teal-400 transition-colors"
//               >
//                 <svg className="w-5 h-5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                 </svg>
//                 +20 123 456 7890
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-8 pt-8 border-t border-gray-800">
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <p className="text-gray-400 text-sm">{t.copyright}</p>
//             <p className="text-gray-400 text-sm mt-4 md:mt-0">
//               {t.madeWith} <span className="text-red-500">❤</span> {t.by}
//             </p>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
"use client";
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const isRTL = language === 'ar';

  const socialIcons = [
    { icon: Facebook, name: t.social.facebook, href: "#" },
    { icon: Twitter, name: t.social.twitter, href: "#" },
    { icon: Linkedin, name: t.social.linkedin, href: "#" },
    { icon: Instagram, name: t.social.instagram, href: "#" }
  ];

  const contactInfo = [
    { icon: Mail, text: t.contact.email, href: `mailto:${t.contact.email}` },
    { icon: Phone, text: t.contact.phone, href: `tel:${t.contact.phone}` },
    { icon: MapPin, text: t.contact.location, href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Company Info */}
          <div className="space-y-4">
            <h3 className={`card-title gradient-text ${isRTL ? 'text-right' : 'text-left'}`}>
              DwaaLink
            </h3>
            <p className={`text-gray-300 card-text ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.description}
            </p>
            <div className={`flex ${isRTL ? 'justify-end space-x-reverse space-x-4' : 'justify-start space-x-4'}`}>
              {socialIcons.map(({ icon: Icon, name, href }, index) => (
                <a 
                  key={index} 
                  href={href} 
                  className="text-gray-400 hover:text-primary-500 transition-colors"
                  aria-label={name}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className={`footer-title text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.quickLinks.title}
            </h4>
            <div className="space-y-3">
              {t.quickLinks.items.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`block text-gray-300 hover:text-primary-500 transition-colors footer-link ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-4">
            <h4 className={`footer-title text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.services.title}
            </h4>
            <div className="space-y-3">
              {t.services.items.map((service, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className={`block text-gray-300 hover:text-primary-500 transition-colors footer-link ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {service}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h4 className={`footer-title text-white ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.contact.title}
            </h4>
            <div className="space-y-3">
              {contactInfo.map(({ icon: Icon, text, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className={`flex items-center transition-colors hover:text-primary-500 footer-link ${
                    isRTL ? 'space-x-reverse space-x-3 justify-end' : 'space-x-3'
                  }`}
                >
                  <Icon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  <span className="text-gray-300">{text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className={`flex flex-col md:flex-row justify-between items-center ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            <p className={`text-gray-400 footer-link ${isRTL ? 'text-right' : 'text-left'}`}>
              {t.legal.copyright}
            </p>
            <div className={`flex mt-4 md:mt-0 ${isRTL ? 'space-x-reverse space-x-6' : 'space-x-6'}`}>
              <a 
                href="privacy" 
                className="text-gray-400 hover:text-primary-500 footer-link transition-colors"
              >
                {t.legal.privacyPolicy}
              </a>
              <a 
                href="privacy" 
                className="text-gray-400 hover:text-primary-500 footer-link transition-colors"
              >
                {t.legal.termsOfService}
              </a>
              <a 
                href="privacy" 
                className="text-gray-400 hover:text-primary-500 footer-link transition-colors"
              >
                {t.legal.cookiePolicy}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}