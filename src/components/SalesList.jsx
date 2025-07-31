// SalesList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import "../styles/SalesList.css";


function SalesList() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
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
      .update({ status: "cancelled" })
      .eq("id", saleId);

    if (!error) {
      alert("Venta cancelada.");
      fetchSales();
    }
  };

  return (
    <div className="sales-list">
      <h2>Ventas registradas</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {sales.map((sale) => (
            <li key={sale.id}>
              <p>
                🧾 <strong>{new Date(sale.date).toLocaleString()}</strong> — Total: ${sale.total} — {sale.payment_method}
              </p>
              {sale.status !== "cancelled" && (
                <button onClick={() => handleCancel(sale.id)}>Cancelar</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SalesList;
