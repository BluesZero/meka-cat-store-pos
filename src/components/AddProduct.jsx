import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "../styles/AddProduct.css";

export default function AddProduct({ onClose }) {
  const [form, setForm] = useState({
    name: "", price: "", original_price: "", description: "", image: "",
    release_date: "", franchise_id: "", collection_id: "", expansion_id: "",
    product_type_id: "", discount: false, images: "", stock: 0,
    limit_per_customer: 0, preorder: false, available: true, tags: ""
  });

  const [franchises, setFranchises] = useState([]);
  const [collections, setCollections] = useState([]);
  const [expansions, setExpansions] = useState([]);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: f } = await supabase.from("franchises").select("*");
      const { data: c } = await supabase.from("collections").select("*");
      const { data: e } = await supabase.from("expansions").select("*");
      const { data: pt } = await supabase.from("product_types").select("*");

      setFranchises(f || []);
      setCollections(c || []);
      setExpansions(e || []);
      setProductTypes(pt || []);
    };
    fetchData();
  }, []);

  const filteredCollections = collections.filter(c => c.franchise_id === form.franchise_id);
  const filteredExpansions = expansions.filter(e => e.collection_id === form.collection_id);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = {
      ...form,
      price: parseFloat(form.price),
      original_price: parseFloat(form.original_price),
      stock: parseInt(form.stock),
      limit_per_customer: parseInt(form.limit_per_customer),
      tags: form.tags.split(",").map(tag => tag.trim()),
      images: form.images.split(",").map(url => url.trim())
    };

    const { error } = await supabase.from("products").insert([formattedData]);

    if (error) {
      console.error("Error al agregar producto:", error);
      alert("❌ Error al agregar producto");
    } else {
      alert("✅ Producto agregado con éxito");
      onClose?.();
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Agregar nuevo producto</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Precio" value={form.price} onChange={handleChange} required />
          <input name="original_price" type="number" placeholder="Precio original" value={form.original_price} onChange={handleChange} />

          <label>
            Stock:
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required />
          </label>

          <label>
            Límite por cliente:
            <input type="number" name="limit_per_customer" value={form.limit_per_customer} onChange={handleChange} />
          </label>

          <label>
            Fecha de lanzamiento:
            <input type="date" name="release_date" value={form.release_date} onChange={handleChange} />
          </label>

          <input name="image" placeholder="Imagen principal" value={form.image} onChange={handleChange} />
          <input name="images" placeholder="Imágenes (separadas por coma)" value={form.images} onChange={handleChange} />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />

          <select name="franchise_id" value={form.franchise_id} onChange={handleChange} required>
            <option value="">Selecciona una franquicia</option>
            {franchises.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>

          <select name="collection_id" value={form.collection_id} onChange={handleChange} required>
            <option value="">Selecciona una colección</option>
            {filteredCollections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select name="expansion_id" value={form.expansion_id} onChange={handleChange}>
            <option value="">Selecciona una expansión</option>
            {filteredExpansions.map(e => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select name="product_type_id" value={form.product_type_id} onChange={handleChange}>
            <option value="">Selecciona tipo de producto</option>
            {productTypes.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input name="tags" placeholder="Tags (separados por coma)" value={form.tags} onChange={handleChange} />

          <label><input type="checkbox" name="discount" checked={form.discount} onChange={handleChange} /> Tiene descuento</label>
          <label><input type="checkbox" name="preorder" checked={form.preorder} onChange={handleChange} /> Preventa</label>
          <label><input type="checkbox" name="available" checked={form.available} onChange={handleChange} /> Disponible</label>

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">Guardar producto</button>
            <button type="button" onClick={onClose} style={{ marginLeft: "8px" }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
