// src/components/FranchiseCard.jsx
import React from "react";
import "../styles/pos.css";

export default function FranchiseCard({ franchise, onClick }) {
  return (
    <div
      onClick={() => onClick(franchise)}
      className="pos-franchise-card"
    >
      {/* Imagen */}
      <div className="pos-franchise-image">
        <img src={franchise.logo} alt={franchise.name} />
      </div>

      {/* Nombre */}
      <div className="pos-franchise-name">{franchise.name}</div>
    </div>
  );
}
