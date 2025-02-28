"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ChevronRight, Package, User, LogIn } from "lucide-react";
import Link from "next/link";
import DaumPostcode from "react-daum-postcode";

export default function EnhancedProfilePage() {
  const {
    userDetails,
    getUser,
    updateUser,
    orderHistory,
    fetchOrderHistory,
    isLoggedIn,
  } = useAuth();
  const [formDetails, setFormDetails] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        await getUser();
        await fetchOrderHistory();
      }
    };
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userDetails && !formDetails) {
      // If userDetails.addr exists, try to split it into the base address and additional info.
      let baseAddress = "";
      let additionalAddress = "";
      if (userDetails.addr) {
        const parts = userDetails.addr.split(" ");
        baseAddress = parts[0];
        additionalAddress = parts.slice(1).join(" ");
      }
      setFormDetails({
        name: userDetails.name || "",
        phone: userDetails.phone || "",
        address: baseAddress,
        additionalAddress: additionalAddress,
      });
    }
  }, [userDetails, formDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (formDetails) {
      try {
        // Combine the base address and additional address
        const combinedAddress =
          `${formDetails.address} ${formDetails.additionalAddress}`.trim();
        await updateUser({
          phone: formDetails.phone,
          name: formDetails.name,
          addr: combinedAddress,
        });
        alert("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    }
  };

  // Callback when a user selects an address from DaumPostcode
  const handleAddressSelect = (data) => {
    console.log("Selected address:", data.address);
    setFormDetails((prev) => ({ ...prev, address: data.address }));
    setShowAddressModal(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen mt-16 bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Login Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Please log in to view your profile and order history.
            </p>
            <Link href="/login" passHref>
              <Button className="w-full">
                <LogIn className="w-5 h-5 mr-2" />
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen mt-16 bg-white">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="text-lg">
              <User className="w-5 h-5 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-lg">
              <Package className="w-5 h-5 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formDetails.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formDetails.phone}
                        disabled
                        className="bg-gray-100"
                      />
                      <p className="text-sm text-muted-foreground">
                        Phone number cannot be changed
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="address"
                        name="address"
                        value={formDetails.address}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddressModal(true)}
                      >
                        Search Address
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalAddress">Detailed Address</Label>
                    <Input
                      id="additionalAddress"
                      name="additionalAddress"
                      value={formDetails.additionalAddress}
                      onChange={handleInputChange}
                      placeholder="Enter apartment, floor, etc."
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {orderHistory.length > 0 ? (
                  orderHistory.map((order, index) => (
                    <div key={order._id} className="mb-6 last:mb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            Order {order.order_id}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.date}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "success"
                              : order.status === "Canceled"
                              ? "destructive"
                              : order.status === "On Hold"
                              ? "warning"
                              : order.status === "Confirmed"
                              ? "info"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {order.cart.map((item) => (
                          <div
                            key={item.product_id}
                            className="flex justify-between py-2"
                          >
                            <span>
                              {item.product_name} x {item.quantity}
                            </span>
                            <span>
                              {item.quantity} x{" "}
                              {item.product_price.toLocaleString("ko-KR")}₩ ={" "}
                              {item.total.toLocaleString("ko-KR")}₩
                            </span>
                          </div>
                        ))}
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Subtotal</span>
                          <span>
                            {order.cart
                              .reduce((sum, item) => sum + item.total, 0)
                              .toLocaleString("ko-KR")}
                            ₩
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Shipping</span>
                          <span>
                            {(
                              order.total -
                              order.cart.reduce(
                                (sum, item) => sum + item.total,
                                0
                              )
                            ).toLocaleString("ko-KR")}
                            ₩
                          </span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{order.total.toLocaleString("ko-KR")}₩</span>
                        </div>
                      </div>
                      {index < orderHistory.length - 1 && (
                        <Separator className="my-6" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No orders found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Daum Postcode Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-11/12 max-w-md">
            <DaumPostcode
              onComplete={handleAddressSelect}
              autoClose
              style={{ height: "400px", width: "100%" }}
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="secondary"
                onClick={() => setShowAddressModal(false)}
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
