import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import {
  FileDown,
  MessageSquare,
  RefreshCw,
  CheckCircle2,
  Edit3,
  RotateCcw,
} from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import TransparencyBanner from "../components/common/TransparencyBanner";
import CurrencySelector from "../components/common/CurrencySelector";
import {
  ArchitecturalImageFrame,
  EmptyLandSVG,
  HouseElevationSVG,
  InteriorRoomSVG,
} from "../components/visuals/ArchitecturalIllustrations";
import FloorPlanCanvas from "../components/visuals/FloorPlanCanvas";
import BeforeAfterSlider from "../components/visuals/BeforeAfterSlider";
import { ARCHITECTURAL_STYLES, DESIGN_IMAGE_ASSETS, INTERIOR_STYLES, STYLE_GALLERY } from "../data/designPresets";
import { QUALITY_TIERS } from "../data/regionalRates";
import { formatCurrency } from "../services/currencyService";
import { generateInteriorDesignSync } from "../services/interiorDesignService";
import { generateProjectPdfReport } from "../services/reportService";

const CHART_COLORS = ["#6E5A88", "#907AA9", "#CDC4DC", "#4A3D5C", "#B0A2C4"];

export default function FinalProjectResult() {
  const {
    projectName,
    setProjectName,
    currency,
    landInfo,
    constructionConfig,
    setConstructionConfig,
    houseDesignInput,
    setHouseDesignInput,
    materialSettings,
    setMaterialSettings,
    selectedPlanIndex,
    setSelectedPlanIndex,
    acceptedImprovement,
    setAcceptedImprovement,
    constructionResult,
    materialResult,
    houseDesign,
    floorPlanResult,
    startNewProjectAtStep,
    setView,
  } = useProject();

  const { user, isAuthenticated } = useAuth();
  const [elevationTab, setElevationTab] = useState<"exterior" | "front" | "side">("exterior");
  const [activeFloorIdx, setActiveFloorIdx] = useState(0);
  const [interiorRoom, setInteriorRoom] = useState("Living Room");
  const [interiorStyle, setInteriorStyle] = useState<string>("Modern");
  const [pdfSaved, setPdfSaved] = useState(false);

  const activePlan = floorPlanResult.options[selectedPlanIndex] || floorPlanResult.options[0];
  const activeFloor = activePlan?.floors[activeFloorIdx] || activePlan?.floors[0];

  const interiorPreview = generateInteriorDesignSync(
    {
      roomType: interiorRoom,
      style: interiorStyle,
      colorPalette: "Wisteria & Warm Alabaster",
      furniturePreference: "Modular Linen & Solid Walnut",
      lengthFt: 18,
      widthFt: 15,
      budgetTier: "Balanced ($48/sq.ft.)",
    },
    currency
  );

  const handleDownloadPdf = () => {
    generateProjectPdfReport({
      projectName,
      currency,
      constructionConfig: { ...landInfo, ...constructionConfig },
      constructionResult,
      materialResult,
      houseDesign,
      floorPlanResult,
      selectedPlanIndex,
      landWidth: Number(landInfo.landWidth) || 40,
      landDepth: Number(landInfo.landLength) || 60,
    });
    setPdfSaved(true);
    setTimeout(() => setPdfSaved(false), 4000);
  };

  const handleStyleQuickSwitch = (styleId: string) => {
    const match = STYLE_GALLERY.find((s) => s.id === styleId);
    setHouseDesignInput((prev) => ({
      ...prev,
      style: styleId,
      roofStyle: match?.defaultRoof || prev.roofStyle,
      preferredMaterials: match?.defaultMaterials || prev.preferredMaterials,
    }));
  };

  const handleRegenerateCycle = () => {
    const nextIdx = (selectedPlanIndex + 1) % floorPlanResult.options.length;
    setSelectedPlanIndex(nextIdx);
    setActiveFloorIdx(0);
  };

  return (
    <div className="space-y-12 animate-editorial">
      {/* Top Cohesive Result Header & Edit/Regenerate Toolbar */}
      <section className="space-y-5 border-b border-[#CDC4DC] pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-[#6E5A88]">
              {isAuthenticated && user
                ? `SquareFootIQ · Welcome, ${user.fullName} (Demo Session) · Project Dashboard`
                : "SquareFootIQ · Project Dashboard & Architectural Dossier"}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                aria-label="Project Name"
                className="text-2xl sm:text-4xl font-bold text-[#261E31] bg-transparent border-b border-transparent hover:border-[#CDC4DC] focus:border-[#6E5A88] focus:outline-none"
              />
            </div>
            <p className="text-sm text-[#4A3D5C] tabular-nums">
              {landInfo.city}, {landInfo.country} · {constructionResult.landAreaSqFt.toLocaleString()} sq. ft. plot ·{" "}
              {constructionResult.effectiveBuiltUpSqFt.toLocaleString()} sq. ft. built-up ·{" "}
              {houseDesign.style} {constructionConfig.buildingType}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-48">
              <CurrencySelector />
            </div>
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 bg-[#6E5A88] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-95 whitespace-nowrap"
            >
              <FileDown className="w-4 h-4" />
              <span>Download Project Report</span>
            </button>
          </div>
        </div>

        {pdfSaved && (
          <div className="rounded-xl border border-[#6E5A88] bg-white px-4 py-2.5 flex items-center gap-2 text-xs font-bold text-[#6E5A88]">
            <CheckCircle2 className="w-4 h-4" />
            <span>SquareFootIQ PDF Project Report downloaded using your current inputs and estimates.</span>
          </div>
        )}

        {/* Section 8: Edit and Regenerate Controls */}
        <div className="rounded-2xl bg-white border border-[#CDC4DC] p-4 flex flex-wrap items-center gap-3 text-xs">
          <span className="font-bold text-[#6E5A88] mr-1">Edit &amp; Refine:</span>

          <select
            value={houseDesignInput.style}
            onChange={(e) => handleStyleQuickSwitch(e.target.value)}
            aria-label="Change Architecture"
            className="rounded-lg border border-[#CDC4DC] px-2.5 py-1.5 bg-[#F3EEF8]/60 font-bold"
          >
            {ARCHITECTURAL_STYLES.map((st) => (
              <option key={st} value={st}>
                Style: {st}
              </option>
            ))}
          </select>

          <select
            value={constructionConfig.quality}
            onChange={(e) =>
              setConstructionConfig({
                ...constructionConfig,
                quality: e.target.value as "basic" | "standard" | "premium" | "luxury",
              })
            }
            aria-label="Change Construction Quality"
            className="rounded-lg border border-[#CDC4DC] px-2.5 py-1.5 bg-[#F3EEF8]/60 font-bold"
          >
            {Object.values(QUALITY_TIERS).map((q) => (
              <option key={q.id} value={q.id}>
                Quality: {q.label}
              </option>
            ))}
          </select>

          <div className="inline-flex items-center gap-1 rounded-lg border border-[#CDC4DC] px-2.5 py-1 bg-[#F3EEF8]/60">
            <span className="font-bold">Floors:</span>
            <button
              type="button"
              onClick={() =>
                setConstructionConfig((p) => ({ ...p, floors: Math.max(1, p.floors - 1) }))
              }
              className="px-1.5 font-bold text-[#6E5A88]"
            >
              −
            </button>
            <span className="tabular-nums font-bold">{constructionConfig.floors}</span>
            <button
              type="button"
              onClick={() =>
                setConstructionConfig((p) => ({ ...p, floors: Math.min(6, p.floors + 1) }))
              }
              className="px-1.5 font-bold text-[#6E5A88]"
            >
              +
            </button>
          </div>

          <div className="inline-flex items-center gap-1 rounded-lg border border-[#CDC4DC] px-2.5 py-1 bg-[#F3EEF8]/60">
            <span className="font-bold">Beds:</span>
            <button
              type="button"
              onClick={() =>
                setConstructionConfig((p) => ({ ...p, bedrooms: Math.max(0, p.bedrooms - 1) }))
              }
              className="px-1.5 font-bold text-[#6E5A88]"
            >
              −
            </button>
            <span className="tabular-nums font-bold">{constructionConfig.bedrooms}</span>
            <button
              type="button"
              onClick={() =>
                setConstructionConfig((p) => ({ ...p, bedrooms: Math.min(15, p.bedrooms + 1) }))
              }
              className="px-1.5 font-bold text-[#6E5A88]"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={() => startNewProjectAtStep(5)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CDC4DC] bg-white font-bold text-[#261E31] hover:bg-[#CDC4DC]/30"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Adjust Budget / Rooms</span>
          </button>

          <button
            type="button"
            onClick={() => setView("assistant")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CDC4DC] bg-white font-bold text-[#6E5A88] hover:bg-[#F3EEF8]"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Ask AI Assistant</span>
          </button>

          <button
            type="button"
            onClick={handleRegenerateCycle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#CDC4DC]/50 font-bold text-[#261E31] hover:bg-[#CDC4DC]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Layout Option</span>
          </button>
        </div>
      </section>

      <TransparencyBanner
        title="Sample Data & Conceptual Design Notice"
        message={`Architectural visuals are clearly labelled reference images until an AI image API is connected. Construction budgets and material prices use sample regional averages (${landInfo.country}, ref ${constructionResult.referenceDate}) and sample exchange rates—never presented as verified contractor quotes.`}
      />

      {/* A. FINAL HOUSE DESIGN */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">A · Final House Design</p>
            <h3 className="text-2xl font-bold text-[#261E31]">{houseDesign.conceptTitle}</h3>
          </div>
          <div className="flex gap-1.5">
            {(
              [
                { id: "exterior", label: "Exterior Reference" },
                { id: "front", label: "Front Elevation" },
                { id: "side", label: "Side Elevation" },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setElevationTab(t.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  elevationTab === t.id
                    ? "bg-[#6E5A88] text-white"
                    : "bg-white border border-[#CDC4DC] text-[#261E31]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 bg-white rounded-2xl border border-[#CDC4DC] overflow-hidden">
            <div className="aspect-[16/9]">
              {elevationTab === "exterior" ? (
                <ArchitecturalImageFrame
                  src={houseDesign.referenceImage}
                  alt={`${houseDesign.conceptTitle} reference architectural visualization`}
                  fallback={<HouseElevationSVG variant={houseDesign.svgVariant} view="exterior" />}
                />
              ) : (
                <HouseElevationSVG variant={houseDesign.svgVariant} view={elevationTab} />
              )}
            </div>
            <div className="px-5 py-3 border-t border-[#CDC4DC] bg-[#F3EEF8]/60 text-xs text-[#4A3D5C] italic">
              {houseDesign.sourceLabel}
            </div>
          </div>

          <div className="xl:col-span-4 bg-white rounded-2xl border border-[#CDC4DC] p-6 space-y-4">
            <h4 className="text-base font-bold text-[#6E5A88]">Design Explanation &amp; Specs</h4>
            <p className="text-sm text-[#261E31] leading-relaxed">{houseDesign.narrative}</p>
            <div className="border-t border-[#CDC4DC] pt-3 space-y-2 text-xs">
              <p>
                <strong>Roof Design:</strong> {houseDesign.roofStyle}
              </p>
              <p>
                <strong>Exterior Colour:</strong> {houseDesignInput.exteriorColor}
              </p>
              <p>
                <strong>Window Style:</strong> {houseDesignInput.windowStyle}
              </p>
              <p>
                <strong>Balcony:</strong> {houseDesignInput.balconyDesign}
              </p>
            </div>
            <div className="border-t border-[#CDC4DC] pt-3">
              <p className="text-xs font-bold text-[#6E5A88] mb-1.5">Suggested Materials</p>
              <ul className="space-y-1 text-xs text-[#4A3D5C]">
                {houseDesign.suggestedMaterials.map((m, i) => (
                  <li key={i}>· {m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* B. FLOOR PLAN */}
      <section className="space-y-5 border-t border-[#CDC4DC] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">B · Conceptual Floor Plan</p>
            <h3 className="text-2xl font-bold text-[#261E31]">Proposed Floor-Wise Layout</h3>
            <p className="text-xs text-[#4A3D5C] mt-1">{floorPlanResult.disclaimer}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {floorPlanResult.options.map((opt, idx) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedPlanIndex(idx);
                  setActiveFloorIdx(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                  idx === selectedPlanIndex
                    ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                    : "bg-white text-[#261E31] border-[#CDC4DC]"
                }`}
              >
                {opt.name.split(":")[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 space-y-3">
            <div className="flex gap-2">
              {activePlan.floors.map((fl, idx) => (
                <button
                  key={fl.level}
                  type="button"
                  onClick={() => setActiveFloorIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${
                    activeFloorIdx === idx
                      ? "bg-[#6E5A88] text-white"
                      : "bg-white border border-[#CDC4DC] text-[#261E31]"
                  }`}
                >
                  {fl.level} ({fl.areaSqFt.toLocaleString()} sq. ft.)
                </button>
              ))}
            </div>
            {activeFloor && (
              <FloorPlanCanvas
                floorData={activeFloor}
                buildWidthFt={activePlan.buildWidthFt}
                buildDepthFt={activePlan.buildDepthFt}
              />
            )}
          </div>

          <div className="xl:col-span-4 bg-white rounded-2xl border border-[#CDC4DC] p-5 space-y-3">
            <h4 className="text-base font-bold text-[#261E31]">
              {activeFloor?.level} · Room Dimensions
            </h4>
            <div className="divide-y divide-[#CDC4DC]/60 text-xs">
              {activeFloor?.rooms.map((room, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <span className="font-bold text-[#261E31]">{room.name}</span>
                  <span className="text-[#6E5A88] font-bold tabular-nums">
                    {room.w}&apos; × {room.d}&apos; ({room.w * room.d} sq. ft.)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* C & F. CONSTRUCTION BUDGET & BUDGET RECOMMENDATIONS */}
      <section className="space-y-6 border-t border-[#CDC4DC] pt-10">
        <div>
          <p className="text-xs font-bold text-[#6E5A88]">C &amp; F · Construction Budget &amp; Advisory</p>
          <h3 className="text-2xl font-bold text-[#261E31]">
            Estimated Construction Budget ({currency})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-[#6E5A88] text-white p-5">
            <p className="text-xs text-[#CDC4DC]">Expected Estimate</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1 tabular-nums">
              {formatCurrency(constructionResult.expectedBudget, currency)}
            </p>
            <p className="text-xs text-[#F3EEF8]/85 mt-1.5 tabular-nums">
              Target: {formatCurrency(constructionConfig.targetBudget, currency)}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#CDC4DC] p-5">
            <p className="text-xs text-[#4A3D5C]">Minimum Estimate</p>
            <p className="text-2xl font-bold text-[#261E31] mt-1 tabular-nums">
              {formatCurrency(constructionResult.minBudget, currency)}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#CDC4DC] p-5">
            <p className="text-xs text-[#4A3D5C]">Maximum Estimate</p>
            <p className="text-2xl font-bold text-[#261E31] mt-1 tabular-nums">
              {formatCurrency(constructionResult.maxBudget, currency)}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#CDC4DC] p-5">
            <p className="text-xs text-[#4A3D5C]">Cost per Sq. Ft.</p>
            <p className="text-2xl font-bold text-[#6E5A88] mt-1 tabular-nums">
              {formatCurrency(constructionResult.costPerSqFt, currency)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-7 bg-white rounded-2xl border border-[#CDC4DC] overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-[#CDC4DC]/35 text-xs text-[#6E5A88] border-b border-[#CDC4DC]">
                  <th className="py-3 px-5">Expense Category</th>
                  <th className="py-3 px-4 text-right">Share</th>
                  <th className="py-3 px-5 text-right">Estimate ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CDC4DC]/55">
                {constructionResult.itemized.map((row) => (
                  <tr key={row.key}>
                    <td className="py-3 px-5 font-bold text-[#261E31]">{row.label}</td>
                    <td className="py-3 px-4 text-right text-xs text-[#4A3D5C] tabular-nums">
                      {row.sharePct}%
                    </td>
                    <td className="py-3 px-5 text-right font-bold text-[#6E5A88] tabular-nums">
                      {formatCurrency(row.amount, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="xl:col-span-5 space-y-5">
            <div className="bg-white rounded-2xl border border-[#CDC4DC] p-5">
              <h4 className="text-sm font-bold text-[#261E31] mb-3">Cost Allocation</h4>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={constructionResult.groupDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={48}
                      outerRadius={82}
                      paddingAngle={2}
                    >
                      {constructionResult.groupDistribution.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(Number(val), currency)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl bg-[#CDC4DC]/35 border border-[#CDC4DC] p-5 space-y-2.5">
              <h4 className="text-sm font-bold text-[#6E5A88]">Budget Recommendations</h4>
              {constructionResult.recommendations.map((rec, i) => (
                <p key={i} className="text-xs text-[#261E31] leading-relaxed">
                  · {rec}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* D. MATERIAL ESTIMATION */}
      <section className="space-y-4 border-t border-[#CDC4DC] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">D · Engineering Materials</p>
            <h3 className="text-2xl font-bold text-[#261E31]">
              Material Quantities &amp; Sample Unit Rates
            </h3>
            <p className="text-xs text-[#4A3D5C] mt-1">
              Sample regional rates ({materialResult.region}, ref {materialResult.referenceDate}).
              Edit any unit price below to match local vendor quotes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaterialSettings((p) => ({ ...p, customUnitPrices: {} }))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#CDC4DC] bg-white text-xs font-bold text-[#6E5A88]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sample Rates</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#CDC4DC] overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#CDC4DC]/35 text-xs text-[#6E5A88] border-b border-[#CDC4DC]">
                <th className="py-3 px-5">Material</th>
                <th className="py-3 px-4">Specification</th>
                <th className="py-3 px-4 text-right">Quantity</th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4 text-right">Sample Unit Price ({currency})</th>
                <th className="py-3 px-5 text-right">Total Estimated Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CDC4DC]/55">
              {materialResult.items.map((item) => (
                <tr key={item.key}>
                  <td className="py-3 px-5 font-bold text-[#261E31]">{item.name}</td>
                  <td className="py-3 px-4">
                    <select
                      value={item.spec}
                      onChange={(e) =>
                        setMaterialSettings((p) => ({
                          ...p,
                          specs: { ...p.specs, [item.key]: e.target.value },
                        }))
                      }
                      className="rounded-lg border border-[#CDC4DC] px-2.5 py-1 text-xs bg-white"
                    >
                      {item.specOptions.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-right font-bold tabular-nums">
                    {item.quantity.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[#4A3D5C]">{item.unit}</td>
                  <td className="py-3 px-4 text-right">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={
                        materialSettings.customUnitPrices[item.key] !== undefined
                          ? materialSettings.customUnitPrices[item.key]
                          : item.unitPrice
                      }
                      onChange={(e) =>
                        setMaterialSettings((p) => ({
                          ...p,
                          customUnitPrices: { ...p.customUnitPrices, [item.key]: e.target.value },
                        }))
                      }
                      className="w-24 text-right rounded-lg border border-[#CDC4DC] px-2 py-1 text-xs bg-[#F3EEF8]/50 tabular-nums"
                    />
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-[#6E5A88] tabular-nums">
                    {formatCurrency(item.totalPrice, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#6E5A88] text-white font-bold">
                <td colSpan={5} className="py-3.5 px-5 text-right text-sm">
                  Total Material Estimate ({currency})
                </td>
                <td className="py-3.5 px-5 text-right text-base tabular-nums">
                  {formatCurrency(materialResult.totalMaterialCost, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* E. INTERIOR SUGGESTIONS */}
      <section className="space-y-5 border-t border-[#CDC4DC] pt-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">E · Interior Suggestions</p>
            <h3 className="text-2xl font-bold text-[#261E31]">Room-by-Room Interior Direction</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Living Room", "Bedroom", "Kitchen", "Bathroom"].map((room) => (
              <button
                key={room}
                type="button"
                onClick={() => setInteriorRoom(room)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border ${
                  interiorRoom === room
                    ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                    : "bg-white text-[#261E31] border-[#CDC4DC]"
                }`}
              >
                {room}
              </button>
            ))}
            <select
              value={interiorStyle}
              onChange={(e) => setInteriorStyle(e.target.value)}
              aria-label="Select Interior Style"
              className="rounded-lg border border-[#CDC4DC] px-3 py-1.5 text-xs bg-white font-bold"
            >
              {INTERIOR_STYLES.map((st) => (
                <option key={st} value={st}>
                  {st} Style
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#CDC4DC] overflow-hidden">
            <div className="aspect-[16/9]">
              {interiorRoom === "Living Room" && interiorStyle === "Modern" ? (
                <ArchitecturalImageFrame
                  src={DESIGN_IMAGE_ASSETS.interiorLiving}
                  alt="Modern living room interior reference preview"
                  fallback={<InteriorRoomSVG roomType={interiorRoom} swatches={interiorPreview.swatches} />}
                />
              ) : (
                <InteriorRoomSVG roomType={interiorRoom} swatches={interiorPreview.swatches} />
              )}
            </div>
            <div className="px-5 py-3 border-t border-[#CDC4DC] text-xs text-[#4A3D5C] italic">
              {interiorPreview.sourceLabel}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CDC4DC] p-6 space-y-4">
            <h4 className="text-base font-bold text-[#261E31]">{interiorPreview.conceptName}</h4>
            <p className="text-sm text-[#4A3D5C] leading-relaxed">{interiorPreview.notes}</p>
            <ul className="space-y-1.5 text-xs text-[#261E31]">
              {interiorPreview.furnitureList.map((f, i) => (
                <li key={i}>· {f}</li>
              ))}
            </ul>
            <div className="pt-2 border-t border-[#CDC4DC] flex items-center justify-between text-xs">
              <span className="text-[#4A3D5C]">Indicative Room Fit-Out</span>
              <span className="font-bold text-[#6E5A88] tabular-nums">
                {formatCurrency(interiorPreview.estimatedRoomCost, currency)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* G. BEFORE AND AFTER DESIGN COMPARISON */}
      <section className="space-y-6 border-t border-[#CDC4DC] pt-10">
        <div>
          <p className="text-xs font-bold text-[#6E5A88]">
            G · Before &amp; After Transformation Comparison
          </p>
          <h3 className="text-2xl font-bold text-[#261E31]">
            Your Original Idea vs. Proposed Architectural Concept
          </h3>
        </div>

        {/* Interactive Draggable Slider */}
        <BeforeAfterSlider
          beforeLabel={`Before · Empty Plot (${landInfo.landArea} ${landInfo.landUnit})`}
          afterLabel={`After · ${houseDesign.conceptTitle}`}
          beforeContent={
            <ArchitecturalImageFrame
              src={DESIGN_IMAGE_ASSETS.emptyLand}
              alt="Empty land starting site"
              fallback={<EmptyLandSVG />}
            />
          }
          afterContent={
            <ArchitecturalImageFrame
              src={houseDesign.referenceImage}
              alt="Completed proposed residence visualization"
              fallback={<HouseElevationSVG variant={houseDesign.svgVariant} view="exterior" />}
            />
          }
        />

        {/* Original Idea vs Improved Concept (with user acceptance control) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#CDC4DC] p-6 space-y-3">
            <p className="text-xs font-bold text-[#4A3D5C]">BEFORE · Original User Idea</p>
            <p className="text-sm text-[#261E31] leading-relaxed italic">
              &ldquo;{houseDesign.originalIdeaSummary}&rdquo;
            </p>
            <div className="pt-3 border-t border-[#CDC4DC] text-xs text-[#4A3D5C] space-y-1">
              <p>
                <strong>Starting Site:</strong> Undeveloped plot ({constructionResult.landAreaSqFt.toLocaleString()}{" "}
                sq. ft.)
              </p>
              <p>
                <strong>Target Budget:</strong>{" "}
                {formatCurrency(constructionConfig.targetBudget, currency)}
              </p>
            </div>
          </div>

          <div className="bg-[#CDC4DC]/30 rounded-2xl border border-[#6E5A88]/40 p-6 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-[#6E5A88]">AFTER · Suggested Improved Concept</p>
              <button
                type="button"
                onClick={() => setAcceptedImprovement((v) => !v)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  acceptedImprovement
                    ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                    : "bg-white text-[#261E31] border-[#CDC4DC]"
                }`}
              >
                {acceptedImprovement ? "Suggestion Accepted" : "Accept Suggestion"}
              </button>
            </div>
            <p className="text-sm text-[#261E31] leading-relaxed">
              &ldquo;{houseDesign.improvedConceptSummary}&rdquo;
            </p>
            <div className="pt-3 border-t border-[#CDC4DC] text-xs text-[#261E31] space-y-1">
              <p>
                <strong>Proposed Layout:</strong> {activePlan?.name} ({activePlan?.totalBuiltUpSqFt.toLocaleString()}{" "}
                sq. ft.)
              </p>
              <p>
                <strong>Estimated Budget:</strong>{" "}
                {formatCurrency(constructionResult.expectedBudget, currency)} (
                {constructionResult.budgetStatus === "within"
                  ? "Within Target"
                  : "Above Target — see recommendations"}
                )
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
