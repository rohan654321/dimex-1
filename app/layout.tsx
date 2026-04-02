"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { parabolica } from "@/lib/fonts";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/exhibition-directory/");

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag && !hideLayout) {
      (window as any).gtag('config', 'G-CGKLPLYCF9', {
        page_path: pathname,
      });
      console.log(`📊 Page view tracked: ${pathname}`);
    }
  }, [pathname, hideLayout]);

  return (
    <html lang="en" className={parabolica.variable}>
      <head>
        {/* Google Analytics - First script loads the library */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CGKLPLYCF9"
          strategy="afterInteractive"
        />
        
        {/* Google Analytics - Second script initializes it */}
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-CGKLPLYCF9', {
                send_page_view: true,
                page_title: document.title,
                page_location: window.location.href
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-parabolica">
        {!hideLayout && <NavBar />}
        <main className="flex-grow w-full">{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}