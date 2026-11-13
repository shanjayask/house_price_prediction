export interface FloorRoom {
  name: string;
  x: number;
  y: number;
  w: number;
  d: number;
  zone: "social" | "private" | "service" | "circulation" | "outdoor";
}

export interface FloorLevelPlan {
  level: string;
  areaSqFt: number;
  rooms: FloorRoom[];
}

export interface FloorPlanOption {
  id: string;
  name: string;
  subtitle: string;
  variant: string;
  buildWidthFt: number;
  buildDepthFt: number;
  totalBuiltUpSqFt: number;
  floors: FloorLevelPlan[];
}

export interface FloorPlanResult {
  disclaimer: string;
  options: FloorPlanOption[];
}

export function generateFloorPlansSync(requirements: {
  landWidth: number;
  landDepth: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  buildingType?: string;
}): FloorPlanResult {
  const plotW = Math.max(25, Number(requirements.landWidth) || 40);
  const plotD = Math.max(35, Number(requirements.landDepth) || 60);
  const floors = Math.max(1, Math.min(4, Number(requirements.floors) || 2));
  const bedrooms = Math.max(0, Number(requirements.bedrooms) || 3);
  const bathrooms = Math.max(1, Number(requirements.bathrooms) || 2);
  const isCommercial = requirements.buildingType === "Commercial Building";

  const buildW = Math.round(plotW * 0.78);
  const buildD = Math.round(plotD * 0.72);
  const footprintSqFt = buildW * buildD;

  const buildFloorRooms = (variant: string, floorIndex: number): FloorRoom[] => {
    if (isCommercial) {
      return [
        { name: floorIndex === 0 ? "Reception Lobby" : `Floor ${floorIndex} Lounge`, x: 0, y: 0, w: Math.round(buildW * 0.45), d: Math.round(buildD * 0.36), zone: "social" },
        { name: "Open Office Studio", x: Math.round(buildW * 0.45), y: 0, w: Math.round(buildW * 0.55), d: Math.round(buildD * 0.62), zone: "private" },
        { name: "Conference Suite", x: 0, y: Math.round(buildD * 0.36), w: Math.round(buildW * 0.45), d: Math.round(buildD * 0.36), zone: "social" },
        { name: "Lift & Stair Core", x: 0, y: Math.round(buildD * 0.72), w: Math.round(buildW * 0.3), d: Math.round(buildD * 0.28), zone: "circulation" },
        { name: "Restrooms & Pantry", x: Math.round(buildW * 0.3), y: Math.round(buildD * 0.72), w: Math.round(buildW * 0.35), d: Math.round(buildD * 0.28), zone: "service" },
        { name: "Parking / Service Bay", x: Math.round(buildW * 0.65), y: Math.round(buildD * 0.62), w: Math.round(buildW * 0.35), d: Math.round(buildD * 0.38), zone: "outdoor" },
      ];
    }

    if (floorIndex === 0) {
      const rooms: FloorRoom[] = [
        { name: "Living Room", x: 0, y: 0, w: Math.round(buildW * 0.55), d: Math.round(buildD * 0.38), zone: "social" },
        { name: "Dining Room", x: Math.round(buildW * 0.55), y: 0, w: Math.round(buildW * 0.45), d: Math.round(buildD * 0.28), zone: "social" },
        { name: "Kitchen", x: Math.round(buildW * 0.55), y: Math.round(buildD * 0.28), w: Math.round(buildW * 0.45), d: Math.round(buildD * 0.26), zone: "service" },
        { name: "Utility", x: Math.round(buildW * 0.72), y: Math.round(buildD * 0.54), w: Math.round(buildW * 0.28), d: Math.round(buildD * 0.16), zone: "service" },
        { name: "Staircase", x: Math.round(buildW * 0.42), y: Math.round(buildD * 0.38), w: Math.round(buildW * 0.13), d: Math.round(buildD * 0.24), zone: "circulation" },
        { name: bedrooms > 0 ? "Bedroom 1 (Guest)" : "Study Lounge", x: 0, y: Math.round(buildD * 0.38), w: Math.round(buildW * 0.42), d: Math.round(buildD * 0.32), zone: "private" },
        { name: "Bath 1", x: Math.round(buildW * 0.42), y: Math.round(buildD * 0.62), w: Math.round(buildW * 0.3), d: Math.round(buildD * 0.12), zone: "service" },
        { name: "Car Parking", x: 0, y: Math.round(buildD * 0.7), w: Math.round(buildW * 0.42), d: Math.round(buildD * 0.3), zone: "outdoor" },
        { name: "Garden Court", x: Math.round(buildW * 0.42), y: Math.round(buildD * 0.74), w: Math.round(buildW * 0.58), d: Math.round(buildD * 0.26), zone: "outdoor" },
      ];

      if (variant === "courtyard") {
        rooms[0].w = Math.round(buildW * 0.48);
        rooms[8].name = "Central Courtyard";
      } else if (variant === "compact") {
        rooms[7].name = "Covered Porch & Parking";
      }
      return rooms;
    }

    const upperBedCount = Math.max(1, bedrooms - 1);
    const rooms: FloorRoom[] = [
      {
        name: floorIndex === 1 ? "Master Bedroom" : `Bedroom ${floorIndex + 2}`,
        x: 0,
        y: 0,
        w: Math.round(buildW * 0.54),
        d: Math.round(buildD * 0.42),
        zone: "private",
      },
      { name: "En-suite Bath", x: Math.round(buildW * 0.54), y: 0, w: Math.round(buildW * 0.24), d: Math.round(buildD * 0.22), zone: "service" },
      { name: "Study / Wardrobe", x: Math.round(buildW * 0.78), y: 0, w: Math.round(buildW * 0.22), d: Math.round(buildD * 0.22), zone: "private" },
      { name: "Family Lounge", x: Math.round(buildW * 0.54), y: Math.round(buildD * 0.22), w: Math.round(buildW * 0.46), d: Math.round(buildD * 0.28), zone: "social" },
      { name: "Staircase Lobby", x: Math.round(buildW * 0.42), y: Math.round(buildD * 0.42), w: Math.round(buildW * 0.16), d: Math.round(buildD * 0.22), zone: "circulation" },
    ];

    if (upperBedCount >= 2) {
      rooms.push({
        name: `Bedroom ${floorIndex + 1}`,
        x: 0,
        y: Math.round(buildD * 0.42),
        w: Math.round(buildW * 0.42),
        d: Math.round(buildD * 0.34),
        zone: "private",
      });
    }
    if (bathrooms >= 2) {
      rooms.push({
        name: `Bath ${floorIndex + 1}`,
        x: Math.round(buildW * 0.58),
        y: Math.round(buildD * 0.5),
        w: Math.round(buildW * 0.42),
        d: Math.round(buildD * 0.2),
        zone: "service",
      });
    }
    rooms.push({
      name: "Upper Balcony Terrace",
      x: 0,
      y: Math.round(buildD * 0.76),
      w: buildW,
      d: Math.round(buildD * 0.24),
      zone: "outdoor",
    });

    return rooms;
  };

  const options: FloorPlanOption[] = [
    {
      id: "plan-open-axis",
      name: "Option A: Open-Concept Axis Plan",
      subtitle: "Fluid living-dining spine with front parking and rear garden terrace",
      variant: "open",
      buildWidthFt: buildW,
      buildDepthFt: buildD,
      totalBuiltUpSqFt: footprintSqFt * floors,
      floors: Array.from({ length: floors }, (_, i) => ({
        level: i === 0 ? "Ground Floor" : i === 1 ? "First Floor" : `Floor ${i}`,
        areaSqFt: footprintSqFt,
        rooms: buildFloorRooms("open", i),
      })),
    },
    {
      id: "plan-courtyard",
      name: "Option B: Courtyard & Cross-Ventilation Plan",
      subtitle: "Maximizes daylight penetration and passive natural ventilation",
      variant: "courtyard",
      buildWidthFt: buildW,
      buildDepthFt: buildD,
      totalBuiltUpSqFt: footprintSqFt * floors,
      floors: Array.from({ length: floors }, (_, i) => ({
        level: i === 0 ? "Ground Floor" : i === 1 ? "First Floor" : `Floor ${i}`,
        areaSqFt: footprintSqFt,
        rooms: buildFloorRooms("courtyard", i),
      })),
    },
    {
      id: "plan-compact",
      name: "Option C: Compact Efficiency Plan",
      subtitle: "Minimizes circulation corridors and optimizes structural column spans",
      variant: "compact",
      buildWidthFt: Math.round(buildW * 0.94),
      buildDepthFt: Math.round(buildD * 0.96),
      totalBuiltUpSqFt: Math.round(footprintSqFt * 0.9 * floors),
      floors: Array.from({ length: floors }, (_, i) => ({
        level: i === 0 ? "Ground Floor" : i === 1 ? "First Floor" : `Floor ${i}`,
        areaSqFt: Math.round(footprintSqFt * 0.9),
        rooms: buildFloorRooms("compact", i),
      })),
    },
  ];

  return {
    disclaimer: "Conceptual Architectural Suggestion Only — Not an Approved Structural or Municipal Drawing.",
    options,
  };
}
