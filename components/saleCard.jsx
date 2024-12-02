import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function SaleProductLayout() {
  const [special, setSpecial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBatch, setCurrentBatch] = useState([]); // Current batch of 5 products
  const [batchIndex, setBatchIndex] = useState(0); // Current batch index

  // Fetch products on mount
  useEffect(() => {
    fetch("http://15.165.5.173:3000/api/get/special")
      .then((res) => res.json())
      .then((data) => {
        setSpecial(data.data);
        setLoading(false);
        setCurrentBatch(data.data.slice(0, 5)); // Initialize first batch
      })
      .catch((err) => {
        console.error("Failed to fetch special products:", err);
        setLoading(false);
      });
  }, []);

  // Rotate the products every 5 seconds
  useEffect(() => {
    if (special.length > 0) {
      const interval = setInterval(() => {
        setBatchIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % Math.ceil(special.length / 5); // Calculate the next batch index
          const start = nextIndex * 5;
          const end = start + 5;
          setCurrentBatch(special.slice(start, end));
          return nextIndex;
        });
      }, 7000);
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [special]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!special || special.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">
          No special products found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid md:grid-cols-2 gap-1">
        {/* Rotating Featured Product */}
        <Link
          key={currentBatch[0]._id}
          href={{
            pathname: `/product/${currentBatch[0].title_en}`,
            query: { productId: currentBatch[0]._id },
          }}
        >
          <Card
            className="relative overflow-hidden h-[500px] transform transition-all duration-700 ease-in-out"
            style={{
              animation: "fade-slide-in 2s ease-in-out",
            }}
          >
            <Image
              src={currentBatch[0].images[0]}
              alt={currentBatch[0].title_en}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
            />
            <CardContent className="relative z-10 h-full flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent ">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white mb-1">
                  {currentBatch[0].title_en}
                </h3>
                <div className=" inline-block bg-red-600 text-white px-2 py-0.5 text-sm font-semibold rounded">
                  SALE
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-white">
                  {currentBatch[0].fixed_price.toLocaleString("ko-KR")}₩
                </span>
                <span className="text-base line-through text-gray-300">
                  {currentBatch[0].price.toLocaleString("ko-KR")}₩
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Grid of 4 Sale Products */}
        <div className="grid grid-cols-2 gap-0">
          {currentBatch.slice(1).map((product) => (
            <Link
              key={product._id}
              href={{
                pathname: `/product/${product.title_en}`,
                query: { productId: product._id },
              }}
            >
              <Card className="relative overflow-hidden h-[250px]">
                <Image
                  src={product.images[0]}
                  alt={product.title_en}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0"
                />
                <CardContent className="relative z-10 h-full flex flex-col justify-end p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white mb-0.5 line-clamp-1">
                      {product.title_en}
                    </h3>
                    <span className=" inline-block bg-red-600 text-white px-2 py-0.5 text-xs font-semibold rounded">
                      SALE
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-base font-bold text-white">
                      {product.fixed_price.toLocaleString("ko-KR")}₩
                    </span>
                    <span className="text-xs line-through text-gray-300">
                      {product.price.toLocaleString("ko-KR")}₩
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
