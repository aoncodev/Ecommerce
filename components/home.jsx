"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/productCard";
import { motion } from "framer-motion";
import Link from "next/link";
import SaleProductLayout from "@/components/saleCard";
import Image from "next/image";

export default function ProductPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false); // State for showing the button
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [popup, setPopup] = useState(null); // State for pop-up data
  const [showPopup, setShowPopup] = useState(false); // Control pop-up visibility

  // Fetch pop-up data
  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const response = await fetch("https://albazaarkorea.com/api/popup");
        const data = await response.json();

        // Check localStorage to determine whether to show the pop-up
        const today = new Date().toISOString().split("T")[0]; // Get today's date
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

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDontShowToday = () => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date
    localStorage.setItem("hidePopupDate", today); // Store the "Don't Show Again Today" preference
    setShowPopup(false);
  };

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api`);
        const data = await response.json();
        setCategories(data.categories);
        setLoadingCategories(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products whenever page, category, or subcategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `/api/products?page=${page}&limit=20&category=${
            selectedCategory != null ? selectedCategory : ""
          }&subcategory=${
            selectedSubcategory != null ? selectedSubcategory : ""
          }`
        );
        const data = await response.json();

        if (page === 1) {
          setProducts(data.products.products); // Replace products when the page is reset
          setLoadingProducts(false);
        } else {
          setProducts((prevProducts) => [
            ...prevProducts,
            ...data.products.products,
          ]);
        }

        if (data.products.products.length < 20) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedSubcategory, page]);

  // Detect device type
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Show "Scroll to Top" button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 lg:px-12 xl:px-16 py-8">
      {/* Pop-up */}
      {showPopup && popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-4xl">
            {/* Larger Image */}
            <Image
              src={popup.image}
              alt="Notification"
              width={1200}
              height={600}
              className="rounded-lg w-full h-auto"
            />
            {/* Buttons */}
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

      {/* Category List */}
      <div className="flex-col md:flex-row gap-6 mt-12 mb-10">
        {!isMobile && !loadingCategories && (
          <motion.div
            className="flex items-center justify-center mb-6 font-bold text-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Categories</h1>
          </motion.div>
        )}

        <div className="flex overflow-x-auto space-x-6 p-2">
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
                  className={`flex flex-col items-center text-center cursor-pointer`}
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
        <div className="flex flex-wrap gap-4 mt-6 mb-8">
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
                {/* Image Placeholder */}
                <div className="relative h-56 bg-gray-100 shimmer-box shimmer"></div>

                {/* Content Placeholder */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex items-center space-x-2">
                    <div className="w-1/2 h-6 bg-gray-300 shimmer-box shimmer rounded"></div>
                  </div>
                  <div className="mt-4 w-3/4 h-5 bg-gray-300 shimmer-box shimmer rounded"></div>
                </div>

                {/* Footer Placeholder */}
                <div className="p-2">
                  <div className="w-full h-10 bg-gray-300 shimmer-box shimmer rounded-lg"></div>
                </div>
              </div>
            ))
          : products.map((product) => (
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

      {products.length === 0 && !loadingProducts && (
        <p className="text-center text-gray-500 mt-8">
          No products found. Try adjusting your filters or search query.
        </p>
      )}

      {/* Load More Button */}
      {hasMore && !loadingProducts && (
        <div className="text-center mt-12">
          <button
            onClick={loadMoreProducts}
            className="bg-transparent border border-green-500 text-black hover:text-white py-3 px-10 rounded-lg hover:bg-green-500"
          >
            Load More
          </button>
        </div>
      )}

      {/* Floating Button */}
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
