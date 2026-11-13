import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  calculateConstructionCostSync,
  type ConstructionCostInput,
  type ConstructionCostResult,
} from "../services/constructionCostService";
import {
  calculateMaterialRequirementsSync,
  type MaterialCalculationResult,
} from "../services/materialCalculatorService";
import {
  generateHouseDesignSync,
  type HouseDesignInput,
  type HouseDesignResult,
} from "../services/houseDesignService";
import { generateFloorPlansSync, type FloorPlanResult } from "../services/floorPlanService";
import { type CurrencyCode } from "../services/currencyService";
import type { AssistantPatchSuggestion } from "../services/aiAssistantService";
import type { PropertyPredictionResult } from "../services/propertyPredictionService";

export type AppView =
  | "landing"
  | "wizard"
  | "summary"
  | "assistant"
  | "result"
  | "explore"
  | "price-check"
  | "login"
  | "signup"
  | "forgot-password";

export interface LandInfoState {
  country: string;
  state: string;
  city: string;
  locationNotes: string;
  landArea: number | string;
  landUnit: string;
  landLength: string;
  landWidth: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  isDemoAssistant?: boolean;
  suggestion?: AssistantPatchSuggestion;
  applied?: boolean;
}

export interface ConversationThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

const SESSION_STORAGE_KEY = "ai_smart_house_planner_session_v1";

function createInitialConversation(): ConversationThread {
  return {
    id: "thread-main",
    title: "SquareFootIQ Planning Session",
    updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    messages: [
      {
        id: "msg-welcome",
        role: "assistant",
        isDemoAssistant: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text:
          "Hello! I'm your SquareFootIQ AI House Planning Assistant.\n\n" +
          "I can help you turn your land and ideas into architectural concepts, floor plans, and construction budget estimates.\n\n" +
          "Notice: This is a frontend demo planning assistant using your project parameters and rule-based architectural suggestions (no external AI API connected yet).",
      },
    ],
  };
}

interface ProjectContextValue {
  view: AppView;
  setView: React.Dispatch<React.SetStateAction<AppView>>;
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  currency: CurrencyCode;
  setCurrency: React.Dispatch<React.SetStateAction<CurrencyCode>>;
  landInfo: LandInfoState;
  setLandInfo: React.Dispatch<React.SetStateAction<LandInfoState>>;
  constructionConfig: Omit<
    ConstructionCostInput,
    "landArea" | "landUnit" | "country" | "state" | "city" | "locationNotes"
  >;
  setConstructionConfig: React.Dispatch<
    React.SetStateAction<
      Omit<
        ConstructionCostInput,
        "landArea" | "landUnit" | "country" | "state" | "city" | "locationNotes"
      >
    >
  >;
  houseDesignInput: HouseDesignInput;
  setHouseDesignInput: React.Dispatch<React.SetStateAction<HouseDesignInput>>;
  materialSettings: {
    wastagePct: number;
    specs: Record<string, string>;
    customUnitPrices: Record<string, string>;
  };
  setMaterialSettings: React.Dispatch<
    React.SetStateAction<{
      wastagePct: number;
      specs: Record<string, string>;
      customUnitPrices: Record<string, string>;
    }>
  >;
  selectedPlanIndex: number;
  setSelectedPlanIndex: React.Dispatch<React.SetStateAction<number>>;
  acceptedImprovement: boolean;
  setAcceptedImprovement: React.Dispatch<React.SetStateAction<boolean>>;
  conversations: ConversationThread[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationThread[]>>;
  activeThreadId: string;
  setActiveThreadId: React.Dispatch<React.SetStateAction<string>>;
  propertyPrediction: PropertyPredictionResult | null;
  setPropertyPrediction: React.Dispatch<React.SetStateAction<PropertyPredictionResult | null>>;
  constructionResult: ConstructionCostResult;
  materialResult: MaterialCalculationResult;
  houseDesign: HouseDesignResult;
  floorPlanResult: FloorPlanResult;
  startNewProjectAtStep: (step?: number, presetStyle?: string) => void;
  generateDreamHouse: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<AppView>("landing");
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [projectName, setProjectName] = useState("SquareFootIQ Courtyard Residence");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");

  const [landInfo, setLandInfo] = useState<LandInfoState>({
    country: "India",
    state: "Karnataka",
    city: "Bengaluru",
    locationNotes: "Sarjapur Residential Corridor",
    landArea: 2400,
    landUnit: "sqft",
    landLength: "60",
    landWidth: "40",
  });

  const [constructionConfig, setConstructionConfig] = useState<
    Omit<
      ConstructionCostInput,
      "landArea" | "landUnit" | "country" | "state" | "city" | "locationNotes"
    >
  >({
    buildingType: "Independent House",
    floors: 2,
    apartmentUnits: 4,
    officeSpaces: 6,
    groundFloorConfig: "Living room, kitchen, dining area, 1 bedroom, 1 bathroom & parking",
    firstFloorConfig: "Master bedroom, 2 bedrooms, 2 bathrooms, family lounge & front balcony",
    additionalFloorsConfig: "Open roof terrace & solar pergola deck",
    bedrooms: 4,
    masterBedrooms: 1,
    bathrooms: 3,
    attachedBathrooms: 2,
    kitchens: 1,
    livingRooms: 2,
    diningRooms: 1,
    balconies: 2,
    studyRooms: 1,
    guestRooms: 1,
    storageRooms: 1,
    hasCarParking: true,
    hasGarden: true,
    hasSwimmingPool: false,
    hasTerrace: true,
    hasHomeTheatre: false,
    hasLift: false,
    hasUtilityRoom: true,
    hasOutdoorSeating: true,
    plotCoveragePct: 55,
    expectedBuiltUpArea: 2640,
    quality: "standard",
    targetBudget: 6000000,
    budgetCategory: "Standard",
    budgetInclusions: {
      materials: true,
      labour: true,
      architectureFees: true,
      interiorDesign: false,
      additionalExpenses: true,
    },
    specs: {
      foundation: "Isolated Footing",
      roofing: "RCC Flat Slab",
      flooring: "Vitrified Ceramic",
      wallFinish: "Acrylic Putty & Emulsion",
      doors: "Flush / Engineered Wood",
      windows: "Powder-Coated Aluminium",
      electrical: "Standard Modular Concealed",
      plumbing: "Standard CPVC / PPR",
      interiorFinishing: "Clean Minimalist Finish",
      exteriorFinishing: "Weatherproof Exterior Coat",
    },
  });

  const [houseDesignInput, setHouseDesignInput] = useState<HouseDesignInput>({
    prompt: "I want a modern two-floor house with four bedrooms, three bathrooms, and a balcony.",
    style: "Modern",
    exteriorColor: "Warm Alabaster & Stone",
    windowStyle: "Floor-to-ceiling low-E double glazing",
    balconyDesign: "Cantilevered glass & timber front balcony",
    roofStyle: "Flat Cantilever Slab",
    preferredMaterials: "Travertine stone, lime plaster & warm timber louvers",
    gardenStyle: "Courtyard lawn & permeable stone walkway",
  });

  const [materialSettings, setMaterialSettings] = useState<{
    wastagePct: number;
    specs: Record<string, string>;
    customUnitPrices: Record<string, string>;
  }>({
    wastagePct: 5,
    specs: {},
    customUnitPrices: {},
  });

  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [acceptedImprovement, setAcceptedImprovement] = useState(true);
  const [conversations, setConversations] = useState<ConversationThread[]>(() => [
    createInitialConversation(),
  ]);
  const [activeThreadId, setActiveThreadId] = useState("thread-main");
  const [propertyPrediction, setPropertyPrediction] = useState<PropertyPredictionResult | null>(null);

  // Restore session progress if saved in sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.landInfo) setLandInfo(parsed.landInfo);
        if (parsed.constructionConfig) setConstructionConfig(parsed.constructionConfig);
        if (parsed.houseDesignInput) setHouseDesignInput(parsed.houseDesignInput);
        if (parsed.currency) setCurrency(parsed.currency);
        if (parsed.projectName) setProjectName(parsed.projectName);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ landInfo, constructionConfig, houseDesignInput, currency, projectName })
      );
    } catch {
      // Ignore storage errors
    }
  }, [landInfo, constructionConfig, houseDesignInput, currency, projectName]);

  const constructionResult = useMemo(
    () => calculateConstructionCostSync({ ...landInfo, ...constructionConfig }, currency),
    [landInfo, constructionConfig, currency]
  );

  const materialResult = useMemo(
    () =>
      calculateMaterialRequirementsSync({
        builtUpAreaSqFt: constructionResult.effectiveBuiltUpSqFt,
        floors: constructionConfig.floors,
        bedrooms: constructionConfig.bedrooms,
        bathrooms: constructionConfig.bathrooms,
        country: landInfo.country,
        quality: constructionConfig.quality,
        wastagePct: materialSettings.wastagePct,
        specs: materialSettings.specs,
        customUnitPrices: materialSettings.customUnitPrices,
        currencyCode: currency,
      }),
    [
      constructionResult.effectiveBuiltUpSqFt,
      constructionConfig.floors,
      constructionConfig.bedrooms,
      constructionConfig.bathrooms,
      constructionConfig.quality,
      landInfo.country,
      materialSettings,
      currency,
    ]
  );

  const houseDesign = useMemo(
    () =>
      generateHouseDesignSync({
        ...houseDesignInput,
        landWidth: Number(landInfo.landWidth) || 40,
        landDepth: Number(landInfo.landLength) || 60,
        floors: constructionConfig.floors,
        bedrooms: constructionConfig.bedrooms,
        bathrooms: constructionConfig.bathrooms,
        buildingType: constructionConfig.buildingType,
      }),
    [
      houseDesignInput,
      landInfo.landWidth,
      landInfo.landLength,
      constructionConfig.floors,
      constructionConfig.bedrooms,
      constructionConfig.bathrooms,
      constructionConfig.buildingType,
    ]
  );

  const floorPlanResult = useMemo(
    () =>
      generateFloorPlansSync({
        landWidth: Number(landInfo.landWidth) || 40,
        landDepth: Number(landInfo.landLength) || 60,
        floors: constructionConfig.floors,
        bedrooms: constructionConfig.bedrooms,
        bathrooms: constructionConfig.bathrooms,
        buildingType: constructionConfig.buildingType,
      }),
    [
      landInfo.landWidth,
      landInfo.landLength,
      constructionConfig.floors,
      constructionConfig.bedrooms,
      constructionConfig.bathrooms,
      constructionConfig.buildingType,
    ]
  );

  const startNewProjectAtStep = (step = 1, presetStyle?: string) => {
    if (presetStyle) {
      setHouseDesignInput((prev) => ({ ...prev, style: presetStyle }));
      setProjectName(`${presetStyle} Dream Residence`);
    }
    setWizardStep(step);
    setView("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generateDreamHouse = () => {
    setView("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const value: ProjectContextValue = {
    view,
    setView,
    wizardStep,
    setWizardStep,
    projectName,
    setProjectName,
    currency,
    setCurrency,
    landInfo,
    setLandInfo,
    constructionConfig,
    setConstructionConfig,
    houseDesignInput,
    setHouseDesignInput,
    materialSettings,
    setMaterialSettings,
    selectedPlanIndex,
    setSelectedPlanIndex,
    acceptedImprovement,
    setAcceptedImprovement,
    conversations,
    setConversations,
    activeThreadId,
    setActiveThreadId,
    propertyPrediction,
    setPropertyPrediction,
    constructionResult,
    materialResult,
    houseDesign,
    floorPlanResult,
    startNewProjectAtStep,
    generateDreamHouse,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used inside ProjectProvider");
  return ctx;
}
