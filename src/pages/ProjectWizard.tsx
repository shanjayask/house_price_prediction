import React from "react";
import { ArrowLeft, ArrowRight, Check, Building2, Home, Layers, Landmark, Hotel, Building, Briefcase } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { LAND_UNITS, convertToSqFt } from "../utils/unitConversion";
import { BUILDING_TYPES, COUNTRIES, QUALITY_TIERS, RATE_REFERENCE_DATE } from "../data/regionalRates";
import { STYLE_GALLERY } from "../data/designPresets";
import { CURRENCIES, EXCHANGE_RATE_REFERENCE_DATE, formatCurrency, type CurrencyCode } from "../services/currencyService";
import { ArchitecturalImageFrame, HouseElevationSVG } from "../components/visuals/ArchitecturalIllustrations";
import TransparencyBanner from "../components/common/TransparencyBanner";

const BUILDING_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Independent House": Home,
  Apartment: Building2,
  "Duplex House": Layers,
  Villa: Landmark,
  "Luxury Villa": Hotel,
  "Residential Building": Building,
  "Commercial Building": Briefcase,
};

export default function ProjectWizard() {
  const {
    wizardStep,
    setWizardStep,
    setView,
    landInfo,
    setLandInfo,
    constructionConfig,
    setConstructionConfig,
    houseDesignInput,
    setHouseDesignInput,
    currency,
    setCurrency,
    constructionResult,
  } = useProject();

  const activeCountry = COUNTRIES.find((c) => c.id === landInfo.country) || COUNTRIES[0];
  const convertedLandSqFt = convertToSqFt(landInfo.landArea, landInfo.landUnit);

  const isApartmentLike =
    constructionConfig.buildingType === "Apartment" ||
    constructionConfig.buildingType === "Residential Building";
  const isCommercial = constructionConfig.buildingType === "Commercial Building";

  const handleDimensionChange = (field: "landLength" | "landWidth", value: string) => {
    const nextLand = { ...landInfo, [field]: value };
    const l = parseFloat(nextLand.landLength);
    const w = parseFloat(nextLand.landWidth);
    if (!Number.isNaN(l) && !Number.isNaN(w) && l > 0 && w > 0) {
      nextLand.landArea = Math.round(l * w);
      nextLand.landUnit = "sqft";
    }
    setLandInfo(nextLand);
  };

  const handleSelectBuildingType = (b: (typeof BUILDING_TYPES)[number]) => {
    const suggestedBuiltUp = Math.round(
      Math.max(600, convertedLandSqFt) * (b.defaultCoverage / 100) * b.defaultFloors
    );
    setConstructionConfig({
      ...constructionConfig,
      buildingType: b.id,
      plotCoveragePct: b.defaultCoverage,
      floors: b.defaultFloors,
      bedrooms: b.defaultBedrooms,
      bathrooms: b.defaultBathrooms,
      expectedBuiltUpArea: suggestedBuiltUp,
      hasLift: b.defaultFloors >= 3 || b.id === "Luxury Villa",
      hasGarden: b.id === "Villa" || b.id === "Luxury Villa" || b.id === "Independent House",
      hasSwimmingPool: b.id === "Luxury Villa",
    });
  };

  const stepLabels = [
    { num: 1, label: "Land Details" },
    { num: 2, label: "Building Type" },
    { num: 3, label: "House Requirements" },
    { num: 4, label: "Architecture Style" },
    { num: 5, label: "Budget" },
    { num: 6, label: "Summary & AI" },
  ];

  const adjustCount = (
    key:
      | "floors"
      | "apartmentUnits"
      | "officeSpaces"
      | "bedrooms"
      | "masterBedrooms"
      | "bathrooms"
      | "attachedBathrooms"
      | "kitchens"
      | "livingRooms"
      | "diningRooms"
      | "balconies"
      | "studyRooms"
      | "guestRooms"
      | "storageRooms",
    delta: number,
    min = 0,
    max = 40
  ) => {
    setConstructionConfig((prev) => ({
      ...prev,
      [key]: Math.max(min, Math.min(max, Number(prev[key]) + delta)),
    }));
  };

  const goNext = () => {
    if (wizardStep < 5) {
      setWizardStep(wizardStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setView("summary");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setView("landing");
    }
  };

  return (
    <div className="space-y-8 animate-editorial">
      {/* Progress Indicator */}
      <div className="bg-white rounded-2xl border border-[#CDC4DC] p-4 sm:p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stepLabels.map((s) => {
            const isCurrent = wizardStep === s.num;
            const isCompleted = wizardStep > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num === 6) {
                    setView("summary");
                  } else {
                    setWizardStep(s.num);
                  }
                }}
                className={`text-left px-3 py-2.5 rounded-xl border text-xs transition-colors ${
                  isCurrent
                    ? "bg-[#6E5A88] text-white border-[#6E5A88] font-bold"
                    : isCompleted
                    ? "bg-[#CDC4DC]/40 text-[#261E31] border-[#CDC4DC] font-bold"
                    : "bg-[#F3EEF8]/60 text-[#4A3D5C] border-[#CDC4DC]/60"
                }`}
              >
                <span className="block text-[11px] opacity-80 tabular-nums">Step {s.num}</span>
                <span className="block truncate">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: LAND DETAILS */}
      {wizardStep === 1 && (
        <div className="bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">Step 1 · Site Foundation</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
              First, tell us about your land.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">Land Area</label>
              <input
                type="number"
                min="1"
                step="any"
                value={landInfo.landArea}
                onChange={(e) => setLandInfo({ ...landInfo, landArea: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Measurement Unit
              </label>
              <select
                value={landInfo.landUnit}
                onChange={(e) => setLandInfo({ ...landInfo, landUnit: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {LAND_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.label}
                  </option>
                ))}
              </select>
              <p className="text-xs font-bold text-[#6E5A88] mt-1.5 tabular-nums">
                Land area: {convertedLandSqFt.toLocaleString()} sq.ft.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                  Length (ft, optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="60"
                  value={landInfo.landLength}
                  onChange={(e) => handleDimensionChange("landLength", e.target.value)}
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2.5 text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                  Width (ft, optional)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="40"
                  value={landInfo.landWidth}
                  onChange={(e) => handleDimensionChange("landWidth", e.target.value)}
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2.5 text-sm tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">Country</label>
              <select
                value={landInfo.country}
                onChange={(e) => {
                  const next = COUNTRIES.find((c) => c.id === e.target.value) || COUNTRIES[0];
                  setLandInfo({ ...landInfo, country: next.id, state: next.states[0] });
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
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">State</label>
              <select
                value={landInfo.state}
                onChange={(e) => setLandInfo({ ...landInfo, state: e.target.value })}
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
                value={landInfo.city}
                onChange={(e) => setLandInfo({ ...landInfo, city: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Location / Neighbourhood
              </label>
              <input
                type="text"
                value={landInfo.locationNotes}
                onChange={(e) => setLandInfo({ ...landInfo, locationNotes: e.target.value })}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: BUILDING TYPE */}
      {wizardStep === 2 && (
        <div className="bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">Step 2 · Typology Selection</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
              What would you like to build on your land?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BUILDING_TYPES.map((b) => {
              const selected = constructionConfig.buildingType === b.id;
              const Icon = BUILDING_ICONS[b.id] || Home;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBuildingType(b)}
                  className={`text-left p-5 rounded-2xl border transition-colors flex flex-col justify-between ${
                    selected
                      ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                      : "bg-[#F3EEF8]/60 text-[#261E31] border-[#CDC4DC] hover:bg-[#CDC4DC]/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-6 h-6 ${selected ? "text-white" : "text-[#6E5A88]"}`} />
                      {selected && <Check className="w-4 h-4" />}
                    </div>
                    <p className="text-base font-bold">{b.label}</p>
                    <p
                      className={`text-xs mt-1.5 leading-relaxed ${
                        selected ? "text-[#F3EEF8]/90" : "text-[#4A3D5C]"
                      }`}
                    >
                      {b.summary}
                    </p>
                  </div>
                  <p
                    className={`text-xs font-bold mt-4 tabular-nums ${
                      selected ? "text-[#CDC4DC]" : "text-[#6E5A88]"
                    }`}
                  >
                    {b.tag} · {b.defaultCoverage}% plot coverage
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: HOUSE REQUIREMENTS */}
      {wizardStep === 3 && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8 bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 space-y-8">
            <div>
              <p className="text-xs font-bold text-[#6E5A88]">
                Step 3 · Dynamic Program ({constructionConfig.buildingType})
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
                Tell us how you want your house to look and function.
              </h2>
            </div>

            {/* Building Info & Plot Coverage Separation */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#261E31] border-b border-[#CDC4DC] pb-2">
                Building Information &amp; Setback Coverage
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                    Number of Floors
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={constructionConfig.floors}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        floors: Math.max(1, Number(e.target.value)),
                      })
                    }
                    className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                    Plot Coverage (% after setbacks)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="85"
                    value={constructionConfig.plotCoveragePct}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        plotCoveragePct: Math.min(85, Math.max(20, Number(e.target.value))),
                      })
                    }
                    className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                    Total Built-Up Area (sq. ft.)
                  </label>
                  <input
                    type="number"
                    min="200"
                    value={constructionConfig.expectedBuiltUpArea}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        expectedBuiltUpArea: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm tabular-nums"
                  />
                </div>
              </div>

              {isApartmentLike && (
                <div className="rounded-xl bg-[#F3EEF8] border border-[#CDC4DC] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                      Number of Apartment Units
                    </label>
                    <input
                      type="number"
                      min="2"
                      value={constructionConfig.apartmentUnits}
                      onChange={(e) =>
                        setConstructionConfig({
                          ...constructionConfig,
                          apartmentUnits: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm bg-white tabular-nums"
                    />
                  </div>
                  <p className="text-xs text-[#4A3D5C] self-center">
                    Room counts below represent configuration per residential unit across{" "}
                    {constructionConfig.floors} floor(s).
                  </p>
                </div>
              )}

              {isCommercial && (
                <div className="rounded-xl bg-[#F3EEF8] border border-[#CDC4DC] p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                      Office Suites / Work Zones
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={constructionConfig.officeSpaces}
                      onChange={(e) =>
                        setConstructionConfig({
                          ...constructionConfig,
                          officeSpaces: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm bg-white tabular-nums"
                    />
                  </div>
                  <p className="text-xs text-[#4A3D5C] self-center">
                    Commercial configuration prioritizes open floor spans, washrooms, lift cores,
                    and visitor parking.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                    Ground Floor Configuration
                  </label>
                  <input
                    type="text"
                    value={constructionConfig.groundFloorConfig}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        groundFloorConfig: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                    First Floor Configuration
                  </label>
                  <input
                    type="text"
                    value={constructionConfig.firstFloorConfig}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        firstFloorConfig: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                    Additional Floors / Terrace
                  </label>
                  <input
                    type="text"
                    value={constructionConfig.additionalFloorsConfig}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        additionalFloorsConfig: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Room Configuration Counters */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#261E31] border-b border-[#CDC4DC] pb-2">
                {isApartmentLike ? "Rooms per Unit Configuration" : "Room Configuration"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(
                  [
                    { key: "bedrooms", label: "Bedrooms", min: 0 },
                    { key: "masterBedrooms", label: "Master Bedrooms", min: 0 },
                    { key: "bathrooms", label: "Bathrooms", min: 1 },
                    { key: "attachedBathrooms", label: "Attached Bathrooms", min: 0 },
                    { key: "kitchens", label: "Kitchens", min: 0 },
                    { key: "livingRooms", label: "Living Rooms", min: 0 },
                    { key: "diningRooms", label: "Dining Rooms", min: 0 },
                    { key: "balconies", label: "Balconies", min: 0 },
                    { key: "studyRooms", label: "Study Rooms", min: 0 },
                    { key: "guestRooms", label: "Guest Rooms", min: 0 },
                    { key: "storageRooms", label: "Storage Rooms", min: 0 },
                  ] as const
                ).map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between rounded-xl border border-[#CDC4DC] bg-[#F3EEF8]/50 px-3.5 py-2.5"
                  >
                    <span className="text-xs font-bold text-[#261E31]">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => adjustCount(item.key, -1, item.min)}
                        className="w-7 h-7 rounded-lg border border-[#CDC4DC] bg-white text-[#6E5A88] font-bold"
                        aria-label={`Decrease ${item.label}`}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold tabular-nums">
                        {constructionConfig[item.key]}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustCount(item.key, 1, item.min)}
                        className="w-7 h-7 rounded-lg border border-[#CDC4DC] bg-white text-[#6E5A88] font-bold"
                        aria-label={`Increase ${item.label}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Facilities */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#261E31] border-b border-[#CDC4DC] pb-2">
                Additional Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(
                  [
                    { key: "hasCarParking", label: "Car Parking" },
                    { key: "hasGarden", label: "Garden" },
                    { key: "hasSwimmingPool", label: "Swimming Pool" },
                    { key: "hasTerrace", label: "Terrace" },
                    { key: "hasHomeTheatre", label: "Home Theatre" },
                    { key: "hasLift", label: "Lift / Elevator" },
                    { key: "hasUtilityRoom", label: "Utility Room" },
                    { key: "hasOutdoorSeating", label: "Outdoor Seating" },
                  ] as const
                ).map((fac) => {
                  const active = constructionConfig[fac.key];
                  return (
                    <button
                      key={fac.key}
                      type="button"
                      onClick={() =>
                        setConstructionConfig({ ...constructionConfig, [fac.key]: !active })
                      }
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-colors ${
                        active
                          ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                          : "bg-white text-[#261E31] border-[#CDC4DC]"
                      }`}
                    >
                      <span>{fac.label}</span>
                      {active && <Check className="w-3.5 h-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Requirements Summary */}
          <aside className="xl:col-span-4 bg-[#CDC4DC]/35 rounded-2xl border border-[#CDC4DC] p-6 space-y-4 sticky top-24">
            <h3 className="text-base font-bold text-[#6E5A88]">Live Requirements Summary</h3>
            <div className="divide-y divide-[#CDC4DC] text-xs space-y-2">
              <div className="pt-2 flex justify-between">
                <span className="text-[#4A3D5C]">Plot Size</span>
                <span className="font-bold tabular-nums">
                  {convertedLandSqFt.toLocaleString()} sq. ft.
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#4A3D5C]">
                  Max Footprint ({constructionConfig.plotCoveragePct}%)
                </span>
                <span className="font-bold tabular-nums">
                  {constructionResult.maxGroundFootprintSqFt.toLocaleString()} sq. ft.
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#4A3D5C]">Target Built-Up</span>
                <span className="font-bold text-[#6E5A88] tabular-nums">
                  {constructionResult.effectiveBuiltUpSqFt.toLocaleString()} sq. ft.
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#4A3D5C]">Building / Floors</span>
                <span className="font-bold">
                  {constructionConfig.buildingType} · {constructionConfig.floors}F
                </span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-[#4A3D5C]">Core Rooms</span>
                <span className="font-bold tabular-nums">
                  {constructionConfig.bedrooms} Bed · {constructionConfig.bathrooms} Bath ·{" "}
                  {constructionConfig.kitchens} Kit
                </span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* STEP 4: ARCHITECTURAL STYLE */}
      {wizardStep === 4 && (
        <div className="bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 space-y-8">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">Step 4 · Architectural Identity</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
              Which architectural style matches your dream home?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STYLE_GALLERY.map((style) => {
              const selected = houseDesignInput.style === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() =>
                    setHouseDesignInput({
                      ...houseDesignInput,
                      style: style.id,
                      roofStyle: style.defaultRoof,
                      preferredMaterials: style.defaultMaterials,
                      exteriorColor: style.defaultColor,
                    })
                  }
                  className={`text-left rounded-2xl border overflow-hidden transition-colors flex flex-col ${
                    selected
                      ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                      : "bg-[#F3EEF8]/60 text-[#261E31] border-[#CDC4DC] hover:bg-[#CDC4DC]/40"
                  }`}
                >
                  <div className="aspect-[4/3] w-full bg-white">
                    <ArchitecturalImageFrame
                      src={style.image}
                      alt={`${style.id} style reference`}
                      fallback={<HouseElevationSVG variant={style.svgVariant} view="exterior" />}
                    />
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold">{style.id}</p>
                      {selected && <Check className="w-4 h-4 shrink-0" />}
                    </div>
                    <p
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        selected ? "text-[#F3EEF8]/90" : "text-[#4A3D5C]"
                      }`}
                    >
                      {style.tagline}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Describe Your Preferred Exterior &amp; Dream Home in Your Own Words
              </label>
              <textarea
                rows={3}
                value={houseDesignInput.prompt}
                onChange={(e) => setHouseDesignInput({ ...houseDesignInput, prompt: e.target.value })}
                className="w-full rounded-xl border border-[#CDC4DC] px-4 py-3 text-sm bg-[#F3EEF8]/40"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">Roof Design</label>
                <input
                  type="text"
                  value={houseDesignInput.roofStyle}
                  onChange={(e) =>
                    setHouseDesignInput({ ...houseDesignInput, roofStyle: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                  Exterior Colour
                </label>
                <input
                  type="text"
                  value={houseDesignInput.exteriorColor}
                  onChange={(e) =>
                    setHouseDesignInput({ ...houseDesignInput, exteriorColor: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">Window Style</label>
                <input
                  type="text"
                  value={houseDesignInput.windowStyle}
                  onChange={(e) =>
                    setHouseDesignInput({ ...houseDesignInput, windowStyle: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                  Balcony Design
                </label>
                <input
                  type="text"
                  value={houseDesignInput.balconyDesign}
                  onChange={(e) =>
                    setHouseDesignInput({ ...houseDesignInput, balconyDesign: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">
                  Exterior Materials
                </label>
                <input
                  type="text"
                  value={houseDesignInput.preferredMaterials}
                  onChange={(e) =>
                    setHouseDesignInput({
                      ...houseDesignInput,
                      preferredMaterials: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6E5A88] mb-1">Garden Style</label>
                <input
                  type="text"
                  value={houseDesignInput.gardenStyle}
                  onChange={(e) =>
                    setHouseDesignInput({ ...houseDesignInput, gardenStyle: e.target.value })
                  }
                  className="w-full rounded-lg border border-[#CDC4DC] px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: CONSTRUCTION BUDGET */}
      {wizardStep === 5 && (
        <div className="bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs font-bold text-[#6E5A88]">Step 5 · Budget &amp; Quality</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
              What is your estimated construction budget?
            </h2>
          </div>

          <TransparencyBanner
            title="Sample Regional & Exchange Rate Notice"
            message={`Calculations use sample regional construction baselines (${landInfo.country}, ref ${RATE_REFERENCE_DATE}) and sample exchange rates (ref ${EXCHANGE_RATE_REFERENCE_DATE})—never claimed as live market quotations.`}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {Object.values(CURRENCIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} ({c.symbol}) — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Target Budget Amount ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={constructionConfig.targetBudget}
                onChange={(e) =>
                  setConstructionConfig({
                    ...constructionConfig,
                    targetBudget: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm tabular-nums"
              />
              <p className="text-xs text-[#4A3D5C] mt-1 tabular-nums">
                Formatted: {formatCurrency(constructionConfig.targetBudget, currency)}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6E5A88] mb-1.5">
                Budget Category
              </label>
              <select
                value={constructionConfig.budgetCategory}
                onChange={(e) =>
                  setConstructionConfig({
                    ...constructionConfig,
                    budgetCategory: e.target.value as
                      | "Budget-friendly"
                      | "Standard"
                      | "Premium"
                      | "Luxury",
                  })
                }
                className="w-full rounded-lg border border-[#CDC4DC] px-3.5 py-2.5 text-sm bg-white"
              >
                {["Budget-friendly", "Standard", "Premium", "Luxury"].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#6E5A88]">
              Preferred Construction Quality
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(QUALITY_TIERS).map((tier) => {
                const active = constructionConfig.quality === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() =>
                      setConstructionConfig({ ...constructionConfig, quality: tier.id })
                    }
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      active
                        ? "bg-[#6E5A88] text-white border-[#6E5A88]"
                        : "bg-[#F3EEF8]/60 text-[#261E31] border-[#CDC4DC]"
                    }`}
                  >
                    <p className="text-sm font-bold">{tier.label}</p>
                    <p
                      className={`text-xs mt-1 ${
                        active ? "text-[#F3EEF8]/90" : "text-[#4A3D5C]"
                      }`}
                    >
                      {tier.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#6E5A88]">
              Budget Scope Includes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(
                [
                  { key: "materials", label: "Materials" },
                  { key: "labour", label: "Labour" },
                  { key: "architectureFees", label: "Architecture & Eng. Fees" },
                  { key: "interiorDesign", label: "Interior Design" },
                  { key: "additionalExpenses", label: "Additional Expenses" },
                ] as const
              ).map((inc) => (
                <label
                  key={inc.key}
                  className="flex items-center gap-2.5 rounded-xl border border-[#CDC4DC] bg-[#F3EEF8]/50 px-3.5 py-2.5 text-xs font-bold text-[#261E31]"
                >
                  <input
                    type="checkbox"
                    checked={constructionConfig.budgetInclusions[inc.key]}
                    onChange={(e) =>
                      setConstructionConfig({
                        ...constructionConfig,
                        budgetInclusions: {
                          ...constructionConfig.budgetInclusions,
                          [inc.key]: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 accent-[#6E5A88]"
                  />
                  <span>{inc.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#CDC4DC] bg-white text-sm font-bold text-[#261E31] hover:bg-[#CDC4DC]/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{wizardStep === 1 ? "Back to Home" : "Previous Step"}</span>
        </button>

        <button
          type="button"
          onClick={goNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6E5A88] text-white text-sm font-bold hover:opacity-95"
        >
          <span>{wizardStep === 5 ? "Review Project Summary" : "Save & Continue"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
