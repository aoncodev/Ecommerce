import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const shimmer = (w, h) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export default function SaleProductLayout() {
  const [special, setSpecial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBatch, setCurrentBatch] = useState([]);
  const [batchIndex, setBatchIndex] = useState(0);

  useEffect(() => {
    fetch("https://albazaarkorea.com/api/get/special")
      .then((res) => res.json())
      .then((data) => {
        setSpecial(data.data);
        setLoading(false);
        setCurrentBatch(data.data.slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to fetch special products:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (special.length > 0) {
      const interval = setInterval(() => {
        setBatchIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % Math.ceil(special.length / 5);
          const start = nextIndex * 5;
          const end = start + 5;
          setCurrentBatch(special.slice(start, end));
          return nextIndex;
        });
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [special]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-6">
        <div className="grid md:grid-cols-2 gap-1">
          {/* Placeholder for Featured Product */}
          <div className="relative h-[300px] sm:h-[400px] md:h-[500px] shimmer-box shimmer"></div>

          {/* Placeholder for 4 Sale Products */}
          <div className="grid grid-cols-2 gap-1">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="relative h-[200px] sm:h-[250px] shimmer-box shimmer"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!special || special.length === 0) {
    return <></>;
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="grid md:grid-cols-2 gap-1">
        {/* Rotating Featured Product */}
        <Link
          key={currentBatch[0]._id}
          href={{
            pathname: `/product/${currentBatch[0].title_en}`,
            query: { productId: currentBatch[0]._id },
          }}
        >
          <Card className="relative overflow-hidden h-[300px] sm:h-[400px] md:h-[500px] transform transition-all duration-700 ease-in-out">
            <Image
              src={currentBatch[0].images[0]}
              alt={currentBatch[0].title_en}
              layout="fill"
              objectFit="cover"
              className="absolute inset-0"
              priority
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(700, 475)
              )}`}
            />
            <CardContent className="relative z-10 h-full flex flex-col justify-end p-3 sm:p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center gap-1 sm:gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5 sm:mb-1 line-clamp-1">
                  {currentBatch[0].title_en}
                </h3>
                <div className="inline-block bg-red-600 text-white px-1 sm:px-2 py-0.5 text-xs sm:text-sm font-semibold rounded">
                  SALE
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {currentBatch[0].fixed_price.toLocaleString("ko-KR")}₩
                </span>
                <span className="text-sm sm:text-base line-through text-gray-300">
                  {currentBatch[0].price.toLocaleString("ko-KR")}₩
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Grid of 4 Sale Products */}
        <div className="grid grid-cols-2 gap-1">
          {currentBatch.slice(1).map((product) => (
            <Link
              key={product._id}
              href={{
                pathname: `/product/${product.title_en}`,
                query: { productId: product._id },
              }}
            >
              <Card className="relative overflow-hidden h-[200px] sm:h-[250px]">
                <Image
                  src={product.images[0]}
                  alt={product.title_en}
                  layout="fill"
                  objectFit="cover"
                  className="absolute inset-0"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(700, 475)
                  )}`}
                />
                <CardContent className="relative z-10 h-full flex flex-col justify-end p-2 sm:p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 line-clamp-1">
                      {product.title_en}
                    </h3>
                    <span className="inline-block bg-red-600 text-white px-1 sm:px-2 py-0.5 text-xs font-semibold rounded">
                      SALE
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm sm:text-base font-bold text-white">
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
