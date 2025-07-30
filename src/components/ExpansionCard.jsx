// src/components/ExpansionCard.jsx
import React from "react";
import "../styles/pos.css";

export default function ExpansionCard({ expansion, onClick }) {
  return (
    <div
      onClick={() => onClick(expansion)}
      className="pos-expansion-card"
    >
      {/* Imagen */}
      <div className="pos-expansion-image">
        <img src={expansion.image} alt={expansion.name} />
      </div>

      {/* Nombre */}
      <div className="pos-expansion-name">{expansion.name}</div>
    </div>
  );
}
