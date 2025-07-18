'use client'
import { Outfit } from 'next/font/google';
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
		if (typeof window !== 'undefined') {
      console.log("window.location.href ==> ", window.location.href);
      if (!window.location.href.includes('/dashboard')){
        window.location.href = '/dashboard';
      }
    }
  }, []);

  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
