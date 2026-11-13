import { formatCurrency, type CurrencyCode } from "./currencyService";
import type { ConstructionCostInput, ConstructionCostResult } from "./constructionCostService";
import type { ArchitecturalStyleName } from "../data/designPresets";

export interface AssistantPatchSuggestion {
  label: string;
  description: string;
  patch: Partial<ConstructionCostInput> & {
    style?: ArchitecturalStyleName;
    promptAppend?: string;
  };
}

export interface AssistantReply {
  text: string;
  isDemoAssistant: true;
  suggestion?: AssistantPatchSuggestion;
}

export interface AssistantProjectSnapshot {
  landAreaSqFt: number;
  country: string;
  city: string;
  buildingType: string;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  style: string;
  quality: string;
  targetBudget: number;
  currency: CurrencyCode;
  costResult: ConstructionCostResult | null;
}

/**
 * Modular Frontend AI House Planning Assistant Service.
 * Generates transparent rule-based local suggestions using the user's entered
 * project context. Structured for seamless replacement by a live LLM API later.
 */
export function generateAssistantReply(
  userMessage: string,
  snapshot: AssistantProjectSnapshot
): AssistantReply {
  const lower = userMessage.toLowerCase();

  // Extract optional custom figures if user typed a scenario directly in chat
  const areaMatch = userMessage.match(/(\d[\d,]*)\s*(?:sq\.?\s*ft|sqft)/i);
  const bedMatch = userMessage.match(/(\d+|one|two|three|four|five|six)\s*bedroom/i);
  const bathMatch = userMessage.match(/(\d+|one|two|three|four|five|six)\s*bathroom/i);
  const wordToNum: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

  const mentionedArea = areaMatch ? parseInt(areaMatch[1].replace(/,/g, ""), 10) : snapshot.landAreaSqFt;
  const mentionedBeds = bedMatch
    ? wordToNum[bedMatch[1].toLowerCase()] || parseInt(bedMatch[1], 10)
    : snapshot.bedrooms;
  const mentionedBaths = bathMatch
    ? wordToNum[bathMatch[1].toLowerCase()] || parseInt(bathMatch[1], 10)
    : snapshot.bathrooms;

  // 1. Specific example / layout inquiry
  if (
    lower.includes("layout") ||
    lower.includes("room") ||
    lower.includes("floor") ||
    (areaMatch && bedMatch)
  ) {
    const groundBeds = Math.max(1, Math.floor(mentionedBeds / 3));
    const upperBeds = Math.max(1, mentionedBeds - groundBeds);
    return {
      isDemoAssistant: true,
      text:
        `[SquareFootIQ Demo Planning Assistant — Based on your project parameters]\n\n` +
        `For a ${mentionedArea.toLocaleString()} sq. ft. plot with ${mentionedBeds} bedrooms and ${mentionedBaths} bathrooms in ${snapshot.style} style:\n\n` +
        `• Ground Floor: Living room, dining area, modular kitchen with utility buffer, ${groundBeds} guest bedroom(s), 1 bathroom, and integrated car parking.\n` +
        `• First Floor: ${upperBeds} bedroom(s) including master suite, ${Math.max(
          1,
          mentionedBaths - 1
        )} bathroom(s), a family lounge, and front balcony terrace.\n` +
        `• Exterior: ${snapshot.style} elevation with shaded overhangs for passive cooling.\n\n` +
        `Would you like me to apply an optimized family-lounge & cross-ventilated zoning note to your project, or continue to generate your final house plan?`,
      suggestion: {
        label: "Apply Cross-Ventilated Layout Note",
        description: "Updates your design brief to emphasize sunlit living-dining flow and upper family lounge.",
        patch: {
          promptAppend: "Include sunlit living-dining spine, upper-floor family lounge, and front balcony.",
        },
      },
    };
  }

  // 2. Budget optimization / cost saving
  if (lower.includes("budget") || lower.includes("cost") || lower.includes("save") || lower.includes("reduce") || lower.includes("lakh") || lower.includes("cheap")) {
    const estText = snapshot.costResult
      ? formatCurrency(snapshot.costResult.expectedBudget, snapshot.currency)
      : "your current estimate";
    return {
      isDemoAssistant: true,
      text:
        `[SquareFootIQ Demo Planning Assistant — Budget Optimization]\n\n` +
        `Your current expected construction estimate is ${estText} against a target budget of ${formatCurrency(
          snapshot.targetBudget,
          snapshot.currency
        )}.\n\n` +
        `Three practical ways to reduce construction outlay without sacrificing structural integrity:\n` +
        `1. Masonry: Use AAC lightweight blocks instead of kiln clay bricks to save ~6–8% on mortar and steel dead-load.\n` +
        `2. Flooring: Choose double-charged vitrified ceramic tiles in bedrooms while keeping natural stone only in the main foyer.\n` +
        `3. Roof & Elevation: Favor clean rectangular structural spans over deep decorative cantilevers.\n\n` +
        `You can apply the Standard quality & vitrified flooring optimization below if you'd like to preview the lower cost estimate.`,
      suggestion: {
        label: "Apply Budget-Optimized Flooring & Standard Spec",
        description: "Sets quality to Standard and flooring to Vitrified Ceramic without changing your room counts.",
        patch: {
          quality: "standard",
        },
      },
    };
  }

  // 3. Material recommendations
  if (lower.includes("material") || lower.includes("cement") || lower.includes("steel") || lower.includes("brick")) {
    return {
      isDemoAssistant: true,
      text:
        `[SquareFootIQ Demo Planning Assistant — Material Guidance]\n\n` +
        `For your ${snapshot.floors}-floor ${snapshot.buildingType} in ${snapshot.country}:\n` +
        `• Structural Frame: Fe 500D TMT reinforcement steel paired with OPC 53 grade cement for columns/beams and PPC for masonry & plastering.\n` +
        `• Walls: AAC blocks improve thermal insulation compared to solid clay bricks.\n` +
        `• Fenestration: uPVC or thermal-break aluminium double glazing minimizes heat gain on west-facing walls.`,
    };
  }

  // 4. Architectural style & interior advice
  if (lower.includes("style") || lower.includes("exterior") || lower.includes("interior") || lower.includes("modern") || lower.includes("minimalist")) {
    return {
      isDemoAssistant: true,
      text:
        `[SquareFootIQ Demo Planning Assistant — Style & Interior Direction]\n\n` +
        `Your selected ${snapshot.style} architecture pairs effortlessly with warm lime-wash plaster, timber soffit accents, and soft indirect cove lighting indoors.\n\n` +
        `If you prefer calmer maintenance and lower exterior cladding cost, a Minimalist or Scandinavian elevation reduces exterior ornamentation while maximizing window daylight.`,
      suggestion: {
        label: "Preview Minimalist Style Direction",
        description: "Switches architectural style preference to Minimalist (can be reverted anytime).",
        patch: {
          style: "Minimalist",
        },
      },
    };
  }

  // Default contextual response
  return {
    isDemoAssistant: true,
    text:
      `[SquareFootIQ Demo Planning Assistant]\n\n` +
      `I have your current project brief loaded: a ${snapshot.floors}-floor ${snapshot.style} ${snapshot.buildingType} on ${snapshot.landAreaSqFt.toLocaleString()} sq. ft. in ${
        snapshot.city || snapshot.country
      } with ${snapshot.bedrooms} bedrooms and ${snapshot.bathrooms} bathrooms.\n\n` +
      `Ask me about:\n` +
      `• Room arrangements & ground vs. first floor zoning\n` +
      `• Budget optimization & cost-saving material swaps\n` +
      `• Exterior elevation or interior styling recommendations\n\n` +
      `When you're ready, click "Generate My Dream House" to view your complete plan, floor blueprint, before-and-after comparison, and itemized budget.`,
  };
}
