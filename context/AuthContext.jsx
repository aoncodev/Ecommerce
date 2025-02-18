"use client"; // Required for Next.js client-side components
import React, { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation"; // if you want to navigate on errors

// Create a context for authentication
const AuthContext = createContext();

// Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);

const BASE_URL = "https://api.albazaarkorea.com/web";

// Helper function to retrieve token
const getToken = () => localStorage.getItem("token");

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const router = useRouter();

  // Check login status on mount (run only once)
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      fetchCart();
    }
  }, []);

  const login = () => {
    // Assume token is already saved in localStorage (e.g., from OTP verification)
    setIsLoggedIn(true);
    fetchCart();
    getUser();
  };

  const getUser = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/getUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserDetails(null);
    }
  };

  const fetchOrderHistory = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/getOrder`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setOrderHistory(data);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
        console.error("Failed to fetch order history.");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const updateUser = async (updatedData) => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/edit/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
        throw new Error("Failed to update user details");
      }
      const updatedUser = await response.json();
      console.log("Updated user:", updatedUser);
      setUserDetails(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const fetchCart = async () => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/getCart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          router.push("/login");
        }
        throw new Error("Failed to fetch cart data");
      }
      const data = await response.json();
      console.log("Cart data:", data);
      // Assuming the returned data structure is { cart: { cart: [...] } }
      if (data && data.cart && data.cart.cart) {
        setCart(data.cart.cart);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCart([]);
    }
  };

  const addToCart = async (newCartItem) => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/addToCart`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: newCartItem }),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
        return;
      }
      if (response.ok) {
        console.log("Product added to cart successfully");
        fetchCart();
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const increaseCart = async (productId) => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/increasedCart`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
        return;
      }
      if (response.ok) {
        console.log("Product quantity increased successfully");
        fetchCart();
      } else {
        console.error("Failed to increase product quantity");
      }
    } catch (error) {
      console.error("Error increasing product quantity:", error);
    }
  };

  const decreaseCart = async (productId) => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/decreasedCart`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
        return;
      }
      if (response.ok) {
        console.log("Product quantity decreased successfully");
        fetchCart();
      } else {
        console.error("Failed to decrease product quantity");
      }
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
    }
  };

  const deleteCart = async (productId) => {
    const token = getToken();
    try {
      const response = await fetch(`${BASE_URL}/deletedCart`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: productId }),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login");
        return;
      }
      if (response.ok) {
        console.log("Product removed from cart successfully");
        fetchCart();
      } else {
        console.error("Failed to delete product from cart");
      }
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCart([]);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        cart,
        userDetails,
        orderHistory,
        fetchOrderHistory,
        getUser,
        updateUser,
        login,
        logout,
        fetchCart,
        addToCart,
        increaseCart,
        decreaseCart,
        deleteCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
