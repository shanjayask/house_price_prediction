export const ARCHITECTURAL_STYLES = [
  "Modern",
  "Contemporary",
  "Traditional",
  "Minimalist",
  "Duplex",
  "Luxury",
  "Mediterranean",
  "Scandinavian",
  "Colonial",
  "Industrial",
] as const;

export type ArchitecturalStyleName = (typeof ARCHITECTURAL_STYLES)[number];

export const INTERIOR_STYLES = [
  "Modern",
  "Minimalist",
  "Traditional",
  "Contemporary",
  "Luxury",
  "Scandinavian",
  "Industrial",
] as const;

export const DESIGN_IMAGE_ASSETS = {
  heroVilla: "/src/assets/images/hero_modern_villa_1794576207192.jpg",
  emptyLand: "/src/assets/images/empty_land_plot_1794576208059.jpg",
  interiorLiving: "/src/assets/images/interior_living_suite_1794576208044.jpg",
  mediterraneanVilla: "/src/assets/images/villa_mediterranean_facade_1794576208525.jpg",
  duplexContemporary: "/src/assets/images/duplex_contemporary_house_1794576207876.jpg",
  scandinavianHouse: "/src/assets/images/scandinavian_minimalist_house_1794577417794.jpg",
  colonialHouse: "/src/assets/images/colonial_traditional_home_1794577418592.jpg",
  industrialHouse: "/src/assets/images/industrial_loft_residence_1794577416735.jpg",
  luxuryVilla: "/src/assets/images/luxury_estate_villa_1794577417984.jpg",
};

export interface StyleGalleryItem {
  id: ArchitecturalStyleName;
  tagline: string;
  description: string;
  image: string;
  svgVariant: "modern" | "minimalist" | "duplex" | "mediterranean";
  defaultRoof: string;
  defaultMaterials: string;
  defaultColor: string;
}

export const STYLE_GALLERY: StyleGalleryItem[] = [
  {
    id: "Modern",
    tagline: "Cantilevered planes & warm courtyard glass",
    description: "Clean horizontal roof slabs, travertine stone piers, and expansive floor-to-ceiling glazing.",
    image: DESIGN_IMAGE_ASSETS.heroVilla,
    svgVariant: "modern",
    defaultRoof: "Flat Cantilever Slab",
    defaultMaterials: "Travertine stone, timber louvers & architectural glass",
    defaultColor: "Warm Alabaster & Stone",
  },
  {
    id: "Contemporary",
    tagline: "Sculpted geometric volumes & vertical screens",
    description: "Dynamic layered volumes pairing exposed concrete, natural timber slats, and deep terraces.",
    image: DESIGN_IMAGE_ASSETS.duplexContemporary,
    svgVariant: "duplex",
    defaultRoof: "Asymmetric Butterfly Roof",
    defaultMaterials: "Architectural concrete, timber slats & matte metal",
    defaultColor: "Chalk White & Charcoal",
  },
  {
    id: "Traditional",
    tagline: "Timeless colonnades & pitched heritage roofs",
    description: "Symmetrical masonry facades, shaded verandah porches, and enduring pitched roof geometry.",
    image: DESIGN_IMAGE_ASSETS.colonialHouse,
    svgVariant: "mediterranean",
    defaultRoof: "Sloped Pitched Roof",
    defaultMaterials: "Lime-washed brick masonry & seasoned timber shutters",
    defaultColor: "Cream Limestone & Slate",
  },
  {
    id: "Minimalist",
    tagline: "Serene restraint & pure daylight proportion",
    description: "Uncluttered volumes, flush glazing frames, and calm neutral surfaces prioritizing natural light.",
    image: DESIGN_IMAGE_ASSETS.scandinavianHouse,
    svgVariant: "minimalist",
    defaultRoof: "Low-Slope Standing Seam",
    defaultMaterials: "Smooth lime plaster, pale oak & slimline aluminium",
    defaultColor: "Pure Chalk & Pale Birch",
  },
  {
    id: "Duplex",
    tagline: "Two-level urban efficiency & upper balconies",
    description: "Smart vertical zoning separating ground-floor social living from private upper bedrooms.",
    image: DESIGN_IMAGE_ASSETS.duplexContemporary,
    svgVariant: "duplex",
    defaultRoof: "Flat Cantilever Slab",
    defaultMaterials: "Textured stucco, vertical timber screens & glass balustrade",
    defaultColor: "Soft Grey & Warm Cedar",
  },
  {
    id: "Luxury",
    tagline: "Monumental pavilions & reflecting courtyards",
    description: "Double-height entry galleries, cantilevered upper suites, and resort-grade outdoor decks.",
    image: DESIGN_IMAGE_ASSETS.luxuryVilla,
    svgVariant: "modern",
    defaultRoof: "Cantilevered Terrace Deck",
    defaultMaterials: "Honed limestone, bronze glazing & architectural lighting",
    defaultColor: "Sandstone & Deep Plum",
  },
  {
    id: "Mediterranean",
    tagline: "Arched loggias, terracotta & olive courtyards",
    description: "Sun-tempered limestone walls, clay roof tiles, and shaded arched verandas for warm climates.",
    image: DESIGN_IMAGE_ASSETS.mediterraneanVilla,
    svgVariant: "mediterranean",
    defaultRoof: "Terracotta Pitched Hip Roof",
    defaultMaterials: "Textured limestone, clay roof tiles & wrought iron",
    defaultColor: "Warm Ochre & Terracotta",
  },
  {
    id: "Scandinavian",
    tagline: "Nordic timber warmth & pitched gable light",
    description: "Pale larch cladding, crisp standing-seam gables, and cozy indoor-outdoor meadow decks.",
    image: DESIGN_IMAGE_ASSETS.scandinavianHouse,
    svgVariant: "minimalist",
    defaultRoof: "Pitched Standing Seam Gable",
    defaultMaterials: "Pale larch timber, standing seam zinc & triple glazing",
    defaultColor: "Birch White & Zinc Grey",
  },
  {
    id: "Colonial",
    tagline: "Symmetrical proportion & classical portico",
    description: "Balanced multi-pane windows, formal columned entry porch, and slate-toned hipped roofing.",
    image: DESIGN_IMAGE_ASSETS.colonialHouse,
    svgVariant: "mediterranean",
    defaultRoof: "Slate Hip Roof with Dormers",
    defaultMaterials: "Painted brickwork, fluted columns & timber shutters",
    defaultColor: "Ivory & Heritage Slate",
  },
  {
    id: "Industrial",
    tagline: "Board-formed concrete, steel & weathered brick",
    description: "Expressive structural concrete beams, blackened steel mullions, and warm reclaimed brick.",
    image: DESIGN_IMAGE_ASSETS.industrialHouse,
    svgVariant: "duplex",
    defaultRoof: "Flat Cantilever Concrete Slab",
    defaultMaterials: "Board-formed concrete, blackened steel & kiln brick",
    defaultColor: "Raw Concrete & Rust Brick",
  },
];

export interface DesignPreset {
  id: string;
  name: string;
  style: ArchitecturalStyleName;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  builtUpAreaSqFt: number;
  quality: "basic" | "standard" | "premium" | "luxury";
  roofStyle: string;
  exteriorMaterial: string;
  svgVariant: "modern" | "minimalist" | "duplex" | "mediterranean";
  referenceImage: string;
  summary: string;
}

export const COMPARISON_DESIGN_PRESETS: DesignPreset[] = [
  {
    id: "preset-modern-courtyard",
    name: "The Wisteria Courtyard Villa",
    style: "Modern",
    floors: 2,
    bedrooms: 4,
    bathrooms: 4,
    builtUpAreaSqFt: 2850,
    quality: "premium",
    roofStyle: "Flat Cantilever Slab",
    exteriorMaterial: "Travertine Stone, Timber Louvers & Glazing",
    svgVariant: "modern",
    referenceImage: DESIGN_IMAGE_ASSETS.heroVilla,
    summary: "Double-height atrium with sheltered courtyard garden and cantilevered shading eaves.",
  },
  {
    id: "preset-scandinavian-pavilion",
    name: "Opaline Nordic Gable Home",
    style: "Scandinavian",
    floors: 1,
    bedrooms: 3,
    bathrooms: 3,
    builtUpAreaSqFt: 2100,
    quality: "standard",
    roofStyle: "Pitched Standing Seam Gable",
    exteriorMaterial: "Lime-Washed Timber & Triple Glazing",
    svgVariant: "minimalist",
    referenceImage: DESIGN_IMAGE_ASSETS.scandinavianHouse,
    summary: "Light-filled single-level layout emphasizing clean timber lines and meadow terraces.",
  },
  {
    id: "preset-contemporary-duplex",
    name: "Starlight Cantilever Duplex",
    style: "Contemporary",
    floors: 2,
    bedrooms: 4,
    bathrooms: 3,
    builtUpAreaSqFt: 2600,
    quality: "premium",
    roofStyle: "Asymmetric Butterfly Roof",
    exteriorMaterial: "Architectural Concrete, Vertical Timber Screens & Glass",
    svgVariant: "duplex",
    referenceImage: DESIGN_IMAGE_ASSETS.duplexContemporary,
    summary: "Compact urban footprint maximizing vertical light wells, upper study, and terrace.",
  },
  {
    id: "preset-mediterranean-estate",
    name: "Veranda Heritage Residence",
    style: "Mediterranean",
    floors: 2,
    bedrooms: 5,
    bathrooms: 5,
    builtUpAreaSqFt: 3450,
    quality: "luxury",
    roofStyle: "Terracotta Pitched Hip Roof",
    exteriorMaterial: "Arched Limestone Masonry, Lime Plaster & Hardwood Shutters",
    svgVariant: "mediterranean",
    referenceImage: DESIGN_IMAGE_ASSETS.mediterraneanVilla,
    summary: "Deep shaded colonnades, arched loggias, and generous entertaining wings.",
  },
];
