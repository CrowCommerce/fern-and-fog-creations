import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/cart-context';
import { getCart } from '@/lib/shopify';
import { BuilderInit } from '@/components/builder/BuilderInit';
import { SearchProvider } from '@/components/search/SearchProvider';
import { SearchDialog } from '@/components/search/SearchDialog';
import '@tailwindplus/elements';
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fern & Fog Creations | Handmade Coastal Crafts",
  description: "Sea glass earrings, pressed flower resin, driftwood décor—crafted in small batches on the coast.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartPromise = getCart();

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Fern & Fog Creations",
              "description": "Handmade coastal and woodland crafts including sea glass earrings, pressed flower resin, and driftwood décor",
              "url": typeof window !== 'undefined' ? window.location.origin : '',
              "foundingDate": "2021",
              "sameAs": []
            })
          }}
        />
      </head>
      <body
        className={`${cormorant.variable} ${inter.variable} antialiased`}
      >
        <BuilderInit />
        <CartProvider cartPromise={cartPromise}>
          <SearchProvider>
            <SearchDialog />
            <a href="#main-content" className="skip-to-content">
              Skip to content
            </a>
            <Suspense
              fallback={
                <header className="sticky top-0 z-50 bg-parchment border-b-2 border-fern">
                  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                      <div className="flex-1" />
                      <div className="font-display text-2xl font-semibold text-moss">
                        Fern & Fog Creations
                      </div>
                      <div className="flex-1" />
                    </div>
                  </div>
                </header>
              }
            >
              <Header />
            </Suspense>
            <main id="main-content">
              {children}
            </main>
            <Footer />
          </SearchProvider>
        </CartProvider>
      </body>
    </html>
  );
}
