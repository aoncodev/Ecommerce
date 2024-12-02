import localFont from "next/font/local";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { AuthProvider } from "@/context/AuthContext"; // Import AuthProvider

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
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistRoboto.variable} ${geistBebas.variable} antialiased `}
      >
        <AuthProvider>
          {/* Wrap the entire app with AuthProvider */}
          <Navbar />
          {/* Navbar now has access to AuthContext */}
          {children} {/* Render page-specific content */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
