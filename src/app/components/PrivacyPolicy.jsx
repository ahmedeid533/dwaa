"use client";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/translations/translations";

const PrivacyPolicy = () => {
  const { language } = useLanguage();
 const t = translations[language]?.privacy || translations['en']?.privacy || {};
  if (!t.title) {
    return <div>Privacy policy content is not available.</div>;
  }
 return (
    <section id="privacy" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t.title}</h2>
          <p className="text-lg text-gray-600">{t.lastUpdated}</p>
        </div>

        {/* Privacy Policy Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              {t.introduction}
            </p>
          </div>

          {/* Data Collection Section */}
          <div className="mb-12">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ms-4 rtl:mr-4 rtl:ml-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t.dataCollectionTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.dataCollectionContent}
                </p>
              </div>
            </div>
          </div>

          {/* Data Usage Section */}
          <div className="mb-12">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="ms-4 rtl:mr-4 rtl:ml-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t.dataUsageTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.dataUsageContent}
                </p>
              </div>
            </div>
          </div>

          {/* Third Party Sharing */}
          <div className="mb-12">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="ms-4 rtl:mr-4 rtl:ml-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t.thirdPartyTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.thirdPartyContent}
                </p>
              </div>
            </div>
          </div>

          {/* User Rights */}
          <div className="mb-12">
            <div className="flex items-start mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div className="ms-4 rtl:mr-4 rtl:ml-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {t.userRightsTitle}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t.userRightsContent}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-teal-50 to-purple-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.contactTitle}
            </h3>
            <p className="text-gray-700 mb-6">{t.contactContent}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:privacy@dawaalink.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 me-2 rtl:ml-2 rtl:mr-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                privacy@dawaalink.com
              </a>
              <a
                href="tel:+201234567890"
                className="inline-flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5 me-2 rtl:ml-2 rtl:mr-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +20 123 456 7890
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
