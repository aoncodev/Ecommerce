"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeliveryInfo from "@/components/deliveryInfo";
import { useAuth } from "@/context/AuthContext";

export default function ProductDetail({ product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { isLoggedIn, addToCart } = useAuth(); // Access addToCart and isLoggedIn from AuthContext

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      return;
    }

    addToCart(localStorage.getItem("user"), {
      images: product.images,
      product_id: product._id,
      product_name: product.title_en,
      product_price: product.fixed_price,
      weight: product.weight,
      quantity: quantity,
      total: quantity * product.fixed_price,
    });

    setIsAdded(true); // Change button to green
    setTimeout(() => setIsAdded(false), 1500); // Reset to original after 1.5 seconds
  };

  return (
    <div className="container max-w-6xl mx-auto mt-20 px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="aspect-square relative">
            <Image
              src={product.images[currentImage]}
              alt={product.title_en}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="flex justify-center mt-4 space-x-2">
            {product.images.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentImage ? "bg-primary" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title_en}</h1>
          <p
            className="text-2xl font-semibold mb-4"
            style={{ fontFamily: "var(--font-geist-roboto)" }}
          >
            {product.fixed_price.toLocaleString()}
            <span className="text-sm">₩</span>
          </p>
          <p className="mb-6">
            {product.brand} {product.title_en} - {product.weight} {product.unit}
          </p>

          <div className="flex items-center mb-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-4 text-xl">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setQuantity(Math.min(product.quantity, quantity + 1))
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className={`w-full mb-6 ${
              isAdded
                ? "bg-primary hover:bg-primary text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4 text-white" />{" "}
            {isAdded ? "Added" : "Add to Cart"}
          </Button>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="font-medium">Brand</dt>
                      <dd>{product.brand}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Weight</dt>
                      <dd>{product.weight}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Unit</dt>
                      <dd>{product.unit}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Category</dt>
                      <dd>{product.category_en}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Origin</dt>
                      <dd>{product.origin}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex mt-10">
        <DeliveryInfo />
      </div>
    </div>
  );
}
