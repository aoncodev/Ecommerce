"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  ShoppingCart,
  User,
  Settings,
  LogOut,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);

  const { isLoggedIn, cart, logout } = useAuth(); // Use AuthContext

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Animation Variants for Framer Motion
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      {/* Desktop Navbar */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md"
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center md:justify-between h-16">
            <div className="flex items-center justify-center">
              <Link
                href="/"
                className="text-xl text-green-500"
                style={{
                  fontFamily: "var(--font-geist-bebas)",
                  fontSize: "2.5rem",
                }}
              >
                Albazaar
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  About
                </Link>
                <Link
                  href="/contacts"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/cart"
                className="flex gap-3 px-3 py-2 rounded-md border border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900 transition"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.length >= 0 && (
                    <span className="absolute bottom-2 left-3 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold">Cart</p>
              </Link>

              {isLoggedIn ? (
                <Button
                  onClick={logout}
                  className="text-gray-600 bg-transparent font-semibold hover:bg-red-500 border border-red-500 hover:text-white rounded-md p-2 flex"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link
                  href="/login"
                  className="text-gray-600 bg-transparent font-semibold hover:bg-green-500 border border-green-500 hover:text-white rounded-md p-2 flex"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Bottom Navbar for Mobile */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#F9F9F9] md:hidden flex justify-between items-center px-6 py-2 border-t border-gray-200"
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <Link
          href="/"
          className="flex flex-col items-center text-gray-600 hover:text-green-500"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/cart"
          className="flex flex-col items-center text-gray-600 hover:text-green-500 relative"
        >
          <ShoppingCart className="w-6 h-6" />
          {cart.length > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {cart.length}
            </span>
          )}
          <span className="text-xs">Cart</span>
        </Link>

        <Link
          href="/profile"
          className="flex flex-col items-center text-gray-600 hover:text-green-500"
        >
          <User className="w-6 h-6" />
          <span className="text-xs">Profile</span>
        </Link>
        <Link
          href="/support"
          className="flex flex-col items-center text-gray-600 hover:text-green-500"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs">Others</span>
        </Link>
      </motion.nav>
    </>
  );
}
