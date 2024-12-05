import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const geistRoboto = localFont({
  src: "./fonts/Roboto-Regular.ttf",
  variable: "--font-geist-roboto",
  weight: "100 900",
});

const geistBebas = localFont({
  src: "./fonts/BebasNeue-Regular.ttf",
  variable: "--font-geist-bebas",
  weight: "100 900",
});

export const metadata = {
  title: "Albazaarkorea | Halal Products & Halal Meat in Korea",
  description:
    "Albazaarkorea is your one-stop shop for premium halal products and halal meat in Korea. Shop online for fresh, high-quality, and 100% halal-certified items delivered to your doorstep.",
  keywords:
    "halal products Korea, halal meat Korea, buy halal food online, halal-certified meat, halal store Korea",
  icons: {
    icon: "/images/favicon.ico",
  },
  openGraph: {
    title: "Albazaarkorea | Halal Products & Halal Meat in Korea",
    description:
      "Discover Albazaarkorea's range of 100% halal-certified products and meats in Korea. High-quality, fresh, and delivered to your doorstep.",
    url: "https://albazaarkorea.com",
    siteName: "Albazaarkorea",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Albazaarkorea Halal Products",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Albazaarkorea | Halal Products & Halal Meat in Korea",
    description:
      "Shop halal-certified products and meat in Korea at Albazaarkorea. Fresh, high-quality, and delivered to your doorstep.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content="Albazaarkorea" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Albazaarkorea",
              url: "https://albazaarkorea.com",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://albazaarkorea.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistRoboto.variable} ${geistBebas.variable} antialiased`}
      >
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
