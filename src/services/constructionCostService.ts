import { BUILDING_TYPES, COUNTRIES, QUALITY_TIERS, RATE_REFERENCE_DATE } from "../data/regionalRates";
import { convertToSqFt } from "../utils/unitConversion";
import { convertFromUsd, formatCurrency, type CurrencyCode } from "./currencyService";

export interface ConstructionSpecs {
  foundation: string;
  roofing: string;
  flooring: string;
  wallFinish: string;
  doors: string;
  windows: string;
  electrical: string;
  plumbing: string;
  interiorFinishing: string;
  exteriorFinishing: string;
}

export interface BudgetInclusions {
  materials: boolean;
  labour: boolean;
  architectureFees: boolean;
  interiorDesign: boolean;
  additionalExpenses: boolean;
}

export interface ConstructionCostInput {
  landArea: number | string;
  landUnit: string;
  country: string;
  state: string;
  city: string;
  locationNotes: string;
  buildingType: string;
  floors: number;
  apartmentUnits: number;
  officeSpaces: number;
  groundFloorConfig: string;
  firstFloorConfig: string;
  additionalFloorsConfig: string;
  bedrooms: number;
  masterBedrooms: number;
  bathrooms: number;
  attachedBathrooms: number;
  kitchens: number;
  livingRooms: number;
  diningRooms: number;
  balconies: number;
  studyRooms: number;
  guestRooms: number;
  storageRooms: number;
  hasCarParking: boolean;
  hasGarden: boolean;
  hasSwimmingPool: boolean;
  hasTerrace: boolean;
  hasHomeTheatre: boolean;
  hasLift: boolean;
  hasUtilityRoom: boolean;
  hasOutdoorSeating: boolean;
  plotCoveragePct: number;
  expectedBuiltUpArea: number;
  quality: "basic" | "standard" | "premium" | "luxury";
  targetBudget: number;
  budgetCategory: "Budget-friendly" | "Standard" | "Premium" | "Luxury";
  budgetInclusions: BudgetInclusions;
  specs: ConstructionSpecs;
}

export interface CostBreakdownItem {
  key: string;
  label: string;
  group: string;
  amount: number;
  sharePct: number;
}

export interface ConstructionCostResult {
  referenceDate: string;
  landAreaSqFt: number;
  maxGroundFootprintSqFt: number;
  maxPermissibleBuiltUpSqFt: number;
  effectiveBuiltUpSqFt: number;
  exceedsPlotCoverage: boolean;
  expectedBudget: number;
  minBudget: number;
  maxBudget: number;
  costPerSqFt: number;
  itemized: CostBreakdownItem[];
  groupDistribution: { name: string; value: number }[];
  budgetStatus: "within" | "slightly_above" | "over";
  budgetDifference: number;
  recommendations: string[];
  assumptions: string[];
}

export const SPEC_MODIFIERS: Record<string, Record<string, number>> = {
  foundation: { "Isolated Footing": 1.0, "Raft / Mat Foundation": 1.06, "Deep Pile Foundation": 1.13 },
  roofing: { "RCC Flat Slab": 1.0, "Sloped Clay Tile Roof": 1.05, "Insulated Metal / Cool Roof": 1.04 },
  flooring: { "Vitrified Ceramic": 1.0, "Engineered Hardwood": 1.07, "Natural Marble / Granite": 1.12 },
  wallFinish: { "Acrylic Putty & Emulsion": 1.0, "Textured Stucco & Lime Wash": 1.03, "Stone Cladding Accent": 1.08 },
  doors: { "Flush / Engineered Wood": 1.0, "Solid Teak / Oak": 1.06, "Acoustic Designer Core": 1.05 },
  windows: { "Powder-Coated Aluminium": 1.0, "uPVC Double Glazed": 1.04, "Thermal-Break Architectural": 1.09 },
  electrical: { "Standard Modular Concealed": 1.0, "Surge-Protected + Solar Ready": 1.04, "KNX Smart Home Automation": 1.09 },
  plumbing: { "Standard CPVC / PPR": 1.0, "Concealed Cisterns & Pressurized": 1.04, "Rainwater Harvesting + Greywater": 1.07 },
  interiorFinishing: { "Clean Minimalist Finish": 1.0, "False Ceiling & Cove Lighting": 1.06, "Bespoke Millwork & Veneers": 1.12 },
  exteriorFinishing: { "Weatherproof Exterior Coat": 1.0, "Architectural Louvers & Plaster": 1.05, "Curtain Glazing & Cladding": 1.11 },
};

export function calculateConstructionCostSync(
  config: ConstructionCostInput,
  currencyCode: CurrencyCode
): ConstructionCostResult {
  const landAreaSqFt = convertToSqFt(config.landArea, config.landUnit);
  const coveragePct = Math.min(85, Math.max(20, Number(config.plotCoveragePct) || 55));
  const floors = Math.max(1, Number(config.floors) || 1);
  const maxGroundFootprintSqFt = Math.round(landAreaSqFt * (coveragePct / 100));
  const maxPermissibleBuiltUpSqFt = maxGroundFootprintSqFt * floors;

  const requestedBuiltUp = Number(config.expectedBuiltUpArea) || 0;
  const effectiveBuiltUpSqFt = requestedBuiltUp > 0 ? requestedBuiltUp : maxPermissibleBuiltUpSqFt;

  const countryMeta = COUNTRIES.find((c) => c.id === config.country) || COUNTRIES[0];
  const buildingMeta = BUILDING_TYPES.find((b) => b.id === config.buildingType) || BUILDING_TYPES[0];
  const qualityMeta = QUALITY_TIERS[config.quality] || QUALITY_TIERS.standard;

  const specFactor =
    (SPEC_MODIFIERS.foundation[config.specs.foundation] || 1) *
    (SPEC_MODIFIERS.roofing[config.specs.roofing] || 1) *
    (SPEC_MODIFIERS.flooring[config.specs.flooring] || 1) *
    (SPEC_MODIFIERS.wallFinish[config.specs.wallFinish] || 1) *
    (SPEC_MODIFIERS.doors[config.specs.doors] || 1) *
    (SPEC_MODIFIERS.windows[config.specs.windows] || 1) *
    (SPEC_MODIFIERS.electrical[config.specs.electrical] || 1) *
    (SPEC_MODIFIERS.plumbing[config.specs.plumbing] || 1) *
    (SPEC_MODIFIERS.interiorFinishing[config.specs.interiorFinishing] || 1) *
    (SPEC_MODIFIERS.exteriorFinishing[config.specs.exteriorFinishing] || 1);

  const normalizedSpecFactor = 1 + (specFactor - 1) * 0.45;
  const floorHeightPremium = 1 + Math.max(0, floors - 1) * 0.035;

  const baseRateUsd =
    countryMeta.baseConstructionUsdPerSqFt *
    buildingMeta.multiplier *
    qualityMeta.multiplier *
    normalizedSpecFactor *
    floorHeightPremium;

  const coreConstructionUsd = effectiveBuiltUpSqFt * baseRateUsd;
  const regionScale = Math.max(0.4, countryMeta.baseConstructionUsdPerSqFt / 160);

  const facilityAdditionsUsd =
    (config.hasLift ? 18500 * floors * 0.45 * regionScale : 0) +
    (config.hasGarden ? Math.max(0, landAreaSqFt - maxGroundFootprintSqFt) * 4.2 * regionScale : 0) +
    (config.hasTerrace ? maxGroundFootprintSqFt * 3.5 * regionScale : 0) +
    (config.hasSwimmingPool ? 22000 * regionScale : 0) +
    (config.hasHomeTheatre ? 12000 * regionScale : 0) +
    (config.hasOutdoorSeating ? 4500 * regionScale : 0);

  const directBuildingUsd = coreConstructionUsd + facilityAdditionsUsd;

  const inc = config.budgetInclusions;
  const rawCostHeads = [
    {
      key: "materials",
      label: "Material Expenses (Structure, Masonry, Roofing, Flooring)",
      group: "Materials",
      usd: inc.materials ? directBuildingUsd * 0.56 : 0,
    },
    {
      key: "labour",
      label: "Labour Expenses",
      group: "Labour",
      usd: inc.labour ? directBuildingUsd * 0.19 : 0,
    },
    {
      key: "electrical",
      label: "Electrical Expenses",
      group: "MEP Systems",
      usd: inc.materials ? directBuildingUsd * 0.055 : 0,
    },
    {
      key: "plumbing",
      label: "Plumbing & Sanitary Expenses",
      group: "MEP Systems",
      usd: inc.materials ? directBuildingUsd * 0.055 : 0,
    },
    {
      key: "interior",
      label: "Interior Expenses & Joinery",
      group: "Interior Design",
      usd: inc.interiorDesign ? directBuildingUsd * 0.14 : 0,
    },
    {
      key: "architecturalFees",
      label: "Architectural & Engineering Fees",
      group: "Professional Fees",
      usd: inc.architectureFees ? directBuildingUsd * 0.065 : 0,
    },
    {
      key: "additional",
      label: "Additional Expenses (Permits, Transport, Sitework)",
      group: "Additional & Contingency",
      usd: inc.additionalExpenses ? directBuildingUsd * 0.055 : 0,
    },
    {
      key: "contingency",
      label: "Contingency Reserve (5%)",
      group: "Additional & Contingency",
      usd: directBuildingUsd * 0.05,
    },
  ].filter((h) => h.usd > 0);

  const totalExpectedUsd = Math.max(1, rawCostHeads.reduce((sum, item) => sum + item.usd, 0));
  const minUsd = totalExpectedUsd * 0.9;
  const maxUsd = totalExpectedUsd * 1.15;

  const itemized: CostBreakdownItem[] = rawCostHeads.map((item) => ({
    key: item.key,
    label: item.label,
    group: item.group,
    amount: Math.round(convertFromUsd(item.usd, currencyCode)),
    sharePct: Number(((item.usd / totalExpectedUsd) * 100).toFixed(1)),
  }));

  const groupMap: Record<string, number> = {};
  itemized.forEach((row) => {
    groupMap[row.group] = (groupMap[row.group] || 0) + row.amount;
  });
  const groupDistribution = Object.entries(groupMap).map(([name, value]) => ({ name, value }));

  const expectedBudget = Math.round(convertFromUsd(totalExpectedUsd, currencyCode));
  const minBudget = Math.round(convertFromUsd(minUsd, currencyCode));
  const maxBudget = Math.round(convertFromUsd(maxUsd, currencyCode));
  const costPerSqFt = Math.round(expectedBudget / Math.max(1, effectiveBuiltUpSqFt));

  const targetBudget = Math.max(0, Number(config.targetBudget) || expectedBudget);
  const diff = expectedBudget - targetBudget;
  const budgetStatus: "within" | "slightly_above" | "over" =
    diff <= 0 ? "within" : diff <= targetBudget * 0.15 ? "slightly_above" : "over";

  const recommendations: string[] = [];
  if (budgetStatus !== "within") {
    recommendations.push(
      `Your current design (${formatCurrency(expectedBudget, currencyCode)}) is ${formatCurrency(
        diff,
        currencyCode
      )} above your target budget (${formatCurrency(
        targetBudget,
        currencyCode
      )}). Consider switching flooring specifications to double-charged vitrified tiles or simplifying cantilevered facade features.`
    );
    if (config.hasSwimmingPool || config.hasHomeTheatre) {
      recommendations.push(
        "Deferring luxury leisure additions (swimming pool or dedicated home theatre) to Phase 2 can bring immediate core construction closer to your target budget."
      );
    }
    if (config.quality === "luxury" || config.quality === "premium") {
      recommendations.push(
        `Stepping construction quality from ${qualityMeta.label} to Standard reduces baseline structural and finishing rates by ~25%.`
      );
    }
  } else {
    recommendations.push(
      `Your expected estimate (${formatCurrency(expectedBudget, currencyCode)}) fits comfortably within your ${formatCurrency(
        targetBudget,
        currencyCode
      )} budget envelope, leaving a healthy reserve for landscaping and furniture.`
    );
    recommendations.push(
      "Consider allocating part of your remaining reserve toward solar-ready electrical conduits or rainwater harvesting."
    );
  }

  return {
    referenceDate: RATE_REFERENCE_DATE,
    landAreaSqFt,
    maxGroundFootprintSqFt,
    maxPermissibleBuiltUpSqFt,
    effectiveBuiltUpSqFt,
    exceedsPlotCoverage: effectiveBuiltUpSqFt > maxPermissibleBuiltUpSqFt,
    expectedBudget,
    minBudget,
    maxBudget,
    costPerSqFt,
    itemized,
    groupDistribution,
    budgetStatus,
    budgetDifference: diff,
    recommendations,
    assumptions: [
      `Plot coverage cap configured at ${coveragePct}% (${100 - coveragePct}% preserved for setbacks & open ground).`,
      `Sample regional baseline for ${config.country} (${qualityMeta.label} quality) referenced ${RATE_REFERENCE_DATE}.`,
      `Includes 5% contingency reserve; excludes land purchase price and municipal trunk utility fees.`,
    ],
  };
}
