"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/productCard";
import { motion } from "framer-motion";
import Link from "next/link";
import SaleProductLayout from "@/components/saleCard";

export default function ProductPage() {
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false); // State for showing the button

  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api`);
        const data = await response.json();
        setCategories(data.categories);
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
    setPage(1);
  };

  const handleSubcategoryChange = (newSubcategory) => {
    setSelectedSubcategory(newSubcategory);
    setPage(1);
  };

  const loadMoreProducts = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 lg:px-12 xl:px-16 py-8">
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
        {!isMobile && (
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
          {categories.map((category) => (
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
          {categories
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
        {products.map((product) => (
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

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products found. Try adjusting your filters or search query.
        </p>
      )}

      {/* Load More Button */}
      {hasMore && (
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
