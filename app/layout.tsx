"use client";

import type { Metadata } from "next";
import Script from "next/script";
import { parabolica } from "@/lib/fonts";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

// ❌ Metadata cannot be exported from client components
// Remove metadata export from here

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 👇 Disable Nav & Footer for admin routes
  const hideLayout = pathname.startsWith("/admin") ||  pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/exhibition-directory/");

  return (
    <html lang="en" className={parabolica.variable}>
      <body className="min-h-screen flex flex-col font-parabolica">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H4G3ZLKEYD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H4G3ZLKEYD');
          `}
        </Script>
        {!hideLayout && <NavBar />}
        <main className="flex-grow w-full">{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
