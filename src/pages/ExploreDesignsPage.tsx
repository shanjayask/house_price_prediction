import React from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { STYLE_GALLERY, COMPARISON_DESIGN_PRESETS } from "../data/designPresets";
import { ArchitecturalImageFrame, HouseElevationSVG } from "../components/visuals/ArchitecturalIllustrations";
import { COUNTRIES, QUALITY_TIERS } from "../data/regionalRates";
import { convertFromUsd, formatCurrency } from "../services/currencyService";
import CurrencySelector from "../components/common/CurrencySelector";

export default function ExploreDesignsPage() {
  const { startNewProjectAtStep, setView, currency, landInfo } = useProject();
  const countryMeta = COUNTRIES.find((c) => c.id === landInfo.country) || COUNTRIES[0];

  return (
    <div className="space-y-12 animate-editorial">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#CDC4DC] pb-6">
        <div className="max-w-2xl">
          <p className="text-xs font-bold text-[#6E5A88]">SquareFootIQ · Architectural Reference Library</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#261E31] mt-1">
            Explore House Designs &amp; Architectural Styles
          </h2>
          <p className="text-sm sm:text-base text-[#4A3D5C] mt-2">
            Browse curated architectural references. Select any style to begin your guided project
            with matching roof, material, and elevation defaults.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-48">
            <CurrencySelector />
          </div>
          <button
            type="button"
            onClick={() => setView("price-check")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#CDC4DC] bg-white text-xs font-bold text-[#6E5A88] hover:bg-[#CDC4DC]/30 whitespace-nowrap"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Existing Property Price Predictor</span>
          </button>
        </div>
      </div>

      {/* Benchmark Cost Comparison Row */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#261E31]">
          Sample Residential Benchmarks ({landInfo.country} · {currency})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {COMPARISON_DESIGN_PRESETS.map((preset) => {
            const qMult = QUALITY_TIERS[preset.quality]?.multiplier || 1;
            const estUsd = preset.builtUpAreaSqFt * countryMeta.baseConstructionUsdPerSqFt * qMult * 1.15;
            const estLocal = Math.round(convertFromUsd(estUsd, currency));
            return (
              <div
                key={preset.id}
                className="bg-white rounded-2xl border border-[#CDC4DC] overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3]">
                    <ArchitecturalImageFrame
                      src={preset.referenceImage}
                      alt={preset.name}
                      fallback={<HouseElevationSVG variant={preset.svgVariant} view="exterior" />}
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <p className="text-xs font-bold text-[#6E5A88]">{preset.style}</p>
                    <h4 className="text-base font-bold text-[#261E31]">{preset.name}</h4>
                    <p className="text-xs text-[#4A3D5C] leading-relaxed">{preset.summary}</p>
                    <div className="pt-2 border-t border-[#CDC4DC] text-xs flex justify-between tabular-nums">
                      <span className="text-[#4A3D5C]">
                        {preset.floors}F · {preset.bedrooms}B · {preset.builtUpAreaSqFt} sq.ft.
                      </span>
                      <span className="font-bold text-[#6E5A88]">
                        {formatCurrency(estLocal, currency, true)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={() => startNewProjectAtStep(1, preset.style)}
                    className="w-full py-2.5 rounded-xl bg-[#6E5A88] text-white text-xs font-bold hover:opacity-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Plan with {preset.style}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All 10 Architectural Styles */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#261E31]">All 10 Architectural Styles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STYLE_GALLERY.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => startNewProjectAtStep(1, style.id)}
              className="text-left bg-white rounded-2xl border border-[#CDC4DC] overflow-hidden hover:border-[#6E5A88] transition-colors"
            >
              <div className="aspect-[4/3]">
                <ArchitecturalImageFrame
                  src={style.image}
                  alt={style.id}
                  fallback={<HouseElevationSVG variant={style.svgVariant} view="exterior" />}
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-bold text-[#261E31]">{style.id}</p>
                <p className="text-xs text-[#4A3D5C] mt-1 line-clamp-2">{style.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
