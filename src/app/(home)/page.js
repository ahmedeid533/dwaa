"use client";
import Layout from '../components/Layout';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import RegistrationForm from '../components/RegistrationForm';
import PrivacyPolicy from '../components/PrivacyPolicy';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <AboutSection />
      <RegistrationForm />
      <PrivacyPolicy />
    </Layout>
  );
}