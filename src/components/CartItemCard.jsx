// src/components/CartItemCard.jsx
import React from "react";
import "../styles/CartItemCard.css";

export default function CartItemCard({ item, onAdd, onRemove, onDelete }) {
  return (
    <div className="cart-item-card">
      {/* Imagen */}
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      {/* Info */}
      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p>${item.price.toFixed(2)} c/u</p>
        <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      {/* Controles */}
      <div className="cart-item-controls">
        <button className="add" onClick={onAdd}>+</button>
        <span style={{ color: "white", fontSize: "0.9rem" }}>{item.quantity}</span>
        <button className="remove" onClick={onRemove}>-</button>
        <button className="delete" onClick={onDelete}>🗑</button>
      </div>
    </div>
  );
}

