import { COUNTRIES, QUALITY_TIERS, RATE_REFERENCE_DATE } from "../data/regionalRates";
import { convertToSqFt } from "../utils/unitConversion";
import { convertFromUsd, type CurrencyCode } from "./currencyService";

export interface PropertyPredictionInput {
  locationAddress: string;
  country: string;
  state: string;
  city: string;
  propertyType: string;
  landArea: number | string;
  landUnit: string;
  builtUpArea: number | string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  propertyAge: number;
  parkingAvailable: string;
  condition: string;
  constructionQuality: string;
  furnishing: string;
}

export interface PropertyPredictionResult {
  isMachineLearningPrediction: boolean;
  sourceLabel: string;
  referenceDate: string;
  landAreaSqFt: number;
  builtUpSqFt: number;
  estimatedPrice: number;
  minPrice: number;
  maxPrice: number;
  pricePerSqFt: number;
  comparisonTiers: { label: string; value: number }[];
  factors: { factor: string; impact: string; effect: string }[];
}

export function predictPropertyPriceSync(
  form: PropertyPredictionInput,
  currencyCode: CurrencyCode
): PropertyPredictionResult {
  const landAreaSqFt = convertToSqFt(form.landArea, form.landUnit);
  const builtUpSqFt = Math.max(200, parseFloat(String(form.builtUpArea)) || 0);

  const countryMeta = COUNTRIES.find((c) => c.id === form.country) || COUNTRIES[0];
  const baseUsdPerSqFt = countryMeta.baseMarketUsdPerSqFt;

  const typeMultipliers: Record<string, number> = {
    "Independent House": 1.06,
    Apartment: 0.94,
    Villa: 1.24,
    Duplex: 1.12,
    "Commercial Property": 1.35,
  };

  const conditionMultipliers: Record<string, number> = {
    Excellent: 1.14,
    Good: 1.0,
    Fair: 0.88,
    "Needs Renovation": 0.74,
  };

  const furnishingMultipliers: Record<string, number> = {
    "Fully Furnished": 1.1,
    "Semi-Furnished": 1.04,
    Unfurnished: 0.97,
  };

  const qualityMult = QUALITY_TIERS[form.constructionQuality]?.multiplier || 1.0;
  const typeMult = typeMultipliers[form.propertyType] || 1.0;
  const condMult = conditionMultipliers[form.condition] || 1.0;
  const furnMult = furnishingMultipliers[form.furnishing] || 1.0;

  const ageYears = Math.max(0, parseFloat(String(form.propertyAge)) || 0);
  const ageFactor = Math.max(0.65, 1 - ageYears * 0.008);
  const parkingBonus = form.parkingAvailable === "Yes" ? 1.04 : 0.97;
  const bedroomPremium = 1 + Math.min(6, Number(form.bedrooms) || 0) * 0.015;

  const builtRateUsd =
    baseUsdPerSqFt * typeMult * qualityMult * condMult * furnMult * ageFactor * parkingBonus * bedroomPremium;
  const landRateUsd = baseUsdPerSqFt * 0.42 * typeMult;

  const totalUsd = builtUpSqFt * builtRateUsd + landAreaSqFt * landRateUsd;
  const minUsd = totalUsd * 0.91;
  const maxUsd = totalUsd * 1.11;
  const pricePerSqFtUsd = totalUsd / Math.max(1, builtUpSqFt);

  const estimatedPrice = Math.round(convertFromUsd(totalUsd, currencyCode));
  const minPrice = Math.round(convertFromUsd(minUsd, currencyCode));
  const maxPrice = Math.round(convertFromUsd(maxUsd, currencyCode));
  const pricePerSqFt = Math.round(convertFromUsd(pricePerSqFtUsd, currencyCode));

  const comparisonTiers = [
    { label: "Budget Tier", value: Math.round(convertFromUsd(totalUsd * 0.78, currencyCode)) },
    { label: "Subject Property", value: estimatedPrice },
    { label: "Micro-Market Avg", value: Math.round(convertFromUsd(totalUsd * 1.05, currencyCode)) },
    { label: "Luxury Benchmark", value: Math.round(convertFromUsd(totalUsd * 1.32, currencyCode)) },
  ];

  const factors = [
    {
      factor: "Location & City Baseline",
      impact: `${form.city || form.state}, ${form.country}`,
      effect: "Primary Baseline Driver",
    },
    {
      factor: "Built-Up & Land Footprint",
      impact: `${builtUpSqFt.toLocaleString()} sq. ft. built-up on ${landAreaSqFt.toLocaleString()} sq. ft. land`,
      effect: "Positive Area Weight",
    },
    {
      factor: "Property Age Retention",
      impact: `${ageYears} years (${Math.round(ageFactor * 100)}% structural value retention)`,
      effect: ageYears > 10 ? "Moderate Depreciation" : "Minimal Depreciation",
    },
    {
      factor: "Quality & Furnishing",
      impact: `${QUALITY_TIERS[form.constructionQuality]?.label || "Standard"} · ${form.furnishing}`,
      effect: `${Math.round((qualityMult * furnMult - 1) * 100)}% Net Modifier`,
    },
    {
      factor: "Condition & Parking",
      impact: `${form.condition} condition · Parking: ${form.parkingAvailable}`,
      effect: form.parkingAvailable === "Yes" ? "+4% Liquidity Bonus" : "-3% Parking Discount",
    },
  ];

  return {
    isMachineLearningPrediction: false,
    sourceLabel: "Sample Local Valuation Heuristic (Ready for Future ML Model Integration)",
    referenceDate: RATE_REFERENCE_DATE,
    landAreaSqFt,
    builtUpSqFt,
    estimatedPrice,
    minPrice,
    maxPrice,
    pricePerSqFt,
    comparisonTiers,
    factors,
  };
}
