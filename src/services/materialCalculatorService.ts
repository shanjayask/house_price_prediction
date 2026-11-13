import { BASE_MATERIAL_RATES_USD, COUNTRIES, QUALITY_TIERS, RATE_REFERENCE_DATE } from "../data/regionalRates";
import { convertFromUsd, type CurrencyCode } from "./currencyService";

export interface MaterialItemResult {
  key: string;
  name: string;
  spec: string;
  specOptions: string[];
  quantity: number;
  unit: string;
  unitPrice: number;
  defaultUnitPrice: number;
  isCustomPrice: boolean;
  totalPrice: number;
}

export interface MaterialCalculationResult {
  referenceDate: string;
  region: string;
  builtUpAreaSqFt: number;
  wastagePct: number;
  items: MaterialItemResult[];
  totalMaterialCost: number;
  assumptions: string[];
}

export function calculateMaterialRequirementsSync(params: {
  builtUpAreaSqFt: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  country: string;
  quality: string;
  wastagePct: number;
  specs: Record<string, string>;
  customUnitPrices: Record<string, string>;
  currencyCode: CurrencyCode;
}): MaterialCalculationResult {
  const area = Math.max(300, Number(params.builtUpAreaSqFt) || 1500);
  const countryMeta = COUNTRIES.find((c) => c.id === params.country) || COUNTRIES[0];
  const qualityMult = QUALITY_TIERS[params.quality]?.multiplier || 1.0;
  const regionRateFactor = Math.max(0.5, countryMeta.baseConstructionUsdPerSqFt / 110);
  const wasteFactor = 1 + (Number(params.wastagePct) || 0) / 100;
  const structuralFactor = 1 + Math.max(0, (params.floors || 1) - 1) * 0.04;

  const baseQuantities: Record<string, number> = {
    cement: area * 0.42 * structuralFactor * wasteFactor,
    steel: area * 4.1 * structuralFactor * wasteFactor,
    bricks: area * 8.5 * wasteFactor,
    sand: area * 1.85 * wasteFactor,
    gravel: area * 1.35 * wasteFactor,
    tiles: area * 0.92 * wasteFactor,
    paint: area * 0.14 * wasteFactor,
    doors: Math.max(4, (Number(params.bedrooms) || 3) + (Number(params.bathrooms) || 2) + 2),
    windows: Math.max(6, Math.round(area / 185)),
  };

  const items: MaterialItemResult[] = Object.entries(BASE_MATERIAL_RATES_USD).map(([key, meta]) => {
    const qty = Math.ceil(baseQuantities[key]);
    const qualityAdjust = key === "tiles" || key === "doors" || key === "windows" ? qualityMult : 1;
    const defaultLocalUnitPrice = Number(
      convertFromUsd(meta.usdPrice * regionRateFactor * qualityAdjust, params.currencyCode).toFixed(2)
    );
    const customRaw = params.customUnitPrices?.[key];
    const hasCustom = customRaw !== undefined && customRaw !== "";
    const unitPrice = hasCustom ? Math.max(0, parseFloat(customRaw) || 0) : defaultLocalUnitPrice;
    const totalPrice = Math.round(qty * unitPrice);

    return {
      key,
      name: meta.name,
      spec: params.specs?.[key] || meta.specOptions[0],
      specOptions: meta.specOptions,
      quantity: qty,
      unit: meta.unit,
      unitPrice,
      defaultUnitPrice: defaultLocalUnitPrice,
      isCustomPrice: hasCustom,
      totalPrice,
    };
  });

  const totalMaterialCost = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return {
    referenceDate: RATE_REFERENCE_DATE,
    region: params.country,
    builtUpAreaSqFt: area,
    wastagePct: params.wastagePct,
    items,
    totalMaterialCost,
    assumptions: [
      "Cement estimated at 0.42 bags/sq. ft. and TMT steel at 4.1 kg/sq. ft. for standard RCC framing.",
      "Masonry quantity assumes 230mm exterior walls and 115mm internal partition walls.",
      `Includes ${params.wastagePct}% wastage allowance across structural and finishing consumables.`,
      `Prices reflect sample regional averages (${params.country}) referenced ${RATE_REFERENCE_DATE}, not live vendor quotes.`,
    ],
  };
}
