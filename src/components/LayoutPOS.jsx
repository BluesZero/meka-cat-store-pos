// src/components/LayoutPOS.jsx
import React from "react";

export default function LayoutPOS({ children }) {
  return (
    <div className="h-screen w-screen bg-[#1e1f26] text-white font-sans">
      {children}
    </div>
  );
}
