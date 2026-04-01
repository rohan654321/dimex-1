"use client";

import Script from "next/script";
import { parabolica } from "@/lib/fonts";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideLayout =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/exhibition-directory/");

  return (
    <html lang="en" className={parabolica.variable}>
      <body className="min-h-screen flex flex-col font-parabolica">
        
        {/* ✅ Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-CGKLPLYCF9"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CGKLPLYCF9');
          `}
        </Script>

        {!hideLayout && <NavBar />}
        <main className="flex-grow w-full">{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}