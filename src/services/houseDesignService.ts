import { DESIGN_IMAGE_ASSETS, STYLE_GALLERY, type ArchitecturalStyleName } from "../data/designPresets";

export interface HouseDesignInput {
  prompt: string;
  style: ArchitecturalStyleName | string;
  exteriorColor: string;
  windowStyle: string;
  balconyDesign: string;
  roofStyle: string;
  preferredMaterials: string;
  gardenStyle: string;
  landWidth?: number;
  landDepth?: number;
  floors?: number;
  bedrooms?: number;
  bathrooms?: number;
  buildingType?: string;
}

export interface HouseDesignResult {
  isAiImageApiConnected: boolean;
  sourceLabel: string;
  conceptTitle: string;
  svgVariant: "modern" | "minimalist" | "duplex" | "mediterranean";
  referenceImage: string;
  style: string;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  roofStyle: string;
  suggestedMaterials: string[];
  originalIdeaSummary: string;
  improvedConceptSummary: string;
  narrative: string;
  elevationNotes: {
    exterior: string;
    frontElevation: string;
    sideElevation: string;
  };
}

export function generateHouseDesignSync(input: HouseDesignInput): HouseDesignResult {
  const galleryMatch = STYLE_GALLERY.find((s) => s.id === input.style) || STYLE_GALLERY[0];
  const floors = Math.max(1, Number(input.floors) || 2);
  const bedrooms = Math.max(0, Number(input.bedrooms) || 3);
  const bathrooms = Math.max(1, Number(input.bathrooms) || 2);

  const suggestedMaterials = [
    input.preferredMaterials || galleryMatch.defaultMaterials,
    `${input.roofStyle || galleryMatch.defaultRoof} with heat-reflective insulation`,
    `${input.windowStyle || "Floor-to-ceiling low-E double glazing"} in ${input.exteriorColor || galleryMatch.defaultColor}`,
    `${input.gardenStyle || "Permeable natural stone courtyard & native planting"}`,
  ];

  const conceptTitle = `${input.style} ${floors}-Storey ${input.buildingType || "Residence"}`;

  const originalIdeaSummary =
    input.prompt && input.prompt.trim().length > 10
      ? input.prompt.trim()
      : `I want a ${floors}-floor ${input.style.toLowerCase()} ${
          input.buildingType?.toLowerCase() || "house"
        } with ${bedrooms} bedrooms, ${bathrooms} bathrooms, and a balcony.`;

  const improvedConceptSummary = `A refined ${input.style.toLowerCase()} ${floors}-floor ${
    input.buildingType?.toLowerCase() || "residence"
  } featuring ${
    bedrooms > 0 ? `${bedrooms} proportioned bedrooms, ` : ""
  }${bathrooms} bathrooms, a sunlit open-plan living-dining spine, functional kitchen with utility buffer, ${
    floors > 1 ? "an upper-floor family lounge, " : ""
  }${input.balconyDesign?.toLowerCase() || "front balcony overhang"}, and dedicated car parking.`;

  const narrative = `Organized for a ${input.landWidth || 40} ft × ${
    input.landDepth || 60
  } ft plot, this ${input.style.toLowerCase()} concept balances passive cross-ventilation with ${
    input.exteriorColor || galleryMatch.defaultColor
  } tones, ${input.windowStyle || "panoramic fenestration"}, and a ${
    input.roofStyle || galleryMatch.defaultRoof
  }.`;

  return {
    isAiImageApiConnected: false,
    sourceLabel: "Reference Architectural Visualization (Sample Image — AI Image API Not Connected)",
    conceptTitle,
    svgVariant: galleryMatch.svgVariant,
    referenceImage: galleryMatch.image || DESIGN_IMAGE_ASSETS.heroVilla,
    style: input.style,
    floors,
    bedrooms,
    bathrooms,
    roofStyle: input.roofStyle || galleryMatch.defaultRoof,
    suggestedMaterials,
    originalIdeaSummary,
    improvedConceptSummary,
    narrative,
    elevationNotes: {
      exterior: `3/4 reference perspective illustrating ${input.style} massing, ${input.balconyDesign}, and landscaped entry.`,
      frontElevation: `Front facade (${input.landWidth || 40} ft width) featuring ${input.windowStyle} and shaded entry portico.`,
      sideElevation: `Side elevation (${input.landDepth || 60} ft depth) showing stairwell light well and floor-to-floor proportions.`,
    },
  };
}
