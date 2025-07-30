import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "../styles/POSProductSearch.css";

export default function POSProductSearch({ onAddProduct }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (query.length < 2) return setResults([]);
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, image")
        .ilike("name", `%${query}%`);

      if (!error) setResults(data);
      else console.error("Supabase error:", error);
    };

    fetchProducts();
  }, [query]);

  const handleSelect = (product) => {
    onAddProduct(product);
    setQuery("");
    setResults([]);
  };

  return (
    <div className="pos-search-wrapper">
      <div className="pos-search-box">
        <img src="/img/search.png" alt="Buscar" className="pos-search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar producto..."
          className="pos-search-input"
        />
      </div>

      {query && results.length > 0 && (
        <ul className="pos-search-results">
          {results.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelect(product)}
              className="pos-search-item"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="pos-search-thumbnail"
                />
              )}
              <div>
                <p className="pos-search-name">{product.name}</p>
                <p className="pos-search-price">${product.price} MXN</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
