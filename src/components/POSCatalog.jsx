import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import FranchiseCard from "./FranchiseCard";
import ExpansionCard from "./ExpansionCard";
import ProductCard from "./ProductCard";
import "../styles/POSCatalog.css";

export default function POSCatalog({ onAddProduct }) {
  const [step, setStep] = useState("franchise");
  const [franchises, setFranchises] = useState([]);
  const [expansions, setExpansions] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFranchise, setSelectedFranchise] = useState(null);
  const [selectedExpansion, setSelectedExpansion] = useState(null);

  useEffect(() => {
    fetchFranchises();
  }, []);

  const fetchFranchises = async () => {
    const { data, error } = await supabase.from("franchises").select("*");
    if (!error) setFranchises(data);
  };

  const fetchExpansions = async (franchiseId) => {
    const { data, error } = await supabase
      .from("expansions")
      .select("*")
      .eq("franchise_id", franchiseId);
    if (!error) setExpansions(data);
  };

  const fetchProducts = async (expansionId) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("expansion_id", expansionId);
    if (!error) setProducts(data);
  };

  const handleSelectFranchise = (franchise) => {
    setSelectedFranchise(franchise);
    fetchExpansions(franchise.id);
    setStep("expansion");
  };

  const handleSelectExpansion = (expansion) => {
    setSelectedExpansion(expansion);
    fetchProducts(expansion.id);
    setStep("product");
  };

  const handleBack = () => {
    if (step === "product") {
      setStep("expansion");
    } else if (step === "expansion") {
      setStep("franchise");
    }
  };

  return (
    <div className="pos-catalog">
      {step !== "franchise" && (
        <button className="pos-catalog-back" onClick={handleBack}>
          ← Volver
        </button>
      )}

      {step === "franchise" && (
        <>
          <h2 className="pos-catalog-title">Selecciona una franquicia</h2>
          <div className="pos-catalog-grid">
            {franchises.map((f) => (
              <FranchiseCard key={f.id} franchise={f} onClick={handleSelectFranchise} />
            ))}
          </div>
        </>
      )}

      {step === "expansion" && (
        <>
          <h2 className="pos-catalog-title">Expansiones de {selectedFranchise?.name}</h2>
          <div className="pos-catalog-grid">
            {expansions.map((e) => (
              <ExpansionCard key={e.id} expansion={e} onClick={handleSelectExpansion} />
            ))}
          </div>
        </>
      )}

      {step === "product" && (
        <>
          <h2 className="pos-catalog-title">Productos de {selectedExpansion?.name}</h2>
          <div className="pos-catalog-grid products">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} onClick={onAddProduct} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
