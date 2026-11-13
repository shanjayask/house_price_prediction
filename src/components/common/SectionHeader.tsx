import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ eyebrow, title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#CDC4DC]">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-xs text-[#6E5A88] font-bold tracking-wide mb-1.5">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261E31] leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-[#4A3D5C] mt-2 leading-relaxed">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
