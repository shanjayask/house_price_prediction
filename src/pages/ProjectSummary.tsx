import React from "react";
import { Edit3, MessageSquare, Sparkles } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { QUALITY_TIERS } from "../data/regionalRates";
import { formatCurrency } from "../services/currencyService";

export default function ProjectSummary() {
  const {
    setView,
    startNewProjectAtStep,
    generateDreamHouse,
    landInfo,
    constructionConfig,
    houseDesignInput,
    currency,
    constructionResult,
  } = useProject();

  const facilities = [
    constructionConfig.hasCarParking && "Car Parking",
    constructionConfig.hasGarden && "Garden",
    constructionConfig.hasSwimmingPool && "Swimming Pool",
    constructionConfig.hasTerrace && "Terrace",
    constructionConfig.hasHomeTheatre && "Home Theatre",
    constructionConfig.hasLift && "Lift / Elevator",
    constructionConfig.hasUtilityRoom && "Utility Room",
    constructionConfig.hasOutdoorSeating && "Outdoor Seating",
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-8 animate-editorial max-w-5xl mx-auto">
      <div className="border-b border-[#CDC4DC] pb-6">
        <p className="text-xs font-bold text-[#6E5A88]">Step 6 · SquareFootIQ Project Brief</p>
        <h2 className="text-2xl sm:text-4xl font-bold text-[#261E31] mt-1">
          Review Your House Project Summary
        </h2>
        <p className="text-sm sm:text-base text-[#4A3D5C] mt-2">
          Verify your entered land, spatial requirements, style, and budget before consulting the
          SquareFootIQ AI House Planning Assistant or generating your complete plan.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-[#CDC4DC] p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#6E5A88] border-b border-[#CDC4DC] pb-2">
            Site &amp; Architectural Program
          </h3>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Land Area</dt>
              <dd className="font-bold text-[#261E31] text-right tabular-nums">
                {landInfo.landArea} {landInfo.landUnit} ({constructionResult.landAreaSqFt.toLocaleString()}{" "}
                sq. ft.)
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Location</dt>
              <dd className="font-bold text-[#261E31] text-right">
                {landInfo.city}, {landInfo.state}, {landInfo.country}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Building Type</dt>
              <dd className="font-bold text-[#261E31]">{constructionConfig.buildingType}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Number of Floors</dt>
              <dd className="font-bold text-[#261E31] tabular-nums">
                {constructionConfig.floors} Floor(s) ·{" "}
                {constructionResult.effectiveBuiltUpSqFt.toLocaleString()} sq. ft. built-up
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Bedrooms &amp; Bathrooms</dt>
              <dd className="font-bold text-[#261E31] tabular-nums">
                {constructionConfig.bedrooms} Bed ({constructionConfig.masterBedrooms} Master) ·{" "}
                {constructionConfig.bathrooms} Bath
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Other Rooms</dt>
              <dd className="font-bold text-[#261E31] text-right tabular-nums">
                {constructionConfig.kitchens} Kitchen · {constructionConfig.livingRooms} Living ·{" "}
                {constructionConfig.diningRooms} Dining · {constructionConfig.studyRooms} Study ·{" "}
                {constructionConfig.balconies} Balcony
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#6E5A88] border-b border-[#CDC4DC] pb-2">
            Style, Facilities &amp; Budget
          </h3>
          <dl className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Architectural Style</dt>
              <dd className="font-bold text-[#261E31]">{houseDesignInput.style}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Construction Quality</dt>
              <dd className="font-bold text-[#261E31]">
                {QUALITY_TIERS[constructionConfig.quality]?.label}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Preferred Currency</dt>
              <dd className="font-bold text-[#261E31]">{currency}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Your Target Budget</dt>
              <dd className="font-bold text-[#6E5A88] tabular-nums">
                {formatCurrency(constructionConfig.targetBudget, currency)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#4A3D5C]">Sample Cost Estimate</dt>
              <dd className="font-bold text-[#261E31] tabular-nums">
                {formatCurrency(constructionResult.expectedBudget, currency)}
              </dd>
            </div>
            <div className="pt-1">
              <dt className="text-[#4A3D5C] mb-1">Selected Facilities</dt>
              <dd className="font-bold text-[#261E31] text-xs leading-relaxed">
                {facilities.length > 0 ? facilities.join(" · ") : "Standard core layout"}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => startNewProjectAtStep(1)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#CDC4DC] bg-white text-sm font-bold text-[#261E31] hover:bg-[#CDC4DC]/35"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Details</span>
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setView("assistant")}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-[#6E5A88] bg-white text-sm font-bold text-[#6E5A88] hover:bg-[#F3EEF8]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Continue to AI Assistant</span>
          </button>
          <button
            type="button"
            onClick={generateDreamHouse}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6E5A88] text-white text-sm font-bold hover:opacity-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My House Plan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
