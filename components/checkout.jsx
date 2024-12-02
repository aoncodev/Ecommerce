"use client";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";
import { LoadingSpinner } from "./loadingSpinner";

export default function CheckoutPage() {
  const { userDetails, getUser, cart, updateUser, fetchCart } = useAuth();
  const [isOrdered, setIsOrdered] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [clickedOrder, setClickedOrder] = useState(false);
  const [formData, setFormData] = useState({
    receiverName: "",
    receiverPhone: "",
    fullAddress: "",
    orderNotes: "",
    saveInfo: false,
  });
  const [deliveryOption, setDeliveryOption] = useState("normal");

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const phone = localStorage.getItem("user");
      if (phone) {
        await getUser(phone);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchUserCart = async () => {
      const phone = localStorage.getItem("user");
      if (phone) {
        await fetchCart(phone);
      }
    };
    fetchUserCart();
  }, []);

  useEffect(() => {
    const { receiverName, receiverPhone, fullAddress } = formData;
    setIsFormValid(
      receiverName !== "" && receiverPhone !== "" && fullAddress !== ""
    );
  }, [formData]);

  useEffect(() => {
    if (userDetails) {
      setFormData((prev) => ({
        ...prev,
        receiverName: userDetails.name || "",
        receiverPhone: userDetails.phone || "",
        fullAddress: userDetails.addr || "",
      }));
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const checkOut = async () => {
    try {
      const d = new Date().toLocaleString();
      const orderTotal = parseInt(total >= 100000 ? total : total + shipping);

      // Ensure the data passed is serializable
      const order_body = {
        user_id: userDetails.phone, // Ensure `userDetails.phone` is a string
        date: d,
        address_id: "Webid",
        receiver_name: formData.receiverName, // Avoid direct reference to inputs
        receiver_phone: formData.receiverPhone,
        status: "On Hold",
        payment_type: "Direct Bank Transfer",
        shippingReq: formData.orderNotes, // Ensure this is a string
        total: orderTotal,
        cart: cart.map((item) => ({ ...item })), // Ensure `cart` contains plain objects
        address_data: {
          name: formData.receiverName,
          phone: userDetails.phone,
          address: formData.fullAddress,
          type: "text",
          address_id: "webid",
        },
      };

      // Debugging to verify structure
      console.log("Order Body:", order_body);

      // Make the order
      const orderResponse = await axios.post(
        "https://albazaarkorea.com/api/makeOrder",
        order_body
      );

      console.log("Order placed successfully:", orderResponse.data);

      // Send confirmation message
      const messageResponse = await axios.post(
        "https://albazaarkorea.com/api/sendMessage",
        {
          phone: userDetails.phone,
          total: orderTotal,
        }
      );

      console.log("Message sent successfully:", messageResponse.data);

      // Save user info if the checkbox is checked
      if (formData.saveInfo) {
        await updateUser({
          phone: formData.receiverPhone, // Ensure consistency with backend
          name: formData.receiverName,
          addr: formData.fullAddress,
        });
        console.log("User info updated successfully.");
      }

      await fetchCart(userDetails.phone);

      // Mark order as placed
      setIsOrdered(true);
    } catch (error) {
      setClickedOrder(false);
      console.error("Error during checkout:", error); // Check for circular references
      alert("Failed to complete the checkout. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    setClickedOrder(true);
    e.preventDefault();
    if (isFormValid) {
      console.log("Order placed:", { ...formData, deliveryOption });
      checkOut();
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const subtotal = cart ? cart.reduce((sum, item) => sum + item.total, 0) : 0;
  const shipping = deliveryOption === "island" ? 5000 : 3500;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mt-16 font-bold mb-8 text-center">Checkout</h1>
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50 flex items-center"
          >
            <AlertCircle className="mr-2" />
            Please fill in all required fields
            <button onClick={() => setShowWarning(false)} className="ml-2">
              <X size={18} />
            </button>
          </motion.div>
        )}
        {!isOrdered ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="receiverName">Receiver Name *</Label>
                      <Input
                        id="receiverName"
                        name="receiverName"
                        value={formData.receiverName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="receiverPhone">Receiver Phone *</Label>
                      <Input
                        id="receiverPhone"
                        name="receiverPhone"
                        value={formData.receiverPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullAddress">Full Address *</Label>
                      <Textarea
                        id="fullAddress"
                        name="fullAddress"
                        value={formData.fullAddress}
                        onChange={handleInputChange}
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Please input your address in Korean (Hangul) so we can
                        locate you easily. And do not forget to include your
                        room number too. Thank you! :)
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orderNotes">Order Notes</Label>
                      <Textarea
                        id="orderNotes"
                        name="orderNotes"
                        value={formData.orderNotes}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saveInfo"
                        name="saveInfo"
                        checked={formData.saveInfo}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            saveInfo: checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="saveInfo"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Save my personal information
                      </label>
                    </div>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h3 className="font-semibold">Direct Bank Transfer</h3>
                  <p>
                    Please make your payment directly into our bank account.
                    Please use your Order Number as the payment reference. Your
                    order will not be shipped until the funds have been cleared
                    in our account. Thank you!
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded p-4">
                    <h4 className="font-semibold mb-2">HANA BANK (하나은행)</h4>
                    <p className="text-lg">288-910613-09107</p>
                  </div>
                  <div className="flex items-start space-x-2 text-amber-600">
                    <AlertCircle className="w-5 h-5 mt-0.5" />
                    <p className="text-sm">
                      Orders paid by 2pm will be shipped out the same day.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart &&
                  cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item.product_name} x {item.quantity}
                      </span>
                      <span>{item.total.toLocaleString("ko-KR")}₩</span>
                    </div>
                  ))}
                <Separator />
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span>{subtotal.toLocaleString("ko-KR")}₩</span>
                </div>
                <div className="space-y-2">
                  <Label>Delivery Options</Label>
                  <RadioGroup
                    value={deliveryOption}
                    onValueChange={setDeliveryOption}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal Delivery (3,000₩)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="island" id="island" />
                      <Label htmlFor="island">Island Delivery (5,000₩)</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex justify-between items-center">
                  <span>Shipping</span>
                  <span>{shipping.toLocaleString("ko-KR")}₩</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>{total.toLocaleString("ko-KR")}₩</span>
                </div>
              </CardContent>
              <CardFooter>
                <AnimatePresence mode="wait">
                  {!clickedOrder ? (
                    <motion.div
                      key="placeOrder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                        onClick={handleSubmit}
                      >
                        Place Order
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <Button
                        className="w-full bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded cursor-not-allowed flex items-center justify-center"
                        disabled
                      >
                        <LoadingSpinner />
                        <span className="ml-2">Processing</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex mt-16 flex-col items-center justify-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
            <p className="text-center text-gray-600">
              Thank you for your order. We'll send you a confirmation email
              shortly.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Back to Shop
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
