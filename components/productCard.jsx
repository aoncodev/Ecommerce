"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { ShoppingCart, Check } from "lucide-react"; // Importing the icons
import { useAuth } from "@/context/AuthContext"; // Import AuthContext

export default function ProductCard({
  product, // Pass the full product object
}) {
  const [isAdded, setIsAdded] = useState(false); // State to manage button color
  const { addToCart, isLoggedIn } = useAuth(); // Access AuthContext
  const router = useRouter();

  // Function to handle Add to Cart
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    addToCart(localStorage.getItem("user"), {
      images: product.images,
      product_id: product._id,
      product_name: product.title_en,
      product_price: product.fixed_price,
      weight: product.weight,
      quantity: 1,
      total: 1 * product.fixed_price,
    });

    setIsAdded(true); // Change button to green
    setTimeout(() => setIsAdded(false), 1500); // Reset to original after 1.5 seconds
  };

  return (
    <Card className="w-full h-full max-w-sm bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg flex flex-col">
      <CardHeader className="p-0">
        <div className="relative h-56 bg-gray-100">
          {/* Optimized Product Image */}
          <Image
            src={product.images[0]}
            alt={product.title_en}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {product.sale > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
              {product.sale}%
            </span>
          )}
          <Image
            src="/images/halal.png"
            alt="Halal Certification"
            width={40}
            height={40}
            className="absolute top-2 left-2"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-semibold text-black">
            {Number(product.fixed_price || product.price).toLocaleString(
              "ko-KR"
            )}
            <span className="text-[14px]">₩</span>
          </span>
          {product.sale > 0 && (
            <span className="text-sm line-through text-gray-500">
              {Number(product.price).toLocaleString("ko-KR")}
              <span className="text-[10px]">₩</span>
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-md font-semibold text-gray-800">
          {product.title_en}{" "}
          <span className="text-[12px] font-normal">({product.weight})</span>
        </h3>
      </CardContent>

      {/* Footer with Add to Cart button */}
      <CardFooter className="p-2">
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent default Link behavior
            handleAddToCart(); // Add product to cart
          }}
          className={`w-full py-2 ${
            isAdded
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-transparent border border-green-500 hover:bg-green-500 text-black hover:text-white"
          } text-black rounded-lg flex items-center justify-center transition-colors duration-200`}
        >
          {isAdded ? (
            <Check className="w-5 h-5 mr-2" />
          ) : (
            <ShoppingCart className="w-5 h-5 mr-2" />
          )}
          {isAdded ? (
            <span className="font-semibold">Added</span>
          ) : (
            <span className="font-semibold">Add to Cart</span>
          )}
        </button>
      </CardFooter>
    </Card>
  );
}
