"use client";

import { useState, useEffect } from "react";
import ProductPage from "./home";

export default function ClientProductPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return <ProductPage />;
}
