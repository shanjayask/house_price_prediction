import React from "react";
import type { FloorLevelPlan } from "../../services/floorPlanService";

const ZONE_FILLS: Record<string, string> = {
  social: "#F3EEF8",
  private: "#FFFFFF",
  service: "#CDC4DC",
  circulation: "#E5DDF0",
  outdoor: "#DFD7EA",
};

export default function FloorPlanCanvas({
  floorData,
  buildWidthFt,
  buildDepthFt,
}: {
  floorData: FloorLevelPlan;
  buildWidthFt: number;
  buildDepthFt: number;
}) {
  if (!floorData) return null;

  const pad = 42;
  const scale = 12;
  const svgW = buildWidthFt * scale + pad * 2;
  const svgH = buildDepthFt * scale + pad * 2;

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#CDC4DC] bg-white p-4">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full max-w-3xl mx-auto h-auto"
        role="img"
        aria-label={`${floorData.level} conceptual blueprint`}
      >
        <defs>
          <pattern id="bpGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#CDC4DC" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width={svgW} height={svgH} fill="url(#bpGrid)" />

        <g stroke="#6E5A88" strokeWidth="1.2">
          <line x1={pad} y1={20} x2={pad + buildWidthFt * scale} y2={20} />
          <line x1={pad} y1={14} x2={pad} y2={26} />
          <line x1={pad + buildWidthFt * scale} y1={14} x2={pad + buildWidthFt * scale} y2={26} />

          <line x1={20} y1={pad} x2={20} y2={pad + buildDepthFt * scale} />
          <line x1={14} y1={pad} x2={26} y2={pad} />
          <line x1={14} y1={pad + buildDepthFt * scale} x2={26} y2={pad + buildDepthFt * scale} />
        </g>
        <text
          x={pad + (buildWidthFt * scale) / 2}
          y={15}
          textAnchor="middle"
          fill="#6E5A88"
          fontSize="11"
          fontFamily="Georgia, serif"
        >
          {buildWidthFt} ft
        </text>
        <text
          x={14}
          y={pad + (buildDepthFt * scale) / 2}
          textAnchor="middle"
          fill="#6E5A88"
          fontSize="11"
          fontFamily="Georgia, serif"
          transform={`rotate(-90 14 ${pad + (buildDepthFt * scale) / 2})`}
        >
          {buildDepthFt} ft
        </text>

        {floorData.rooms.map((room, idx) => {
          const rx = pad + room.x * scale;
          const ry = pad + room.y * scale;
          const rw = room.w * scale;
          const rd = room.d * scale;
          const fill = ZONE_FILLS[room.zone] || "#F3EEF8";
          return (
            <g key={`${room.name}-${idx}`}>
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rd}
                fill={fill}
                stroke="#6E5A88"
                strokeWidth="2.2"
              />
              <path
                d={`M ${rx + 6} ${ry + rd} A 14 14 0 0 1 ${rx + 20} ${ry + rd - 14}`}
                fill="none"
                stroke="#6E5A88"
                strokeOpacity="0.45"
                strokeWidth="1"
              />
              <text
                x={rx + rw / 2}
                y={ry + rd / 2 - 4}
                textAnchor="middle"
                fill="#261E31"
                fontSize="10.5"
                fontWeight="bold"
                fontFamily="Georgia, serif"
              >
                {room.name}
              </text>
              <text
                x={rx + rw / 2}
                y={ry + rd / 2 + 11}
                textAnchor="middle"
                fill="#6E5A88"
                fontSize="9.5"
                fontFamily="Georgia, serif"
              >
                {room.w}&apos; × {room.d}&apos; ({room.w * room.d} sq ft)
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
