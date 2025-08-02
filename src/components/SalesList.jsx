import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../styles/SalesList.css";

function SalesList({ onClose }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .order("date", { ascending: false });

    if (!error) setSales(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleCancel = async (saleId) => {
    const confirmed = window.confirm("¿Seguro que deseas cancelar esta venta?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", saleId);

    if (!error) {
      alert("Venta cancelada.");
      fetchSales();
    }
  };

  return (
    <div className="sales-list">
      <div className="sales-header">
        <h2>Ventas registradas</h2>
        {onClose && (
          <button onClick={onClose} className="sales-close-btn">✖</button>
        )}
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {sales.map((sale) => (
            <li key={sale.id}>
              <p>
                🧾 <strong>{new Date(sale.date).toLocaleString()}</strong> — Total: ${sale.total} — {sale.payment_method}
              </p>

              {sale.items && Array.isArray(sale.items) && (
                <ul style={{ marginLeft: "16px", marginTop: "6px" }}>
                  {sale.items.map((item, idx) => (
                    <li key={idx} style={{ color: "#ccc" }}>
                      • {item.name} × {item.quantity} — ${item.price}
                    </li>
                  ))}
                </ul>
              )}

              {sale.status !== "cancelled" && (
                <button onClick={() => handleCancel(sale.id)}>Cancelar</button>
              )}
              {sale.status === "cancelled" && (
                <p style={{ color: "tomato", marginTop: "4px" }}>🚫 Venta cancelada</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SalesList;
