import React, { useState } from "react";

export function ArchitecturalImageFrame({
  src,
  alt,
  fallback,
  className = "",
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return <div className={`w-full h-full ${className}`}>{fallback}</div>;
  }
  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}

export function HouseElevationSVG({
  variant = "modern",
  view = "exterior",
  className = "",
}: {
  variant?: string;
  view?: "exterior" | "front" | "side";
  className?: string;
}) {
  const isFront = view === "front";
  const isSide = view === "side";

  return (
    <svg
      viewBox="0 0 800 460"
      className={`w-full h-full object-cover ${className}`}
      role="img"
      aria-label={`${variant} architectural ${view} illustration`}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3EEF8" />
          <stop offset="100%" stopColor="#CDC4DC" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6E5A88" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#261E31" stopOpacity="0.92" />
        </linearGradient>
      </defs>

      <rect width="800" height="460" fill="url(#skyGrad)" />
      <g stroke="#6E5A88" strokeOpacity="0.12" strokeWidth="1">
        {[90, 180, 270, 360].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} strokeDasharray="6 6" />
        ))}
        {[160, 320, 480, 640].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="460" strokeDasharray="4 8" />
        ))}
      </g>

      <circle cx="665" cy="95" r="42" fill="#F3EEF8" stroke="#6E5A88" strokeOpacity="0.25" strokeWidth="1.5" />

      <rect x="0" y="365" width="800" height="95" fill="#CDC4DC" />
      <line x1="0" y1="365" x2="800" y2="365" stroke="#6E5A88" strokeWidth="2" />

      <g fill="#6E5A88" fillOpacity="0.35">
        <ellipse cx="92" cy="285" rx="28" ry="62" />
        <rect x="89" y="330" width="6" height="35" fill="#261E31" fillOpacity="0.5" />
        <ellipse cx="715" cy="300" rx="22" ry="50" />
        <rect x="712" y="335" width="5" height="30" fill="#261E31" fillOpacity="0.5" />
      </g>

      {isSide ? (
        <g>
          <rect x="210" y="210" width="380" height="155" fill="#FFFFFF" stroke="#6E5A88" strokeWidth="2.5" />
          <rect x="240" y="125" width="280" height="85" fill="#F3EEF8" stroke="#6E5A88" strokeWidth="2.5" />
          <rect x="195" y="112" width="350" height="15" fill="#6E5A88" />
          <rect x="275" y="145" width="75" height="45" fill="url(#glassGrad)" />
          <rect x="385" y="145" width="95" height="45" fill="url(#glassGrad)" />
          <rect x="255" y="245" width="120" height="85" fill="url(#glassGrad)" />
          <rect x="425" y="245" width="110" height="120" fill="#CDC4DC" stroke="#6E5A88" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <rect x="145" y="228" width="500" height="137" fill="#FFFFFF" stroke="#6E5A88" strokeWidth="2.5" />
          <rect x="495" y="242" width="150" height="123" fill="#F3EEF8" stroke="#6E5A88" strokeWidth="2" />
          <line x1="515" y1="275" x2="625" y2="275" stroke="#6E5A88" strokeOpacity="0.4" />
          <line x1="515" y1="305" x2="625" y2="305" stroke="#6E5A88" strokeOpacity="0.4" />
          <line x1="515" y1="335" x2="625" y2="335" stroke="#6E5A88" strokeOpacity="0.4" />

          {variant !== "minimalist" && (
            <rect x="180" y="125" width="340" height="103" fill="#F3EEF8" stroke="#6E5A88" strokeWidth="2.5" />
          )}

          {variant === "mediterranean" ? (
            <polygon points="160,125 350,62 540,125" fill="#6E5A88" stroke="#261E31" strokeWidth="2" />
          ) : variant === "duplex" ? (
            <polygon points="165,125 535,95 535,125" fill="#6E5A88" />
          ) : variant === "minimalist" ? (
            <rect x="125" y="212" width="540" height="16" fill="#6E5A88" />
          ) : (
            <rect x="155" y="112" width="390" height="15" fill="#6E5A88" />
          )}

          {variant !== "minimalist" && (
            <rect x="370" y="188" width="160" height="40" fill="#CDC4DC" fillOpacity="0.45" stroke="#6E5A88" strokeWidth="2" />
          )}

          {variant !== "minimalist" && (
            <>
              <rect x="205" y="145" width="130" height="62" fill="url(#glassGrad)" />
              <line x1="270" y1="145" x2="270" y2="207" stroke="#F3EEF8" strokeWidth="1.5" />
              <rect x="385" y="145" width="110" height="43" fill="url(#glassGrad)" />
            </>
          )}

          <rect x="175" y="252" width="155" height="92" fill="url(#glassGrad)" />
          <line x1="227" y1="252" x2="227" y2="344" stroke="#F3EEF8" strokeWidth="1.5" />
          <line x1="278" y1="252" x2="278" y2="344" stroke="#F3EEF8" strokeWidth="1.5" />

          <rect x="368" y="264" width="68" height="101" fill="#6E5A88" stroke="#261E31" strokeWidth="2" />
          <circle cx="424" cy="318" r="3.5" fill="#F3EEF8" />

          {isFront && (
            <g stroke="#6E5A88" strokeWidth="1.2">
              <line x1="145" y1="395" x2="645" y2="395" />
              <line x1="145" y1="388" x2="145" y2="402" />
              <line x1="645" y1="388" x2="645" y2="402" />
            </g>
          )}
        </g>
      )}

      <text x="28" y="42" fill="#6E5A88" fontSize="13" fontFamily="Georgia, serif" letterSpacing="2">
        {view.toUpperCase()} ARCHITECTURAL STUDY · {variant.toUpperCase()}
      </text>
    </svg>
  );
}

export function EmptyLandSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 460" className={`w-full h-full object-cover ${className}`} role="img" aria-label="Empty plot starting stage">
      <defs>
        <linearGradient id="landSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F3EEF8" />
          <stop offset="100%" stopColor="#CDC4DC" />
        </linearGradient>
      </defs>
      <rect width="800" height="460" fill="url(#landSky)" />
      <path d="M0 320 Q220 295 450 318 T800 310 L800 460 L0 460 Z" fill="#CDC4DC" />
      <line x1="0" y1="320" x2="800" y2="320" stroke="#6E5A88" strokeOpacity="0.4" strokeWidth="1.5" />

      <polygon
        points="160,365 260,315 585,315 660,365"
        fill="#F3EEF8"
        fillOpacity="0.55"
        stroke="#6E5A88"
        strokeWidth="2.5"
        strokeDasharray="10 6"
      />
      {[
        [160, 365],
        [260, 315],
        [585, 315],
        [660, 365],
      ].map(([cx, cy], idx) => (
        <g key={idx}>
          <line x1={cx} y1={cy - 24} x2={cx} y2={cy} stroke="#6E5A88" strokeWidth="3" />
          <circle cx={cx} cy={cy - 24} r="5" fill="#6E5A88" />
        </g>
      ))}

      <ellipse cx="115" cy="285" rx="22" ry="38" fill="#6E5A88" fillOpacity="0.22" />
      <ellipse cx="695" cy="278" rx="26" ry="42" fill="#6E5A88" fillOpacity="0.22" />

      <text x="28" y="42" fill="#6E5A88" fontSize="13" fontFamily="Georgia, serif" letterSpacing="2">
        STARTING STAGE · UNDEVELOPED SURVEYED PLOT
      </text>
    </svg>
  );
}

export function ConstructionStageSVG({ stageIndex = 0 }: { stageIndex?: number }) {
  if (stageIndex === 0) return <EmptyLandSVG />;
  if (stageIndex === 9) return <HouseElevationSVG variant="modern" view="exterior" />;

  return (
    <svg viewBox="0 0 800 460" className="w-full h-full object-cover" role="img" aria-label={`Construction stage ${stageIndex + 1}`}>
      <rect width="800" height="460" fill="#F3EEF8" />
      <rect x="0" y="365" width="800" height="95" fill="#CDC4DC" />
      <line x1="0" y1="365" x2="800" y2="365" stroke="#6E5A88" strokeWidth="2" />

      {stageIndex >= 1 && (
        <rect x="145" y="352" width="510" height="13" fill="#6E5A88" fillOpacity="0.25" stroke="#6E5A88" strokeDasharray="6 4" />
      )}
      {stageIndex >= 2 && (
        <g>
          <rect x="160" y="348" width="480" height="22" fill="#6E5A88" stroke="#261E31" strokeWidth="1.5" />
          {[190, 310, 440, 580].map((x) => (
            <rect key={x} x={x} y="340" width="32" height="28" fill="#261E31" fillOpacity="0.7" />
          ))}
        </g>
      )}
      {stageIndex >= 3 && (
        <g fill="#6E5A88" fillOpacity="0.85" stroke="#261E31" strokeWidth="1.2">
          {[198, 318, 448, 588].map((x) => (
            <rect key={x} x={x} y="140" width="16" height="210" />
          ))}
          <rect x="180" y="232" width="445" height="14" />
          <rect x="180" y="132" width="445" height="14" />
        </g>
      )}
      {stageIndex >= 4 && (
        <g fill="#CDC4DC" fillOpacity="0.85" stroke="#6E5A88" strokeWidth="1.5">
          <rect x="214" y="246" width="104" height="102" />
          <rect x="334" y="246" width="114" height="102" />
          <rect x="464" y="246" width="124" height="102" />
          <rect x="214" y="146" width="234" height="86" />
        </g>
      )}
      {stageIndex >= 5 && (
        <g>
          <rect x="155" y="114" width="490" height="18" fill="#261E31" />
          <rect x="175" y="102" width="450" height="12" fill="#6E5A88" />
        </g>
      )}
      {stageIndex >= 6 && (
        <g stroke="#6E5A88" strokeWidth="2.5" strokeDasharray="5 4" fill="none">
          <path d="M240 340 V270 H420 V175" />
          <path d="M510 340 V260 H560" />
          <circle cx="240" cy="270" r="5" fill="#F3EEF8" />
          <circle cx="420" cy="175" r="5" fill="#F3EEF8" />
        </g>
      )}
      {stageIndex >= 7 && (
        <g>
          <rect x="198" y="146" width="390" height="202" fill="#FFFFFF" fillOpacity="0.85" stroke="#6E5A88" strokeWidth="2" />
          <line x1="198" y1="246" x2="588" y2="246" stroke="#6E5A88" strokeWidth="2" />
        </g>
      )}
      {stageIndex >= 8 && (
        <g>
          <rect x="228" y="162" width="110" height="60" fill="#6E5A88" fillOpacity="0.85" />
          <rect x="368" y="162" width="90" height="60" fill="#6E5A88" fillOpacity="0.85" />
          <rect x="228" y="264" width="135" height="72" fill="#6E5A88" fillOpacity="0.85" />
          <rect x="405" y="266" width="62" height="82" fill="#261E31" />
        </g>
      )}

      <text x="28" y="42" fill="#6E5A88" fontSize="13" fontFamily="Georgia, serif" letterSpacing="2">
        PHASE {stageIndex + 1} OF 10 · STRUCTURAL TIMELINE
      </text>
    </svg>
  );
}

export function InteriorRoomSVG({
  roomType = "Living Room",
  swatches = ["#6E5A88", "#CDC4DC", "#F3EEF8", "#261E31"],
}: {
  roomType?: string;
  swatches?: string[];
}) {
  const [primary, secondary, light, dark] = swatches;
  return (
    <svg viewBox="0 0 800 440" className="w-full h-full object-cover" role="img" aria-label={`${roomType} interior preview`}>
      <rect width="800" height="320" fill={light} />
      <polygon points="0,0 135,55 135,310 0,390" fill={secondary} fillOpacity="0.7" />
      <polygon points="800,0 665,55 665,310 800,390" fill={secondary} fillOpacity="0.55" />
      <polygon points="0,390 135,310 665,310 800,390 800,440 0,440" fill={secondary} />
      <line x1="135" y1="310" x2="665" y2="310" stroke={dark} strokeOpacity="0.35" strokeWidth="2" />

      <rect x="485" y="75" width="150" height="190" fill="#FFFFFF" stroke={primary} strokeWidth="3" />
      <line x1="560" y1="75" x2="560" y2="265" stroke={primary} strokeWidth="2" />
      <line x1="485" y1="170" x2="635" y2="170" stroke={primary} strokeWidth="2" />

      <rect x="210" y="92" width="160" height="105" fill={primary} fillOpacity="0.22" stroke={primary} strokeWidth="2" />
      <circle cx="290" cy="144" r="32" fill={primary} fillOpacity="0.45" />

      {roomType === "Bedroom" ? (
        <g>
          <rect x="220" y="242" width="230" height="90" rx="8" fill={primary} />
          <rect x="235" y="220" width="85" height="30" rx="4" fill={light} stroke={dark} />
          <rect x="335" y="220" width="85" height="30" rx="4" fill={light} stroke={dark} />
        </g>
      ) : roomType === "Kitchen" ? (
        <g>
          <rect x="175" y="218" width="290" height="92" fill={primary} />
          <rect x="165" y="208" width="310" height="14" fill={dark} />
          <rect x="195" y="85" width="250" height="75" fill={secondary} stroke={primary} strokeWidth="2" />
        </g>
      ) : (
        <g>
          <rect x="185" y="242" width="260" height="68" rx="8" fill={primary} />
          <rect x="198" y="224" width="234" height="28" rx="6" fill={secondary} stroke={primary} strokeWidth="2" />
          <rect x="255" y="328" width="140" height="26" rx="4" fill={dark} />
        </g>
      )}

      <line x1="400" y1="0" x2="400" y2="62" stroke={dark} strokeWidth="2" />
      <ellipse cx="400" cy="72" rx="34" ry="12" fill={primary} />

      <text x="26" y="34" fill={dark} fontSize="12" fontFamily="Georgia, serif" letterSpacing="2">
        CONCEPTUAL INTERIOR · {roomType.toUpperCase()}
      </text>
    </svg>
  );
}
