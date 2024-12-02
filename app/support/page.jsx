"use client";

import Link from "next/link";
import { Info, Phone, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Adjust the import path as needed

const SupportItem = ({ href, icon: Icon, text, description, onClick }) => {
  const content = (
    <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Icon className="w-8 h-8 text-green-500 mr-4" />
          <h2 className="text-xl font-semibold text-gray-800">{text}</h2>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-green-50 px-6 py-4">
        <span className="text-green-600 font-medium">
          {onClick ? "Click here" : "Learn more"}
        </span>
      </div>
    </div>
  );

  return onClick ? (
    <button onClick={onClick} className="w-full text-left">
      {content}
    </button>
  ) : (
    <Link href={href} className="block">
      {content}
    </Link>
  );
};

export default function SupportPage() {
  const { isLoggedIn, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // You might want to add a redirect here, e.g.:
      // router.push('/');
    } catch (error) {
      console.error("Logout failed", error);
      // Handle logout error (e.g., show a notification to the user)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 px-4 pb-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Support
      </h1>
      <nav className="max-w-md mx-auto space-y-6">
        <SupportItem
          href="/about"
          icon={Info}
          text="About Us"
          description="Learn more about our company, mission, and values."
        />
        <SupportItem
          href="/contacts"
          icon={Phone}
          text="Contact Us"
          description="Get in touch with our support team for assistance."
        />
        {isLoggedIn ? (
          <SupportItem
            icon={LogOut}
            text="Logout"
            description="Sign out of your account."
            onClick={handleLogout}
          />
        ) : (
          <SupportItem
            href="/login"
            icon={LogIn}
            text="Login"
            description="Access your account to manage your orders and preferences."
          />
        )}
      </nav>
    </div>
  );
}
