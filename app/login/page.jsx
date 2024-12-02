"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://15.165.5.173:3000/api/createUser",
        { phone }
      );

      if (response.data) {
        console.log("OTP sent:", response.data);
        setStep("otp");
        setCountdown(120); // 2-minute countdown
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://15.165.5.173:3000/api/verifyUser",
        { phone, otp: otp.join("") }
      );

      if (response.data && response.data.activated) {
        console.log("Login successful:", response.data);
        login(phone); // Update AuthContext with user phone
        router.replace("/"); // Navigate to home
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred during OTP verification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    setOtp(newOtp);
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Login to Your Account
          </CardTitle>
          <CardDescription className="text-center">
            {step === "phone"
              ? "Enter your phone number to receive an OTP"
              : "Enter the 6-digit OTP sent to your phone"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit}>
              <div className="grid gap-4">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <Button
                className="text-black w-full mt-4 border bg-transparent border-green-500 hover:bg-green-500 shadow-sm hover:text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <div className="grid gap-4">
                <Label htmlFor="otp-0">Enter OTP</Label>
                <div className="flex justify-between">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-2xl"
                      required
                    />
                  ))}
                </div>
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              {countdown > 0 && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Please wait for {Math.floor(countdown / 60)}:
                  {(countdown % 60).toString().padStart(2, "0")} before
                  requesting a new OTP
                </p>
              )}
              <Button
                className="text-black w-full mt-4 border bg-transparent border-green-500 hover:bg-green-500 shadow-sm hover:text-white"
                type="submit"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-600 mt-4 w-full">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
