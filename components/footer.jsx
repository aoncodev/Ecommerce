"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter signup logic here
    console.log("Newsletter signup submitted");
  };

  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Albazaar</h2>
            <p className="text-sm text-gray-600">
              Your one-stop shop for all your needs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/albazaarkorea/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/albazaarkorea/?hl=ko"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link
                  href="/about"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contacts"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Newsletter
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="mt-4 flex flex-col sm:flex-row"
            >
              <Input
                type="email"
                required
                placeholder="Enter your email"
                className="mr-2 mb-2 sm:mb-0"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-base text-gray-400">
            &copy; 2024 Albazaar. All rights reserved.
          </p>
          {/* <div className="mt-4 sm:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-900 mr-4"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Terms of Service
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
