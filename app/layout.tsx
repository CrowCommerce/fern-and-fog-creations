import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/components/cart/cart-context';
import { getCart } from '@/lib/shopify';
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
        <CartProvider cartPromise={cartPromise}>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <Header />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
