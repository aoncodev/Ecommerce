"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

import { redirect } from "next/navigation";

export default function Cart() {
  const {
    isLoggedIn,
    cart,
    fetchCart,
    increaseCart,
    decreaseCart,
    deleteCart,
  } = useAuth();

  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
    }
  }, [isLoggedIn]);

  const total = cart.reduce((sum, item) => sum + item.total, 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your cart.
          </p>
          <Link href="/login">
            <Button className="bg-primary  text-white">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container min-h-screen mx-auto mt-16 px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center h-64">
            <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500">
              Add some items to your cart and they will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mt-16 min-h-screen mx-auto px-4 py-8">
      <Card>
        <CardContent className="divide-y">
          {cart.map((item) => (
            <div
              key={item.product_id}
              className="flex flex-col sm:flex-row items-start sm:items-center py-4 space-y-2 sm:space-y-0"
            >
              <div className="flex-shrink-0 mr-4">
                <Image
                  src={item.images[0]}
                  alt={item.product_name}
                  width={60}
                  height={60}
                  className="rounded-md"
                />
              </div>
              <div className="flex-grow w-full sm:w-auto">
                <h3 className="font-semibold text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                  {item.product_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {item.product_price.toLocaleString("ko-KR")}₩
                </p>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto sm:ml-auto space-x-2">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => decreaseCart(item.product_id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => increaseCart(item.product_id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => deleteCart(item.product_id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <div className="pt-4">
            <div className="flex justify-between items-center font-semibold text-lg">
              <span>Total</span>
              <span>{total.toLocaleString("ko-KR")}₩</span>
            </div>
            <Separator className="my-4" />
            <Button className="w-full text-white bg-primary hover:bg-green-500">
              <Link href="/checkout" className="block w-full h-full">
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
