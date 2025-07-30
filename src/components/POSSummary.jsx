import React from "react";
import "../styles/POSSummary.css"; // Asegúrate de crear este archivo y vincularlo

export default function POSSummary({ cart, onCheckout }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="pos-summary">
      <h3 className="pos-summary-title">🧾 Resumen</h3>

      <div className="pos-summary-details">
        <div className="pos-summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <hr />
        <div className="pos-summary-total">
          <span>Total:</span>
          <span>${total.toFixed(2)} MXN</span>
        </div>
      </div>

      <button className="pos-summary-button" onClick={onCheckout}>
        🪙 Cobrar ahora
      </button>
    </div>
  );
}
