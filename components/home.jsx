"use client";
import React, { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/productCard";
import { motion } from "framer-motion";
import Link from "next/link";
import SaleProductLayout from "@/components/saleCard";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [popup, setPopup] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // full text from input
  const [backendSearch, setBackendSearch] = useState(""); // text sent to backend

  // Ref to store previous search value
  const prevSearchRef = useRef("");

  // Update backendSearch only when searchQuery is empty OR when it increases in length.
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // When cleared, reset backend search so that default products are fetched.
      setBackendSearch("");
      setPage(1);
    } else if (searchQuery.length > prevSearchRef.current.length) {
      setBackendSearch(searchQuery);
      setPage(1);
    }
    // Always update previous search value
    prevSearchRef.current = searchQuery;
  }, [searchQuery]);

  // Fetch pop-up data
  useEffect(() => {
    const fetchPopup = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://api.albazaarkorea.com/web/popup",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        const today = new Date().toISOString().split("T")[0];
        const hidePopupDate = localStorage.getItem("hidePopupDate");
        if (data.show && hidePopupDate !== today) {
          setPopup(data);
          setShowPopup(true);
        }
      } catch (error) {
        setShowPopup(false);
      }
    };
    fetchPopup();
  }, []);

  const handleClosePopup = () => setShowPopup(false);
  const handleDontShowToday = () => {
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("hidePopupDate", today);
    setShowPopup(false);
  };

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://api.albazaarkorea.com/web/subcategory",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.categories || data);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products using backendSearch (only updated when search text increases)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        const searchParam = backendSearch
          ? `&search=${encodeURIComponent(backendSearch)}`
          : "";
        const response = await fetch(
          `https://api.albazaarkorea.com/web/productPage?page=${page}&limit=20&category=${
            selectedCategory ? selectedCategory : ""
          }&subcategory=${
            selectedSubcategory ? selectedSubcategory : ""
          }${searchParam}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        if (page === 1) {
          setProducts(data.products);
          setLoadingProducts(false);
        } else {
          setProducts((prev) => [...prev, ...data.products]);
        }
        setHasMore(data.pagination.totalProducts > page * 20);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, page, backendSearch]);

  // Local filtering: update filteredProducts based on the full searchQuery
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (p) =>
          (p.title_en && p.title_en.toLowerCase().includes(query)) ||
          (p.title_ru && p.title_ru.toLowerCase().includes(query)) ||
          (p.title_uz && p.title_uz.toLowerCase().includes(query)) ||
          (p.title_ko && p.title_ko.toLowerCase().includes(query)) ||
          (p.brand && p.brand.toLowerCase().includes(query))
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  // Device detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    setSelectedSubcategory(null);
    setLoadingProducts(true);
    setPage(1);
  };

  const handleSubcategoryChange = (newSubcategory) => {
    setSelectedSubcategory(newSubcategory);
    setLoadingProducts(true);
    setPage(1);
  };

  const loadMoreProducts = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 lg:px-12 xl:px-16 py-8">
      {/* Pop-up */}
      {showPopup && popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl">
            <Image
              src={popup.image}
              alt="Notification"
              width={1200}
              height={600}
              className="rounded-lg w-full h-auto"
            />
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleClosePopup}
                className="text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleDontShowToday}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Don't Show Again Today
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <motion.div
        className="flex-col w-full bg-cover mt-8 rounded-xl bg-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SaleProductLayout />
      </motion.div>

      {/* Search Bar */}
      <div className="flex flex-col items-center mb-8 mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Discover Your Next Favorite
        </h2>
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Type keywords, brand, or product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            className="absolute inset-y-0 right-0 flex items-center px-3 bg-green-500 text-white rounded-r-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => {}}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 1 0 4 10.5a6.5 6.5 0 0 0 13 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Category List */}
      <div className="flex flex-col items-center gap-6 mt-12 mb-8">
        {!isMobile && !loadingCategories && (
          <motion.div
            className="flex items-center justify-center mb-2 font-bold text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Categories</h1>
          </motion.div>
        )}
        <div className="flex overflow-x-auto space-x-6 p-2 w-full justify-start md:justify-center">
          {loadingCategories
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="shimmer-box shimmer w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <div className="w-12 h-12 bg-gray-300 shimmer-box shimmer rounded-full"></div>
                  </div>
                </div>
              ))
            : categories.map((category) => (
                <div
                  key={category._id}
                  className="flex flex-col items-center text-center cursor-pointer"
                  onClick={() => handleCategoryChange(category._id)}
                >
                  <div
                    className={`w-16 h-16 bg-background rounded-2xl flex items-center shadow-md justify-center hover:bg-gray-200 ${
                      selectedCategory === category._id
                        ? "bg-gray-200"
                        : "text-gray-800"
                    }`}
                  >
                    <img
                      src={category.image}
                      alt={category.name_en}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* Subcategory List */}
      {selectedCategory && (
        <div className="flex flex-wrap gap-4 mt-6 mb-14 justify-start md:justify-center">
          {loadingCategories
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex bg-gray-100 px-2 py-1 rounded-lg shadow-sm gap-1 items-center shimmer-box shimmer"
                >
                  <div className="w-7 h-7 bg-gray-300 shimmer-box shimmer rounded-full"></div>
                  <div className="w-16 h-5 bg-gray-300 shimmer-box shimmer rounded"></div>
                </div>
              ))
            : categories
                .find((category) => category._id === selectedCategory)
                .categories.map((subcategory) => (
                  <div
                    key={subcategory._id}
                    className={`flex bg-background px-2 py-1 rounded-lg shadow-sm gap-1 items-center text-center cursor-pointer hover:bg-gray-200 ${
                      selectedSubcategory === subcategory._id
                        ? "bg-gray-200"
                        : "text-gray-800"
                    }`}
                    onClick={() => handleSubcategoryChange(subcategory._id)}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center">
                      <img
                        src={subcategory.image}
                        alt={subcategory.name_en}
                        className="w-7 h-7"
                      />
                    </div>
                    <p>{subcategory.name_en}</p>
                  </div>
                ))}
        </div>
      )}

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 gap-y-4 mt-6">
        {loadingProducts
          ? Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-full max-w-sm bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="relative h-56 bg-gray-100 shimmer-box shimmer"></div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center space-x-2">
                    <div className="w-1/2 h-6 bg-gray-300 shimmer-box shimmer rounded"></div>
                  </div>
                  <div className="mt-4 w-3/4 h-5 bg-gray-300 shimmer-box shimmer rounded"></div>
                </div>
                <div className="p-2">
                  <div className="w-full h-10 bg-gray-300 shimmer-box shimmer rounded-lg"></div>
                </div>
              </div>
            ))
          : filteredProducts.map((product) => (
              <Link
                key={product._id}
                href={{
                  pathname: `/product/${product.title_en}`,
                  query: { productId: product._id },
                }}
              >
                <ProductCard product={product} />
              </Link>
            ))}
      </div>

      {filteredProducts.length === 0 && !loadingProducts && (
        <p className="text-center text-gray-500 mt-8">
          No products found. Try adjusting your filters or search query.
        </p>
      )}

      {/* Load More Button */}
      {hasMore && !loadingProducts && (
        <div className="text-center mt-12">
          <Button
            onClick={loadMoreProducts}
            className="bg-transparent border border-green-500 text-black hover:text-white py-3 px-10 rounded-lg hover:bg-green-500"
          >
            Load More
          </Button>
        </div>
      )}

      {/* Floating Scroll to Top Button */}
      {showScrollTop && !isMobile && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-green-500 text-white font-bold p-4 rounded-full shadow-lg hover:bg-green-600"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}
