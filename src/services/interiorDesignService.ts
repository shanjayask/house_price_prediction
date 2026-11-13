import { convertFromUsd, type CurrencyCode } from "./currencyService";
import { DESIGN_IMAGE_ASSETS } from "../data/designPresets";

export interface InteriorDesignInput {
  roomType: string;
  style: string;
  colorPalette: string;
  furniturePreference: string;
  lengthFt: number;
  widthFt: number;
  budgetTier: string;
}

export interface InteriorDesignResult {
  isAiImageApiConnected: boolean;
  sourceLabel: string;
  conceptName: string;
  roomType: string;
  style: string;
  areaSqFt: number;
  swatches: string[];
  referenceImage: string;
  furnitureList: string[];
  estimatedRoomCost: number;
  notes: string;
}

export function generateInteriorDesignSync(
  input: InteriorDesignInput,
  currencyCode: CurrencyCode
): InteriorDesignResult {
  const areaSqFt = Math.max(60, (Number(input.lengthFt) || 16) * (Number(input.widthFt) || 14));
  const paletteMap: Record<string, string[]> = {
    "Wisteria & Warm Alabaster": ["#6E5A88", "#CDC4DC", "#F3EEF8", "#261E31"],
    "Sage, Travertine & Linen": ["#879484", "#DED8CE", "#F5F2EC", "#3C3A36"],
    "Charcoal, Walnut & Brass": ["#2F2A33", "#6B4E3D", "#C8A97E", "#EFECE6"],
    "Nordic Birch & Chalk": ["#D9CBB8", "#ECE8E1", "#FAF8F5", "#5B616A"],
  };

  const budgetMultiplier: Record<string, number> = {
    "Essential ($30/sq.ft.)": 30,
    "Balanced ($48/sq.ft.)": 48,
    "Premium ($75/sq.ft.)": 75,
    "Bespoke Luxury ($115/sq.ft.)": 115,
  };

  const swatches = paletteMap[input.colorPalette] || paletteMap["Wisteria & Warm Alabaster"];
  const usdRate = budgetMultiplier[input.budgetTier] || 48;
  const estimatedUsd = areaSqFt * usdRate;

  return {
    isAiImageApiConnected: false,
    sourceLabel: "Reference Architectural Interior Preview (Sample Visual — AI Image API Not Connected)",
    conceptName: `${input.style} ${input.roomType} — Interior Study`,
    roomType: input.roomType,
    style: input.style,
    areaSqFt,
    swatches,
    referenceImage: DESIGN_IMAGE_ASSETS.interiorLiving,
    furnitureList: [
      `${input.furniturePreference} focal seating & custom timber millwork`,
      `Layered warm architectural cove lighting & brushed brass pendants`,
      `Acoustic woven drapery calibrated to ${input.colorPalette}`,
      `Concealed perimeter storage tailored for ${input.lengthFt} ft × ${input.widthFt} ft layout`,
    ],
    estimatedRoomCost: Math.round(convertFromUsd(estimatedUsd, currencyCode)),
    notes: `Composed as a ${input.style.toLowerCase()} ${input.roomType.toLowerCase()} within the ${input.budgetTier} tier, optimizing natural light reflection and ergonomic circulation.`,
  };
}
