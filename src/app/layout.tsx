'use client'
import { Outfit } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

import './globals.css';

  import { useEffect } from 'react';


import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
		// if (typeof window !== 'undefined') {
    //   console.log("window.location.href ==> ", window.location.href);
    //   if (!window.location.href.includes('/dashboard')){
    //     window.location.href = '/';
    //   }
    // }
  }, []);

  return (
    <html lang="en">
			<body className={`${outfit.className} dark:bg-gray-900`}>
				<LanguageProvider>
				<AuthProvider>
      	  <ThemeProvider>
        	  <SidebarProvider>{children}</SidebarProvider>
					</ThemeProvider>
					</AuthProvider>
				</LanguageProvider>
      </body>
    </html>
  );
}
