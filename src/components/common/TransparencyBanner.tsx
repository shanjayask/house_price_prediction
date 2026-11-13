import React from "react";
import { Info } from "lucide-react";

interface TransparencyBannerProps {
  title: string;
  message: string;
  meta?: string;
}

export default function TransparencyBanner({ title, message, meta }: TransparencyBannerProps) {
  return (
    <div className="rounded-xl border border-[#CDC4DC] bg-[#CDC4DC]/30 px-5 py-3.5 flex items-start gap-3">
      <Info className="w-4 h-4 text-[#6E5A88] shrink-0 mt-0.5" strokeWidth={1.8} />
      <div className="text-xs leading-relaxed text-[#261E31]">
        <span className="font-bold text-[#6E5A88]">{title}: </span>
        <span>{message}</span>
        {meta && <span className="block mt-1 text-[#4A3D5C] italic">{meta}</span>}
      </div>
    </div>
  );
}
