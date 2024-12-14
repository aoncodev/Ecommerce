"use client"; // Required for Next.js client-side components
import React, { createContext, useState, useContext, useEffect } from "react";

// Create a context for authentication
const AuthContext = createContext();

// Custom hook for easy access to AuthContext
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]); // Add order history state

  // Check login status on mount
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
      setUser(user);
      fetchCart(user); // Fetch cart when user logs in
    }
  }, [cart, user, isLoggedIn]);

  const login = (user) => {
    localStorage.setItem("user", user); // Save user in localStorage
    setIsLoggedIn(true); // Update state
    setUser(user);
    fetchCart(user); // Fetch the cart for the logged-in user
    getUser(user);
  };

  const getUser = async (phone) => {
    try {
      const response = await fetch(
        `https://albazaarkorea.com/api/getUser/${phone}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserDetails(null);
    }
  };

  const fetchOrderHistory = async (userId) => {
    try {
      const response = await fetch(
        `https://albazaarkorea.com/api/getOrder/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setOrderHistory(data); // Save order history in state
      } else {
        console.error("Failed to fetch order history.");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const response = await fetch(`https://albazaarkorea.com/api/edit/user`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
      const updatedUser = await response.json();
      console.log(updateUser);
      setUserDetails(updatedUser);
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const fetchCart = async (phone) => {
    try {
      const response = await fetch(
        `https://albazaarkorea.com/api/getCart/${phone}`
      );
      const data = await response.json();
      if (data && data.cart) {
        setCart(data.cart); // Update cart state with fetched data
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setCart([]); // Reset cart on error
    }
  };

  const addToCart = async (user, newCartItem) => {
    try {
      if (!user) {
        console.error("User is not logged in");
        return;
      }

      const response = await fetch(`https://albazaarkorea.com/api/addToCart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user, cart: newCartItem }),
      });

      if (response.ok) {
        console.log("Product added to cart successfully");
        fetchCart(user); // Re-fetch the cart to ensure state is updated
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const increaseCart = async (user, productId) => {
    try {
      const response = await fetch(
        `https://albazaarkorea.com/api/increasedCart`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: user, id: productId }),
        }
      );

      if (response.ok) {
        console.log("Product quantity increased successfully");
        fetchCart(user); // Re-fetch the cart to update state
      } else {
        console.error("Failed to increase product quantity");
      }
    } catch (error) {
      console.error("Error increasing product quantity:", error);
    }
  };

  const decreaseCart = async (user, productId) => {
    try {
      const response = await fetch(
        `https://albazaarkorea.com/api/decreasedCart`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: user, id: productId }),
        }
      );

      if (response.ok) {
        console.log("Product quantity decreased successfully");
        fetchCart(user); // Re-fetch the cart to update state
      } else {
        console.error("Failed to decrease product quantity");
      }
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
    }
  };

  const deleteCart = async (user, productId) => {
    try {
      const response = await fetch(
        `https://albazaarkorea.com/api/deletedCart`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: user, id: productId }),
        }
      );

      if (response.ok) {
        console.log("Product removed from cart successfully");
        fetchCart(user); // Re-fetch the cart to update state
      } else {
        console.error("Failed to delete product from cart");
      }
    } catch (error) {
      console.error("Error deleting product from cart:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user"); // Remove user from localStorage
    setIsLoggedIn(false); // Update state
    setUser("");
    setCart([]); // Clear cart on logout
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        cart,
        user,
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
