import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, TrendingUp } from "lucide-react";
import SectionHeader from "../components/common/SectionHeader";
import TransparencyBanner from "../components/common/TransparencyBanner";
import CurrencySelector from "../components/common/CurrencySelector";
import { useProject } from "../context/ProjectContext";
import { COUNTRIES, QUALITY_TIERS } from "../data/regionalRates";
import { LAND_UNITS, convertToSqFt } from "../utils/unitConversion";
import { predictPropertyPriceSync } from "../services/propertyPredictionService";
import { formatCurrency } from "../services/currencyService";

export default function HousePricePrediction() {
  const { currency, landInfo, propertyPrediction, setPropertyPrediction } = useProject();

  const [form, setForm] = useState({
    locationAddress: landInfo.locationNotes || "Sarjapur Main Road, Sector 2",
    country: landInfo.country || "India",
    state: landInfo.state || "Karnataka",
    city: landInfo.city || "Bengaluru",
    propertyType: "Independent House",
    landArea: landInfo.landArea || 2400,
    landUnit: landInfo.landUnit || "sqft",
    builtUpArea: 2200,
    bedrooms: 4,
    bathrooms: 3,
    floors: 2,
    propertyAge: 5,
    parkingAvailable: "Yes",
    condition: "Good",
    constructionQuality: "standard",
    furnishing: "Semi-Furnished",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeCountry = COUNTRIES.find((c) => c.id === form.country) || COUNTRIES[0];
  const convertedLandSqFt = convertToSqFt(form.landArea, form.landUnit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (Number(form.landArea) <= 0 || Number(form.builtUpArea) <= 0) {
      setError("Please enter valid positive values for both land area and built-up area.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const res = predictPropertyPriceSync(form, currency);
      setPropertyPrediction(res);
      setLoading(false);
    }, 220);
  };

  return (
    <div className="space-y-8 animate-editorial">
      <SectionHeader
        eyebrow="SquareFootIQ · Real Estate Valuation"
        title="House Price Prediction"
        subtitle="Estimate the market resale value of an existing property using frontend sample valuation curves prepared for future ML model integration."
        action={
          <div className="w-56">
            <CurrencySelector />
          </div>
        }
      />

      <TransparencyBanner
        title="Frontend Sample Heuristic Notice"
        message="No machine learning model or server backend is connected yet. Output below uses clearly labelled local sample valuation calculations prepared for your future ML model."
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-7 bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Property Location / Neighbourhood
              </label>
              <input
                type="text"
                value={form.locationAddress}
                onChange={(e) => setForm({ ...form, locationAddress: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-[#F3EEF8]/50"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">Country</label>
              <select
                value={form.country}
                onChange={(e) => {
                  const next = COUNTRIES.find((c) => c.id === e.target.value) || COUNTRIES[0];
                  setForm({ ...form, country: next.id, state: next.states[0] });
                }}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">State / Region</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {activeCountry.states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">Property Type</label>
              <select
                value={form.propertyType}
                onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {["Independent House", "Apartment", "Villa", "Duplex", "Commercial Property"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">Land Area</label>
              <input
                type="number"
                min="1"
                step="any"
                value={form.landArea}
                onChange={(e) => setForm({ ...form, landArea: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Land Measurement Unit
              </label>
              <select
                value={form.landUnit}
                onChange={(e) => setForm({ ...form, landUnit: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {LAND_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-[#4A3D5C] mt-1 tabular-nums">
                Converted: {convertedLandSqFt.toLocaleString()} sq. ft.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Built-up Area (sq. ft.)
              </label>
              <input
                type="number"
                min="200"
                value={form.builtUpArea}
                onChange={(e) => setForm({ ...form, builtUpArea: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Property Age (Years)
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={form.propertyAge}
                onChange={(e) => setForm({ ...form, propertyAge: Number(e.target.value) })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm tabular-nums"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 sm:col-span-2">
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={form.bedrooms}
                  onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.bathrooms}
                  onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">Floors</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={form.floors}
                  onChange={(e) => setForm({ ...form, floors: Number(e.target.value) })}
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Parking Availability
              </label>
              <select
                value={form.parkingAvailable}
                onChange={(e) => setForm({ ...form, parkingAvailable: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                <option value="Yes">Yes (Dedicated Parking)</option>
                <option value="No">No Dedicated Parking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Property Condition
              </label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {["Excellent", "Good", "Fair", "Needs Renovation"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Construction Quality
              </label>
              <select
                value={form.constructionQuality}
                onChange={(e) => setForm({ ...form, constructionQuality: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {Object.values(QUALITY_TIERS).map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Furnishing Status
              </label>
              <select
                value={form.furnishing}
                onChange={(e) => setForm({ ...form, furnishing: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {["Fully Furnished", "Semi-Furnished", "Unfurnished"].map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-[#6E5A88] font-bold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6E5A88] text-white py-3.5 px-6 rounded-xl font-bold text-sm hover:opacity-95 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            <span>{loading ? "SquareFootIQ is evaluating property..." : "Calculate Property Price"}</span>
          </button>
        </form>

        <div className="xl:col-span-5 space-y-6">
          {!propertyPrediction ? (
            <div className="rounded-2xl border border-dashed border-[#6E5A88]/40 bg-[#CDC4DC]/25 p-10 text-center space-y-3">
              <TrendingUp className="w-8 h-8 text-[#6E5A88] mx-auto" />
              <h3 className="text-lg font-bold text-[#261E31]">Awaiting Property Valuation</h3>
              <p className="text-sm text-[#4A3D5C]">
                Click <strong>Calculate Property Price</strong> to inspect sample valuation bands
                and key property value drivers.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#6E5A88] text-white p-6 sm:p-7">
                <p className="text-xs text-[#CDC4DC] font-bold">{propertyPrediction.sourceLabel}</p>
                <p className="text-xs text-[#F3EEF8]/85 mt-1">
                  Sample Estimated Market Value ({currency})
                </p>
                <p className="text-3xl sm:text-4xl font-bold mt-2 tabular-nums">
                  {formatCurrency(propertyPrediction.estimatedPrice, currency)}
                </p>
                <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/20 text-xs">
                  <div>
                    <p className="text-[#CDC4DC]">Minimum</p>
                    <p className="font-bold mt-0.5 tabular-nums">
                      {formatCurrency(propertyPrediction.minPrice, currency, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#CDC4DC]">Maximum</p>
                    <p className="font-bold mt-0.5 tabular-nums">
                      {formatCurrency(propertyPrediction.maxPrice, currency, true)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#CDC4DC]">Rate / Sq. Ft.</p>
                    <p className="font-bold mt-0.5 tabular-nums">
                      {formatCurrency(propertyPrediction.pricePerSqFt, currency)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white border border-[#CDC4DC] p-5">
                <h4 className="text-sm font-bold text-[#261E31] mb-4">
                  Market Benchmark Comparison ({currency})
                </h4>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={propertyPrediction.comparisonTiers}>
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#261E31" }} />
                      <YAxis
                        tickFormatter={(v) => formatCurrency(v, currency, true)}
                        tick={{ fontSize: 10, fill: "#4A3D5C" }}
                        width={70}
                      />
                      <Tooltip formatter={(val) => formatCurrency(Number(val), currency)} />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {propertyPrediction.comparisonTiers.map((_, idx) => (
                          <Cell key={idx} fill={idx === 1 ? "#6E5A88" : "#CDC4DC"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
