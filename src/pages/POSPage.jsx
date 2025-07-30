import React, { useState } from "react";
import LayoutPOS from "../components/LayoutPOS";
import POSCatalog from "../components/POSCatalog";
import POSCart from "../components/POSCart";
import POSSummary from "../components/POSSummary";
import POSProductSearch from "../components/POSProductSearch";
import "../styles/pos.css";

export default function POSPage() {
  const [cart, setCart] = useState([]);

  const handleAddProduct = (product) => {
    const existing = cart.find((p) => p.id === product.id);
    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveProduct = (productId) => {
    setCart(cart.filter((p) => p.id !== productId));
  };

  const handleUpdateQuantity = (productId, quantity) => {
    setCart(
      cart.map((p) =>
        p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );
  };

  const handleCheckout = () => {
    alert("Implementar lógica de cobro aquí");
  };

  return (
    <LayoutPOS>
      <div className="pos-page">
        {/* Columna izquierda: catálogo */}
        <div className="pos-catalog-section">
          <h1 className="pos-title">
            <span role="img" aria-label="ticket">🧾</span>
            MEKA CAT STORE
          </h1>
          <POSProductSearch />
          <POSCatalog onAddProduct={handleAddProduct} />
        </div>

        {/* Columna derecha: carrito + resumen */}
        <div className="pos-cart-section">
          <div className="pos-cart-scroll">
            <POSCart
              cart={cart}
              onRemove={handleRemoveProduct}
              onUpdateQuantity={handleUpdateQuantity}
            />
          </div>
          <div className="pos-summary-wrapper">
            <POSSummary
              cart={cart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </LayoutPOS>
  );
}
