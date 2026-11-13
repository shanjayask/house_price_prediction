import React from "react";
import { ArrowRight, MessageSquare, Calculator, Layers, Sparkles } from "lucide-react";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import { ArchitecturalImageFrame, HouseElevationSVG } from "../components/visuals/ArchitecturalIllustrations";
import { DESIGN_IMAGE_ASSETS, STYLE_GALLERY } from "../data/designPresets";
import BrandLogo from "../components/common/BrandLogo";

export default function LandingPage() {
  const { setView, startNewProjectAtStep } = useProject();
  const { isAuthenticated, user } = useAuth();

  const steps = [
    {
      num: "01",
      title: "Describe Your Land & Building",
      desc: "Enter plot dimensions or area in any unit, select your city, and pick from 7 residential or commercial building types.",
    },
    {
      num: "02",
      title: "Configure Rooms & Style",
      desc: "Set floors, bedrooms, bathrooms, facilities, and choose from 10 architectural aesthetics with custom material preferences.",
    },
    {
      num: "03",
      title: "Refine with AI Assistant",
      desc: "Discuss layout improvements, room flow, and budget optimizations in a calm SquareFootIQ conversational space.",
    },
    {
      num: "04",
      title: "Receive Complete Plan & Budget",
      desc: "Inspect your cohesive house design, scaled floor plans, before-and-after comparison, materials, and downloadable PDF.",
    },
  ];

  return (
    <div className="space-y-20 animate-editorial">
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#261E31] leading-[1.15]">
            Measure Your Land. Imagine Your Home. Build Your Future.
          </h1>
          <p className="text-base sm:text-lg text-[#4A3D5C] leading-relaxed">
            From an empty plot to your dream home — plan, visualize and estimate everything in one
            intelligent space.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => startNewProjectAtStep(1)}
              className="inline-flex items-center gap-2.5 bg-[#6E5A88] text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-95 transition-opacity whitespace-nowrap"
            >
              <span>Start Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setView("explore")}
              className="inline-flex items-center gap-2.5 bg-white text-[#6E5A88] border border-[#6E5A88]/40 px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#CDC4DC]/30 transition-colors whitespace-nowrap"
            >
              <span>Explore Designs</span>
            </button>
          </div>

          <p className="text-xs text-[#4A3D5C]">
            {isAuthenticated ? (
              <>
                Signed in as <strong className="text-[#261E31]">{user?.fullName}</strong> ·{" "}
                <button
                  type="button"
                  onClick={() => setView("result")}
                  className="font-bold text-[#6E5A88] hover:underline"
                >
                  Open Your Project Dashboard →
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="font-bold text-[#6E5A88] hover:underline"
                >
                  Login
                </button>{" "}
                or{" "}
                <button
                  type="button"
                  onClick={() => setView("signup")}
                  className="font-bold text-[#6E5A88] hover:underline"
                >
                  Create an Account
                </button>
              </>
            )}
          </p>
        </div>

        <div className="lg:col-span-7 relative">
          <div className="rounded-2xl overflow-hidden border border-[#CDC4DC] bg-white aspect-[16/10]">
            <ArchitecturalImageFrame
              src={DESIGN_IMAGE_ASSETS.luxuryVilla}
              alt="3D architectural luxury residence visualization at twilight"
              fallback={<HouseElevationSVG variant="modern" view="exterior" />}
            />
          </div>
          <p className="text-xs text-[#4A3D5C] italic mt-2.5">
            Reference architectural visualization · Guided workflow from empty plot to complete cost dossier
          </p>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="space-y-8 border-t border-[#CDC4DC] pt-14">
        <div className="max-w-2xl">
          <p className="text-xs text-[#6E5A88] font-bold">How It Works</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
            Four Guided Steps From Empty Plot to Buildable Plan
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-white rounded-2xl border border-[#CDC4DC] p-6 space-y-3">
              <span className="text-xs font-bold text-[#6E5A88] tabular-nums">{s.num}</span>
              <h3 className="text-lg font-bold text-[#261E31]">{s.title}</h3>
              <p className="text-sm text-[#4A3D5C] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPLORE ARCHITECTURAL STYLES */}
      <section className="space-y-8 border-t border-[#CDC4DC] pt-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs text-[#6E5A88] font-bold">Architectural Aesthetics</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31] mt-1">
              Explore Architectural Styles
            </h2>
            <p className="text-sm text-[#4A3D5C] mt-1.5">
              Select any reference style below to begin a tailored project brief with matching roof,
              glazing, and material defaults.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setView("explore")}
            className="text-sm font-bold text-[#6E5A88] hover:underline whitespace-nowrap"
          >
            View All 10 Styles →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {STYLE_GALLERY.slice(0, 4).map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => startNewProjectAtStep(1, style.id)}
              className="group text-left bg-white rounded-2xl border border-[#CDC4DC] overflow-hidden hover:border-[#6E5A88] transition-colors flex flex-col"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#CDC4DC]/30">
                <ArchitecturalImageFrame
                  src={style.image}
                  alt={`${style.id} architectural style reference`}
                  fallback={<HouseElevationSVG variant={style.svgVariant} view="exterior" />}
                  className="group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <p className="text-base font-bold text-[#261E31]">{style.id}</p>
                <p className="text-xs text-[#4A3D5C] leading-relaxed">{style.tagline}</p>
                <p className="text-xs font-bold text-[#6E5A88] pt-2">Plan in {style.id} →</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 4. DISCOVER HOUSE DESIGN IDEAS */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-[#CDC4DC] pt-14">
        <div className="lg:col-span-6 space-y-5">
          <p className="text-xs text-[#6E5A88] font-bold">Spatial &amp; Interior Harmony</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#261E31]">
            Discover House Design Ideas That Balance Form &amp; Daily Living
          </h2>
          <p className="text-sm sm:text-base text-[#4A3D5C] leading-relaxed">
            Every generated project pairs exterior massing with ground and upper-floor conceptual
            layouts, natural light zoning, and curated interior palettes across living rooms,
            bedrooms, kitchens, and baths.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-white border border-[#CDC4DC] p-4">
              <Layers className="w-5 h-5 text-[#6E5A88] mb-2" />
              <p className="text-sm font-bold text-[#261E31]">Before &amp; After Transformation</p>
              <p className="text-xs text-[#4A3D5C] mt-1">
                Compare empty land and your initial idea against the refined design.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-[#CDC4DC] p-4">
              <Sparkles className="w-5 h-5 text-[#6E5A88] mb-2" />
              <p className="text-sm font-bold text-[#261E31]">Interior Material Curation</p>
              <p className="text-xs text-[#4A3D5C] mt-1">
                Switch styles across rooms without losing your structural footprint.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-[#CDC4DC] bg-white aspect-[4/3]">
            <ArchitecturalImageFrame
              src={DESIGN_IMAGE_ASSETS.heroVilla}
              alt="Modern courtyard villa exterior reference"
              fallback={<HouseElevationSVG variant="modern" view="exterior" />}
            />
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#CDC4DC] bg-white aspect-[4/3] sm:translate-y-6">
            <ArchitecturalImageFrame
              src={DESIGN_IMAGE_ASSETS.interiorLiving}
              alt="Modern living room interior reference"
              fallback={<HouseElevationSVG variant="minimalist" view="front" />}
            />
          </div>
        </div>
      </section>

      {/* 5 & 6. CONSTRUCTION COST ESTIMATION + AI ASSISTANT INTRO */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-[#CDC4DC] pt-14">
        <div className="rounded-2xl bg-white border border-[#CDC4DC] p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <Calculator className="w-6 h-6 text-[#6E5A88]" />
            <p className="text-xs text-[#6E5A88] font-bold">Transparent Cost Engineering</p>
            <h3 className="text-2xl font-bold text-[#261E31]">
              Construction Cost &amp; Material Estimation
            </h3>
            <p className="text-sm text-[#4A3D5C] leading-relaxed">
              Automatically converts acres, cents, hectares, sq.m., and sq.yd. into square feet,
              applies realistic plot coverage setbacks, and itemizes cement, steel, bricks, sand,
              tiles, paint, labour, and fees across 6 currencies (INR, USD, EUR, GBP, AED, SGD).
            </p>
          </div>
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => startNewProjectAtStep(5)}
              className="px-4 py-2.5 rounded-xl bg-[#F3EEF8] border border-[#CDC4DC] text-xs font-bold text-[#6E5A88] hover:bg-[#CDC4DC]/40"
            >
              Estimate Construction Budget
            </button>
            <button
              type="button"
              onClick={() => setView("price-check")}
              className="px-4 py-2.5 rounded-xl bg-white border border-[#CDC4DC] text-xs font-bold text-[#261E31] hover:bg-[#F3EEF8]"
            >
              Existing Property Price Predictor
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-[#CDC4DC]/35 border border-[#CDC4DC] p-8 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <MessageSquare className="w-6 h-6 text-[#6E5A88]" />
            <p className="text-xs text-[#6E5A88] font-bold">SquareFootIQ Planning Assistant</p>
            <h3 className="text-2xl font-bold text-[#261E31]">
              SquareFootIQ AI House Planning Assistant
            </h3>
            <p className="text-sm text-[#4A3D5C] leading-relaxed">
              Describe your goals naturally—ask how to arrange rooms across floors, swap materials
              to hit a ₹60 lakh or $350k target budget, or refine your exterior elevation before
              generating your final plan.
            </p>
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setView("assistant")}
              className="px-5 py-2.5 rounded-xl bg-[#6E5A88] text-white text-xs font-bold hover:opacity-95"
            >
              Open SquareFootIQ Assistant
            </button>
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="rounded-2xl bg-[#6E5A88] text-white p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to Turn Your Plot Into a Complete Architectural Plan?
          </h2>
          <p className="text-sm sm:text-base text-[#F3EEF8]/90">
            Begin the guided 5-step builder—your inputs stay saved throughout your session so you
            can refine anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={() => startNewProjectAtStep(1)}
          className="inline-flex items-center gap-2.5 bg-white text-[#6E5A88] px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#F3EEF8] transition-colors whitespace-nowrap shrink-0"
        >
          <span>Start Your Project</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}
