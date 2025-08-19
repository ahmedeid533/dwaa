// "use client";
// import Head from 'next/head';
// import Header from './Header';
// import Footer from './Footer';
// import { useLanguage } from '@/context/LanguageContext';

// const Layout = ({ children }) => {
//   const { language } = useLanguage();
  
//   return (
//     <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
//       <Head>
//         <title>DawaaLink - {language === 'ar' ? 'ربط الصيدليات والموردين' : 'Connecting Pharmacies and Suppliers'}</title>
//       </Head>
//       <Header />
//       <main className="pt-16">
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// };

// export default Layout;
"use client";
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useLanguage } from '@/context/LanguageContext';

const Layout = ({ children }) => {
  const { language } = useLanguage();
  
  return (
    <div className={`min-h-screen bg-gray-50 ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}>
      <Head>
        <title>DawaaLink - {language === 'ar' ? 'ربط الصيدليات والموردين' : 'Connecting Pharmacies and Suppliers'}</title>
      </Head>
      <Header />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;