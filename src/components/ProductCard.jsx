import React from "react";
import "../styles/pos.css";

export default function ProductCard({ product, onClick }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onClick(product);
      }}
      className={`pos-product-card ${isOutOfStock ? "out-of-stock" : ""}`}
    >
      {/* Imagen */}
      <div className="pos-card-image">
        <img src={product.image} alt={product.name} />
      </div>

      {/* Nombre */}
      <div className="pos-card-name">{product.name}</div>

      {/* Precio y Stock */}
      <div className="pos-card-bottom">
        <span className="pos-price">${product.price.toFixed(2)}</span>
        <span
          className={`pos-stock-badge ${
            isOutOfStock ? "pos-badge-red" : "pos-badge-green"
          }`}
        >
          {isOutOfStock ? "Agotado" : `Stock: ${product.stock}`}
        </span>
      </div>
    </div>
  );
}
