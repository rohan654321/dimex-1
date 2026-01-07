import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({ 
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TransRussia & SkladTech 2026",
  description: "Eurasia's leading logistics exhibition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}