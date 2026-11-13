import React from "react";
import { CURRENCIES, type CurrencyCode } from "../../services/currencyService";
import { useProject } from "../../context/ProjectContext";

export default function CurrencySelector({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useProject();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      aria-label="Select Currency"
      className={`w-full rounded-lg border border-[#CDC4DC] bg-white text-[#261E31] focus:outline-none focus:ring-2 focus:ring-[#6E5A88] ${
        compact ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2.5 text-sm"
      }`}
    >
      {Object.values(CURRENCIES).map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} ({c.symbol}) {compact ? "" : `— ${c.name}`}
        </option>
      ))}
    </select>
  );
}
