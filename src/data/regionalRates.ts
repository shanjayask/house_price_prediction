export const RATE_REFERENCE_DATE = "2026-11-01";

export interface CountryRateMeta {
  id: string;
  label: string;
  states: string[];
  baseConstructionUsdPerSqFt: number;
  baseMarketUsdPerSqFt: number;
  regionCode: string;
}

export const COUNTRIES: CountryRateMeta[] = [
  {
    id: "India",
    label: "India",
    states: ["Karnataka", "Maharashtra", "Tamil Nadu", "Kerala", "Delhi NCR", "Telangana"],
    baseConstructionUsdPerSqFt: 32,
    baseMarketUsdPerSqFt: 88,
    regionCode: "IN",
  },
  {
    id: "United States",
    label: "United States",
    states: ["California", "Texas", "New York", "Florida", "Washington", "Illinois"],
    baseConstructionUsdPerSqFt: 185,
    baseMarketUsdPerSqFt: 310,
    regionCode: "US",
  },
  {
    id: "United Kingdom",
    label: "United Kingdom",
    states: ["Greater London", "Manchester", "Edinburgh", "Birmingham", "Bristol"],
    baseConstructionUsdPerSqFt: 225,
    baseMarketUsdPerSqFt: 410,
    regionCode: "UK",
  },
  {
    id: "UAE",
    label: "United Arab Emirates",
    states: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"],
    baseConstructionUsdPerSqFt: 148,
    baseMarketUsdPerSqFt: 295,
    regionCode: "AE",
  },
  {
    id: "Singapore",
    label: "Singapore",
    states: ["Central Region", "East Region", "West Region", "North-East Region"],
    baseConstructionUsdPerSqFt: 215,
    baseMarketUsdPerSqFt: 540,
    regionCode: "SG",
  },
  {
    id: "Germany",
    label: "Germany (EU)",
    states: ["Bavaria", "Berlin", "North Rhine-Westphalia", "Hesse"],
    baseConstructionUsdPerSqFt: 205,
    baseMarketUsdPerSqFt: 365,
    regionCode: "EU",
  },
];

export interface QualityTierMeta {
  id: "basic" | "standard" | "premium" | "luxury";
  label: string;
  multiplier: number;
  description: string;
}

export const QUALITY_TIERS: Record<string, QualityTierMeta> = {
  basic: {
    id: "basic",
    label: "Basic",
    multiplier: 0.78,
    description: "Functional standard masonry, economy vitrified tiles, and essential fittings.",
  },
  standard: {
    id: "standard",
    label: "Standard",
    multiplier: 1.0,
    description: "Balanced structural durability, branded sanitaryware, and mid-range finishes.",
  },
  premium: {
    id: "premium",
    label: "Premium",
    multiplier: 1.34,
    description: "Architectural joinery, natural stone or hardwood flooring, and concealed MEP.",
  },
  luxury: {
    id: "luxury",
    label: "Luxury",
    multiplier: 1.78,
    description: "Bespoke facades, imported marble, automation readiness, and designer fixtures.",
  },
};

export interface BuildingTypeMeta {
  id:
    | "Independent House"
    | "Apartment"
    | "Duplex House"
    | "Villa"
    | "Luxury Villa"
    | "Residential Building"
    | "Commercial Building";
  label: string;
  multiplier: number;
  defaultCoverage: number;
  defaultFloors: number;
  defaultBedrooms: number;
  defaultBathrooms: number;
  tag: string;
  summary: string;
  dynamicNote: string;
}

export const BUILDING_TYPES: BuildingTypeMeta[] = [
  {
    id: "Independent House",
    label: "Independent House",
    multiplier: 1.0,
    defaultCoverage: 55,
    defaultFloors: 2,
    defaultBedrooms: 4,
    defaultBathrooms: 3,
    tag: "Single-Family",
    summary: "Custom private home with customizable rooms, garden setbacks, and parking.",
    dynamicNote: "Step 3 adapts to individual bedrooms, living zones, and private setbacks.",
  },
  {
    id: "Apartment",
    label: "Apartment",
    multiplier: 1.12,
    defaultCoverage: 60,
    defaultFloors: 4,
    defaultBedrooms: 2,
    defaultBathrooms: 2,
    tag: "Multi-Unit",
    summary: "Multi-storey apartment block configured by total units, floors, and rooms per unit.",
    dynamicNote: "Step 3 dynamically asks for number of apartment units, floors, and rooms per unit.",
  },
  {
    id: "Duplex House",
    label: "Duplex House",
    multiplier: 1.08,
    defaultCoverage: 55,
    defaultFloors: 2,
    defaultBedrooms: 4,
    defaultBathrooms: 3,
    tag: "Two-Level",
    summary: "Interconnected two-floor residence with double-height living and internal stairs.",
    dynamicNote: "Step 3 highlights ground vs upper floor zoning and balcony terraces.",
  },
  {
    id: "Villa",
    label: "Villa",
    multiplier: 1.18,
    defaultCoverage: 45,
    defaultFloors: 2,
    defaultBedrooms: 4,
    defaultBathrooms: 4,
    tag: "Estate Living",
    summary: "Spacious landscaped residence with courtyard garden, verandah, and parking.",
    dynamicNote: "Step 3 emphasizes outdoor garden space, parking bays, and leisure amenities.",
  },
  {
    id: "Luxury Villa",
    label: "Luxury Villa",
    multiplier: 1.35,
    defaultCoverage: 45,
    defaultFloors: 2,
    defaultBedrooms: 5,
    defaultBathrooms: 5,
    tag: "Bespoke Estate",
    summary: "Resort-caliber residence featuring pool, home theatre, lift core, and terraces.",
    dynamicNote: "Step 3 pre-enables bespoke suites, pool deck, home theatre, and outdoor lounge.",
  },
  {
    id: "Residential Building",
    label: "Residential Building",
    multiplier: 1.2,
    defaultCoverage: 58,
    defaultFloors: 5,
    defaultBedrooms: 3,
    defaultBathrooms: 2,
    tag: "Multi-Family",
    summary: "Multi-floor residential complex with shared circulation core and stilt parking.",
    dynamicNote: "Step 3 adapts to units per floor, elevator core, and shared residential facilities.",
  },
  {
    id: "Commercial Building",
    label: "Commercial Building",
    multiplier: 1.26,
    defaultCoverage: 65,
    defaultFloors: 3,
    defaultBedrooms: 0,
    defaultBathrooms: 6,
    tag: "Workplace & Retail",
    summary: "Multi-storey commercial hub with open office spans, meeting suites, and lift core.",
    dynamicNote: "Step 3 adapts to office spaces, conference rooms, floors, and commercial utilities.",
  },
];

export interface BaseMaterialMeta {
  name: string;
  unit: string;
  usdPrice: number;
  specOptions: string[];
}

export const BASE_MATERIAL_RATES_USD: Record<string, BaseMaterialMeta> = {
  cement: {
    name: "Cement (50 kg bag)",
    unit: "bags",
    usdPrice: 5.2,
    specOptions: ["OPC 53 Grade", "PPC Pozzolana", "Sulphate Resistant"],
  },
  steel: {
    name: "Reinforcement Steel (TMT)",
    unit: "kg",
    usdPrice: 0.92,
    specOptions: ["Fe 500D TMT", "Fe 550D Seismic", "Corrosion Resistant"],
  },
  bricks: {
    name: "Bricks / Masonry Blocks",
    unit: "nos",
    usdPrice: 0.14,
    specOptions: ["Kiln Clay Bricks", "AAC Lightweight Blocks", "Solid Concrete Blocks"],
  },
  sand: {
    name: "River / M-Sand",
    unit: "cu. ft.",
    usdPrice: 0.95,
    specOptions: ["Washed M-Sand", "Filtered River Sand", "Plastering Fine Sand"],
  },
  gravel: {
    name: "Coarse Aggregate (Gravel)",
    unit: "cu. ft.",
    usdPrice: 0.85,
    specOptions: ["20mm Crushed Granite", "12mm–20mm Graded", "Recycled Aggregate"],
  },
  tiles: {
    name: "Flooring Tiles / Stone",
    unit: "sq. ft.",
    usdPrice: 2.1,
    specOptions: ["Double-Charged Vitrified", "Porcelain Matte", "Natural Marble / Hardwood"],
  },
  paint: {
    name: "Interior & Exterior Paint",
    unit: "litres",
    usdPrice: 6.4,
    specOptions: ["Washable Emulsion", "Low-VOC Luxury Matte", "Weatherproof Elastomeric"],
  },
  doors: {
    name: "Doors & Frames",
    unit: "nos",
    usdPrice: 245,
    specOptions: ["Engineered Flush Door", "Seasoned Teak Wood", "WPC / Acoustic Core"],
  },
  windows: {
    name: "Windows & Glazing",
    unit: "nos",
    usdPrice: 195,
    specOptions: ["Powder-Coated Aluminium", "uPVC Double Glazed", "Anodised Thermal Break"],
  },
};
