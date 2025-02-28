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
import DaumPostcode from "react-daum-postcode";

export default function LoginPage() {
  const [step, setStep] = useState("phone"); // steps: "phone", "otp", "address"
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // New states for address selection step
  const [receiverName, setReceiverName] = useState("");
  const [address, setAddress] = useState("");
  const [detailedAddress, setDetailedAddress] = useState("");
  const [showPostcode, setShowPostcode] = useState(false);

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
        "https://api.albazaarkorea.com/web/createUser",
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
        "https://api.albazaarkorea.com/web/verifyUser",
        { phone, otp: otp.join("") }
      );

      if (response.data && response.data.activated && response.data.token) {
        console.log("OTP verified successfully:", response.data);
        // Save the JWT token in local storage
        localStorage.setItem("token", response.data.token);
        // Move to the address selection step
        // If the user already has an address (response.data.addr exists), skip address step.
        if (response.data.addr && response.data.addr.trim() !== "") {
          login();
          router.replace("/");
        } else {
          setStep("address");
        }
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
    // Remove any non-digit characters
    const sanitizedValue = value.replace(/\D/g, "");
    if (!sanitizedValue) return; // If no valid number, do nothing

    const newOtp = [...otp];
    newOtp[index] = sanitizedValue;

    // Automatically move focus to the next input if available
    if (sanitizedValue && index < 5) {
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

  // Callback function for DaumPostcode component
  const handleAddressSelect = (data) => {
    console.log("Selected address data:", data);
    // Set the main address field based on the selection (customize as needed)
    setAddress(data.address);
    setShowPostcode(false);
  };

  // Handle final address confirmation
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!receiverName || !address || !detailedAddress) {
      setError("Please enter receiver name, address, and detailed address.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.albazaarkorea.com/web/updateAddress",
        { phone, receiverName, address, detailedAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Address update response:", response.data);

      // Optionally, update the AuthContext or store additional info here.
      login();
      router.replace("/");
    } catch (error) {
      console.error("Error updating address:", error);
      setError("Failed to update address. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {step === "address"
              ? "Confirm Your Address"
              : "Login to Your Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "phone" && "Enter your phone number to receive an OTP"}
            {step === "otp" && "Enter the 6-digit OTP sent to your phone"}
            {step === "address" &&
              "Enter receiver name, select address, and add details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit}>
              <div className="grid gap-4">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="Enter your phone number Ex:01012345678"
                    value={phone}
                    onChange={(e) => {
                      // Remove non-digit characters and limit to 11 digits
                      const onlyNums = e.target.value.replace(/\D/g, "");
                      if (onlyNums.length <= 11) {
                        setPhone(onlyNums);
                      }
                    }}
                    className="pl-10"
                    inputMode="numeric"
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
          )}

          {step === "otp" && (
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

          {step === "address" && (
            <form onSubmit={handleAddressSubmit}>
              <div className="grid gap-4">
                <Label htmlFor="receiverName">Receiver Name</Label>
                <Input
                  id="receiverName"
                  placeholder="Enter receiver name"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                />
                <Label htmlFor="address">Address</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="address"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPostcode(true)}
                  >
                    Search Address
                  </Button>
                </div>
                <Label htmlFor="detailedAddress">Detailed Address</Label>
                <Input
                  id="detailedAddress"
                  placeholder="Enter detailed address (e.g., apartment, floor)"
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              <Button
                className="text-black w-full mt-4 border bg-transparent border-green-500 hover:bg-green-500 shadow-sm hover:text-white"
                type="submit"
                disabled={loading}
              >
                Confirm
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

      {/* Modal for DaumPostcode */}
      {showPostcode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-11/12 max-w-md">
            <DaumPostcode
              onComplete={handleAddressSelect}
              style={{ width: "100%", height: "400px" }}
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="secondary"
                onClick={() => setShowPostcode(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
