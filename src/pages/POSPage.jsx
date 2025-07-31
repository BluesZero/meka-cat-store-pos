import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

import LayoutPOS from "../components/LayoutPOS";
import POSCatalog from "../components/POSCatalog";
import POSCart from "../components/POSCart";
import POSSummary from "../components/POSSummary";
import POSProductSearch from "../components/POSProductSearch";
import AddProduct from "../components/AddProduct";
import SalesList from "../components/SalesList";

import "../styles/pos.css";

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(true);
  const [saleInfo, setSaleInfo] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showSalesModal, setShowSalesModal] = useState(false);

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

  const handleUpdateQuantity = (item, delta) => {
    setCart(
      cart.map((p) =>
        p.id === item.id
          ? { ...p, quantity: Math.max(1, p.quantity + delta) }
          : p
      )
    );
  };

  const handleCheckout = async ({ paymentMethod, couponCode, manualDiscount }) => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    let discount = manualDiscount || 0;
    let surcharge = paymentMethod === "tarjeta" ? subtotal * 0.035 : 0;

    let coupon = null;
    if (couponCode) {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .eq("code", couponCode)
        .eq("active", true)
        .lte("expires_at", new Date().toISOString())
        .single();

      if (!error && data) {
        coupon = data;
        const couponDiscount = data.discount_type === "percentage"
          ? subtotal * data.discount_value
          : data.discount_value;
        discount += couponDiscount;
      } else {
        alert("Cupón inválido o expirado. Se ignorará.");
      }
    }

    const total = subtotal - discount + surcharge;

    const sale = {
      id: uuidv4(),
      user_id: null,
      date: new Date().toISOString(),
      subtotal,
      discount,
      surcharge,
      total,
      payment_method: paymentMethod,
      coupon_code: coupon?.code || null,
      products: cart.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
      })),
    };

    const { error: insertError } = await supabase.from("sales").insert(sale);
    if (insertError) {
      console.error("Error al registrar la venta:", insertError);
      alert("No se pudo completar la venta.");
      return;
    }

    for (const item of cart) {
      await supabase
        .from("products")
        .update({ stock: item.stock - item.quantity })
        .eq("id", item.id);
    }

    if (coupon) {
      await supabase
        .from("coupons")
        .update({ used_count: coupon.used_count + 1 })
        .eq("code", coupon.code);
    }

    setCart([]);
    setSaleInfo({
      total,
      paymentMethod,
      discount,
      couponCode: coupon?.code || null,
    });
  };

  return (
    <LayoutPOS>
      <div className="pos-page">
        {/* Columna izquierda */}
        <div className="pos-catalog-section">
          <h1 className="pos-title">
            <span role="img" aria-label="ticket">🧾</span> MEKA CAT STORE
          </h1>

          <POSProductSearch />

          <div className="pos-actions">
            <button type="button" className="pos-btn" onClick={() => setShowAddProductModal(true)}>
              ➕ Agregar producto
            </button>
            <button type="button" className="pos-btn" onClick={() => setShowSalesModal(true)}>
              📄 Ver ventas
            </button>
          </div>

          <POSCatalog onAddProduct={handleAddProduct} />
        </div>

        {/* Columna derecha */}
        {showCart && (
          <div className="pos-cart-section">
            <div className="pos-cart-scroll">
              <POSCart
                cart={cart}
                onRemove={handleRemoveProduct}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>
            <div className="pos-summary-wrapper">
              <POSSummary cart={cart} onCheckout={handleCheckout} />
            </div>
          </div>
        )}

        {/* Modal confirmación de venta */}
        {saleInfo && (
          <div className="sale-modal">
            <div className="sale-modal-content">
              <h2>✅ Venta registrada</h2>
              <p><strong>Total:</strong> ${saleInfo.total.toFixed(2)} MXN</p>
              <p><strong>Método de pago:</strong> {saleInfo.paymentMethod}</p>
              {saleInfo.couponCode && (
                <p><strong>Cupón:</strong> {saleInfo.couponCode}</p>
              )}
              {saleInfo.discount > 0 && (
                <p><strong>Descuento aplicado:</strong> ${saleInfo.discount.toFixed(2)}</p>
              )}
              <button onClick={() => setSaleInfo(null)}>Cerrar</button>
            </div>
          </div>
        )}

        {/* Modal: Agregar producto */}
        {showAddProductModal && (
          <div className="pos-modal">
            <div className="pos-modal-content">
              <AddProduct onClose={() => setShowAddProductModal(false)} />
            </div>
          </div>
        )}

        {/* Modal: Ver ventas */}
        {showSalesModal && (
          <div className="pos-modal">
            <div className="pos-modal-content">
              <SalesList onClose={() => setShowSalesModal(false)} />
            </div>
          </div>
        )}
      </div>
    </LayoutPOS>
  );
}
