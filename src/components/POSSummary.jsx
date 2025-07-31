import React, { useState, useMemo } from "react";
import "../styles/POSSummary.css";

export default function POSSummary({ cart, onCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [couponCode, setCouponCode] = useState("");
  const [manualDiscount, setManualDiscount] = useState("");

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const discount = parseFloat(manualDiscount) || 0;
  const surcharge = paymentMethod === "tarjeta" ? subtotal * 0.0418 : 0;
  const total = subtotal - discount + surcharge;

  const handleSubmit = () => {
    onCheckout({
      paymentMethod,
      couponCode: couponCode.trim(),
      manualDiscount: discount,
    });
  };

  return (
    <div className="pos-summary">
      <h3 className="pos-summary-title">🧾 Resumen</h3>

      <div className="pos-summary-details">
        <div className="pos-summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="pos-summary-row">
            <span>Descuento:</span>
            <span className="discount">– ${discount.toFixed(2)}</span>
          </div>
        )}

        {surcharge > 0 && (
          <div className="pos-summary-row">
            <span>Comisión (tarjeta):</span>
            <span className="surcharge">+ ${surcharge.toFixed(2)}</span>
          </div>
        )}

        <hr />
        <div className="pos-summary-total">
          <span>Total:</span>
          <span>${total.toFixed(2)} MXN</span>
        </div>
      </div>

      <div className="pos-summary-controls">
        <label>
          Método de pago:
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
          </select>
        </label>

        <label>
          Cupón:
          <input
            type="text"
            placeholder="Ej: BIENVENIDA10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </label>

        <label>
          Descuento manual (MXN):
          <input
            type="number"
            placeholder="Ej: 50"
            value={manualDiscount}
            onChange={(e) => setManualDiscount(e.target.value)}
            min="0"
          />
        </label>
      </div>

      <button className="pos-summary-button" onClick={handleSubmit}>
        🪙 Cobrar ahora
      </button>
    </div>
  );
}
