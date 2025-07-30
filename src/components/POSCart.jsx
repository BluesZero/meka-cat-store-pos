// src/components/POSCart.jsx
import React from "react";
import CartItemCard from "./CartItemCard";
import "../styles/POSCart.css";

export default function POSCart({ cart, onRemove, onUpdateQuantity }) {
  return (
    <div className="pos-cart">
      <h2>
        <span role="img" aria-label="cart">🛒</span>
        Carrito
      </h2>

      {cart.length === 0 ? (
        <p>No hay productos agregados.</p>
      ) : (
        <div className="cart-list">
          {cart.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onAdd={() => onUpdateQuantity(item, +1)}
              onRemove={() => onUpdateQuantity(item, -1)}
              onDelete={() => onRemove(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
