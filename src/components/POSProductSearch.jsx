// src/components/POSProductSearch.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from "../lib/supabase"; // Asegúrate de tener esta instancia
import '../styles/POSProductSearch.css';

export default function POSProductSearch({ onProductSelect }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true);

      if (error) {
        console.error('Error al cargar productos:', error.message);
      } else {
        setProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filtrado en tiempo real
  const filteredProducts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return products.filter(p =>
      [p.name, p.id, p.productTypeId, p.expansionId].some(field =>
        field?.toLowerCase().includes(q)
      )
    );
  }, [query, products]);

  return (
    <div style={{ width: '100%', padding: '20px' }}>
      <input
        type="text"
        value={query}
        autoFocus
        placeholder="Buscar por nombre, ID, tipo o expansión"
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          fontSize: '20px',
          padding: '14px 20px',
          borderRadius: '12px',
          border: '1px solid #444',
          background: '#1e1f26',
          color: 'white',
          marginBottom: '20px',
        }}
      />

      {loading && <p style={{ color: '#ccc' }}>Cargando productos...</p>}

      {!loading && filteredProducts.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
            maxHeight: '500px',
            overflowY: 'auto',
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onProductSelect(product)}
              style={{
                background: '#2a2f34',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src={product.images?.[0] || product.image}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'contain',
                  marginBottom: '8px',
                }}
              />
              <span style={{ color: 'white', fontSize: '16px', fontWeight: 500 }}>
                {product.name}
              </span>
              <span style={{ color: '#8fff8f', fontWeight: 'bold' }}>${product.price}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && query && filteredProducts.length === 0 && (
        <p style={{ color: '#ccc', fontStyle: 'italic' }}>No se encontraron productos.</p>
      )}
    </div>
  );
}
