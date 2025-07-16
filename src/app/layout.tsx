'use client'
import { Outfit } from 'next/font/google';
import './globals.css';

import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { use, useEffect } from 'react';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigate = useRouter();
  const pathname = usePathname();
	const isAuth = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
	useEffect(() => {
		console.log("pathname ==> ", pathname);
	console.log("isAuth ==> ", isAuth);
		if (pathname == '/' || !isAuth) {
			navigate.push('/dashboard/signin');
			console.log("redirecting to signin page");
		} else if (!pathname.includes('/dashboard') && isAuth) {
			let copypath = pathname
			copypath = copypath.at(0) == '/' ? copypath.slice(1) : copypath;
			copypath = '/dashboard/'.concat(copypath);
			navigate.push(copypath);
		}
	}, [pathname, navigate]);
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
