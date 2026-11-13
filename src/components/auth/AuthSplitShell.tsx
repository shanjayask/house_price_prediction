import React from "react";
import BrandLogo from "../common/BrandLogo";
import { ArchitecturalImageFrame, HouseElevationSVG } from "../visuals/ArchitecturalIllustrations";
import { DESIGN_IMAGE_ASSETS } from "../../data/designPresets";

interface AuthSplitShellProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  imageSrc?: string;
  imageCaption?: string;
  children: React.ReactNode;
}

export default function AuthSplitShell({
  eyebrow,
  title,
  subtitle,
  imageSrc = DESIGN_IMAGE_ASSETS.luxuryVilla,
  imageCaption = "Reference architectural visualization · SquareFootIQ Planning Suite",
  children,
}: AuthSplitShellProps) {
  return (
    <div className="animate-editorial max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-[#CDC4DC] bg-white overflow-hidden">
        {/* Left Architectural Showcase Column */}
        <aside className="lg:col-span-6 relative min-h-[260px] sm:min-h-[320px] lg:min-h-[640px] bg-[#261E31] flex flex-col justify-between">
          <div className="absolute inset-0">
            <ArchitecturalImageFrame
              src={imageSrc}
              alt="Dream house architectural visualization"
              fallback={<HouseElevationSVG variant="modern" view="exterior" />}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#261E31]/90 via-[#261E31]/40 to-[#261E31]/65"
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
            <BrandLogo size="md" variant="dark" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 space-y-3 text-white">
            <p className="text-xs font-bold text-[#CDC4DC]">
              Measure Your Land. Imagine Your Home. Build Your Future.
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug">
              From an empty plot to your dream home — in one intelligent space.
            </h2>
            <p className="text-xs text-[#F3EEF8]/85 italic pt-1">{imageCaption}</p>
          </div>
        </aside>

        {/* Right Form Column */}
        <section className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-[#6E5A88]">{eyebrow}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#261E31]">{title}</h1>
              <p className="text-sm text-[#4A3D5C] leading-relaxed">{subtitle}</p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
