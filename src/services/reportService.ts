import { jsPDF } from "jspdf";
import {
  CURRENCIES,
  EXCHANGE_RATE_REFERENCE_DATE,
  formatCurrency,
  isUsingLiveExchangeRates,
  type CurrencyCode,
} from "./currencyService";
import { RATE_REFERENCE_DATE } from "../data/regionalRates";
import type { ConstructionCostInput, ConstructionCostResult } from "./constructionCostService";
import type { MaterialCalculationResult } from "./materialCalculatorService";
import type { HouseDesignResult } from "./houseDesignService";
import type { FloorPlanResult } from "./floorPlanService";

export interface ReportPayload {
  projectName: string;
  currency: CurrencyCode;
  constructionConfig: ConstructionCostInput;
  constructionResult: ConstructionCostResult;
  materialResult: MaterialCalculationResult;
  houseDesign: HouseDesignResult;
  floorPlanResult: FloorPlanResult;
  selectedPlanIndex: number;
  landWidth: number;
  landDepth: number;
}

export function generateProjectPdfReport({
  projectName,
  currency,
  constructionConfig,
  constructionResult,
  materialResult,
  houseDesign,
  floorPlanResult,
  selectedPlanIndex,
  landWidth,
  landDepth,
}: ReportPayload): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const WISTERIA: [number, number, number] = [110, 90, 136];
  const OPALINE: [number, number, number] = [205, 196, 220];
  const STARLIGHT: [number, number, number] = [243, 238, 248];
  const PLUM: [number, number, number] = [38, 30, 49];

  const ensureSpace = (needed = 16) => {
    if (y + needed > pageHeight - 18) {
      doc.addPage();
      y = 20;
    }
  };

  const addSectionTitle = (num: string, title: string) => {
    ensureSpace(14);
    doc.setFillColor(...STARLIGHT);
    doc.rect(margin, y - 4, contentWidth, 8, "F");
    doc.setDrawColor(...OPALINE);
    doc.line(margin, y + 4, margin + contentWidth, y + 4);
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...WISTERIA);
    doc.text(`${num}. ${title}`, margin + 2, y + 1.5);
    y += 10;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...PLUM);
  };

  const addKeyValueRow = (label: string, value: string) => {
    ensureSpace(7);
    doc.setFont("times", "bold");
    doc.text(`${label}:`, margin + 2, y);
    doc.setFont("times", "normal");
    const wrapped = doc.splitTextToSize(String(value || "—"), contentWidth - 58);
    doc.text(wrapped, margin + 56, y);
    y += Math.max(6, wrapped.length * 5);
  };

  // Header Banner
  doc.setFillColor(...WISTERIA);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text("SquareFootIQ — ARCHITECTURAL & COST REPORT", margin, 14);
  doc.setFont("times", "italic");
  doc.setFontSize(10.5);
  doc.text(`Measure Your Land. Imagine Your Home. Build Your Future. · ${projectName}`, margin, 22);
  doc.setFont("times", "normal");
  doc.setFontSize(9);
  doc.text(
    `Generated: ${new Date().toISOString().slice(0, 10)} | Currency: ${currency} (${CURRENCIES[currency]?.name})`,
    margin,
    29.5
  );

  y = 44;
  doc.setTextColor(...PLUM);

  // 1. Project & Land Details
  addSectionTitle("1", "Project Details & Land Information");
  addKeyValueRow("Project Name", projectName);
  addKeyValueRow(
    "Location",
    `${constructionConfig.city}, ${constructionConfig.state}, ${constructionConfig.country} (${constructionConfig.locationNotes})`
  );
  addKeyValueRow("Entered Land Area", `${constructionConfig.landArea} ${constructionConfig.landUnit}`);
  addKeyValueRow("Converted Area", `${constructionResult.landAreaSqFt.toLocaleString()} sq. ft.`);
  addKeyValueRow("Plot Dimensions", `${landWidth} ft × ${landDepth} ft`);

  // 2. Building Requirements & Architectural Style
  addSectionTitle("2", "Building Requirements & Architectural Style");
  addKeyValueRow("Building Type", constructionConfig.buildingType);
  addKeyValueRow("Architectural Style", `${houseDesign.style} (${houseDesign.roofStyle})`);
  addKeyValueRow("Construction Quality", constructionConfig.quality.toUpperCase());
  addKeyValueRow(
    "Floors & Built-Up Area",
    `${constructionConfig.floors} Floor(s) · ${constructionResult.effectiveBuiltUpSqFt.toLocaleString()} sq. ft.`
  );
  addKeyValueRow(
    "Rooms",
    `${constructionConfig.bedrooms} Bed (${constructionConfig.masterBedrooms} Master), ${constructionConfig.bathrooms} Bath, ${constructionConfig.kitchens} Kitchen, ${constructionConfig.livingRooms} Living, ${constructionConfig.diningRooms} Dining, ${constructionConfig.balconies} Balcony`
  );

  // 3. Final Design Reference & Before/After Comparison
  addSectionTitle("3", "Before & After Concept Comparison & Design Reference");
  addKeyValueRow("Visualization Status", houseDesign.sourceLabel);
  addKeyValueRow("BEFORE (Original Idea)", houseDesign.originalIdeaSummary);
  addKeyValueRow("AFTER (Proposed Concept)", houseDesign.improvedConceptSummary);

  // 4. Floor Plan Summary
  const activePlan = floorPlanResult.options?.[selectedPlanIndex] || floorPlanResult.options?.[0];
  addSectionTitle("4", "Conceptual Floor Plan Layout");
  addKeyValueRow("Selected Plan Option", activePlan?.name || "Option A");
  addKeyValueRow(
    "Conceptual Envelope",
    `${activePlan?.buildWidthFt} ft × ${activePlan?.buildDepthFt} ft (${activePlan?.totalBuiltUpSqFt?.toLocaleString()} sq. ft.)`
  );
  addKeyValueRow("Drawing Disclaimer", floorPlanResult.disclaimer);
  activePlan?.floors.forEach((fl) => {
    const roomsList = fl.rooms.map((r) => `${r.name} (${r.w}'×${r.d}')`).join(", ");
    addKeyValueRow(fl.level, roomsList);
  });

  // 5. Construction Budget & Recommendations
  addSectionTitle("5", "Construction Budget & Recommendations");
  addKeyValueRow(
    "Exchange Rate Basis",
    isUsingLiveExchangeRates()
      ? "Live Exchange Rate API"
      : `Sample Exchange Rates (Ref: ${EXCHANGE_RATE_REFERENCE_DATE})`
  );
  addKeyValueRow("User Target Budget", formatCurrency(constructionConfig.targetBudget, currency));
  addKeyValueRow("Minimum Estimate", formatCurrency(constructionResult.minBudget, currency));
  addKeyValueRow("Expected Estimate", formatCurrency(constructionResult.expectedBudget, currency));
  addKeyValueRow("Maximum Estimate", formatCurrency(constructionResult.maxBudget, currency));
  addKeyValueRow("Estimated Cost / Sq. Ft.", formatCurrency(constructionResult.costPerSqFt, currency));
  y += 2;
  constructionResult.itemized.forEach((item) => {
    ensureSpace(6);
    doc.setFont("times", "normal");
    doc.setFontSize(9.5);
    doc.text(item.label, margin + 4, y);
    doc.text(`${item.sharePct}%`, margin + 122, y);
    doc.text(formatCurrency(item.amount, currency), margin + 146, y);
    y += 5.2;
  });

  y += 3;
  constructionResult.recommendations.forEach((rec) => {
    ensureSpace(8);
    const wrapped = doc.splitTextToSize(`Recommendation: ${rec}`, contentWidth - 4);
    doc.setFont("times", "italic");
    doc.setFontSize(9.5);
    doc.text(wrapped, margin + 2, y);
    y += wrapped.length * 4.8 + 1;
  });

  // 6. Material Estimation
  addSectionTitle("6", "Material Estimation (Sample Regional Rates)");
  addKeyValueRow("Material Rate Ref Date", `${RATE_REFERENCE_DATE} (${materialResult.region})`);
  ensureSpace(12);
  doc.setFillColor(...OPALINE);
  doc.rect(margin, y - 4, contentWidth, 7, "F");
  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("Material", margin + 2, y + 1);
  doc.text("Qty", margin + 78, y + 1);
  doc.text("Unit", margin + 98, y + 1);
  doc.text("Sample Rate", margin + 118, y + 1);
  doc.text("Estimated Total", margin + 148, y + 1);
  y += 7;
  doc.setFont("times", "normal");

  materialResult.items.forEach((m) => {
    ensureSpace(7);
    doc.text(m.name.slice(0, 36), margin + 2, y);
    doc.text(m.quantity.toLocaleString(), margin + 78, y);
    doc.text(m.unit, margin + 98, y);
    doc.text(formatCurrency(m.unitPrice, currency), margin + 118, y);
    doc.text(formatCurrency(m.totalPrice, currency), margin + 148, y);
    y += 5.5;
  });
  ensureSpace(8);
  doc.setFont("times", "bold");
  doc.text("Total Material Estimate:", margin + 98, y + 2);
  doc.text(formatCurrency(materialResult.totalMaterialCost, currency), margin + 148, y + 2);
  y += 10;

  // 7. Calculation Assumptions
  addSectionTitle("7", "Calculation Assumptions & Transparency Notice");
  [...constructionResult.assumptions, ...materialResult.assumptions].forEach((line) => {
    ensureSpace(8);
    const wrapped = doc.splitTextToSize(`• ${line}`, contentWidth - 4);
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.text(wrapped, margin + 2, y);
    y += wrapped.length * 4.6 + 1;
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("times", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(110, 90, 136);
    doc.text(
      `SquareFootIQ · Sample Architectural & Budget Study · Page ${i} of ${totalPages}`,
      margin,
      pageHeight - 8
    );
  }

  doc.save(`squarefootiq-${projectName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-report.pdf`);
}
