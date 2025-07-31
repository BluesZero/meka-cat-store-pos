import React from "react";
import "../styles/CartItemCard.css";

export default function CartItemCard({ item, onAdd, onRemove, onDelete }) {
  return (
    <div className="cart-item-card">
      <div className="cart-item-image">
        <img src={item.image} alt={item.name} />
      </div>

      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-price">${item.price.toFixed(2)} c/u</p>
        <p className="cart-item-total">Total: ${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <div className="cart-item-controls">
        <button className="add" onClick={() => onAdd(item)}>+</button>
        <span>{item.quantity}</span>
        <button className="remove" onClick={() => onRemove(item.id)}>-</button>
        <button className="delete" onClick={() => onDelete(item.id)}>X</button>
      </div>
    </div>
  );
}
