"use client";

import React, { useRef } from "react";

const categories = [
  { id: 1, name: "Fruits", image: "/images/fruits.jpg" },
  { id: 2, name: "Vegetables", image: "/images/vegetables.jpg" },
  { id: 3, name: "Dairy", image: "/images/dairy.jpg" },
  { id: 4, name: "Bakery", image: "/images/bakery.jpg" },
  { id: 5, name: "Meat", image: "/images/meat.jpg" },
  { id: 6, name: "Seafood", image: "/images/seafood.jpg" },
  { id: 7, name: "Snacks", image: "/images/snacks.jpg" },
];

export default function ScrollableCategories() {
  const containerRef = useRef(null);
  let isDragging = false;
  let startX = 0;

  const handleMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - containerRef.current.offsetLeft;
    containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    containerRef.current.scrollLeft -= walk;
    startX = x;
  };

  const handleMouseUp = () => {
    isDragging = false;
    containerRef.current.style.cursor = "grab";
  };

  return (
    <div className="md:hidden p-4">
      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 pb-2 cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => (isDragging = false)}
      >
        {categories.map((category) => (
          <div key={category.id} className="flex-shrink-0 text-center w-20">
            <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border border-gray-300">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-2 text-sm text-gray-600">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
