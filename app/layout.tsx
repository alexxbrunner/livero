import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FacebookPixel from "@/components/FacebookPixel";
import "./globals.css";

export const metadata: Metadata = {
  title: "Livaro - Interior & Furniture Marketplace",
  description: "City-based interior and furniture aggregation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <GoogleAnalytics />
        <FacebookPixel />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
