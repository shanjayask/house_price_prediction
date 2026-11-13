import React, { useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

export default function BeforeAfterSlider({
  beforeContent,
  afterContent,
  beforeLabel = "Empty Land",
  afterLabel = "Final Design",
}: {
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [position, setPosition] = useState(52);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(4, Math.min(96, pct)));
  };

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (e.buttons === 1) updateFromClientX(e.clientX);
        }}
        onClick={(e) => updateFromClientX(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) updateFromClientX(e.touches[0].clientX);
        }}
        className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[#CDC4DC] select-none cursor-ew-resize bg-white"
      >
        <div className="absolute inset-0">{afterContent}</div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {beforeContent}
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#261E31]/75 via-[#261E31]/25 to-transparent px-5 py-3 flex items-center justify-between text-xs text-white pointer-events-none">
          <span className="font-bold">{beforeLabel}</span>
          <span className="font-bold">{afterLabel}</span>
        </div>

        <div
          className="absolute inset-y-0 w-0.5 bg-[#6E5A88] pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#6E5A88] text-white border-2 border-white flex items-center justify-center shadow-md">
            <MoveHorizontal className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-1">
        <span className="text-xs text-[#4A3D5C] shrink-0">{beforeLabel}</span>
        <input
          type="range"
          min="4"
          max="96"
          value={Math.round(position)}
          onChange={(e) => setPosition(Number(e.target.value))}
          aria-label="Before and after comparison slider"
          className="w-full"
        />
        <span className="text-xs text-[#6E5A88] font-bold shrink-0">{afterLabel}</span>
      </div>
    </div>
  );
}
