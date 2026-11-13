import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
  showMark?: boolean;
}

/**
 * Official SquareFootIQ architectural wordmark & geometric house-square symbol.
 * Uses Georgia serif typography with "IQ" highlighted in Wisteria (#6E5A88).
 */
export default function BrandLogo({
  size = "md",
  variant = "light",
  showMark = true,
}: BrandLogoProps) {
  const iconSize = size === "lg" ? "w-9 h-9" : size === "sm" ? "w-5 h-5" : "w-7 h-7";
  const textSize =
    size === "lg"
      ? "text-2xl sm:text-3xl tracking-tight"
      : size === "sm"
      ? "text-sm tracking-tight"
      : "text-lg sm:text-xl tracking-tight";

  const baseColor = variant === "dark" ? "text-white" : "text-[#261E31]";
  const iqColor = variant === "dark" ? "text-[#CDC4DC]" : "text-[#6E5A88]";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      {showMark && (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${iconSize} shrink-0`}
          aria-hidden="true"
        >
          {/* Outer geometric square frame representing measured square footage */}
          <rect
            x="2.5"
            y="2.5"
            width="31"
            height="31"
            rx="6"
            fill={variant === "dark" ? "rgba(243, 238, 248, 0.12)" : "#F3EEF8"}
            stroke={variant === "dark" ? "#CDC4DC" : "#CDC4DC"}
            strokeWidth="1.5"
          />
          {/* Subtle architectural corner dimension ticks */}
          <path
            d="M7 9.5H10M7 9.5V12.5"
            stroke={variant === "dark" ? "#CDC4DC" : "#6E5A88"}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.65"
          />
          {/* Minimal architectural house outline inside the geometric square */}
          <path
            d="M9.5 18.5L18 11L26.5 18.5"
            stroke={variant === "dark" ? "#FFFFFF" : "#6E5A88"}
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 16.5V26.5H24V16.5"
            stroke={variant === "dark" ? "#FFFFFF" : "#261E31"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Wisteria accent interior pillar / doorway */}
          <rect
            x="16.25"
            y="20.5"
            width="3.5"
            height="6"
            rx="0.6"
            fill={variant === "dark" ? "#CDC4DC" : "#6E5A88"}
          />
        </svg>
      )}
      <span className={`font-bold leading-none ${textSize} ${baseColor}`}>
        SquareFoot<span className={iqColor}>IQ</span>
      </span>
    </span>
  );
}
