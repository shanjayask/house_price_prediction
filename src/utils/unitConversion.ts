export interface LandUnitOption {
  id: string;
  label: string;
  short: string;
  toSqFt: number;
}

export const LAND_UNITS: LandUnitOption[] = [
  { id: "sqft", label: "Square Feet (sq. ft.)", short: "sq. ft.", toSqFt: 1 },
  { id: "sqm", label: "Square Metres (sq. m.)", short: "sq. m.", toSqFt: 10.7639104 },
  { id: "sqyd", label: "Square Yards (sq. yd.)", short: "sq. yd.", toSqFt: 9 },
  { id: "cents", label: "Cents", short: "cents", toSqFt: 435.6 },
  { id: "acres", label: "Acres", short: "acres", toSqFt: 43560 },
  { id: "hectares", label: "Hectares (ha)", short: "ha", toSqFt: 107639.104 },
];

export function convertToSqFt(value: number | string, unitId: string): number {
  const numeric = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(numeric) || numeric < 0) return 0;
  const unit = LAND_UNITS.find((u) => u.id === unitId) || LAND_UNITS[0];
  return Number((numeric * unit.toSqFt).toFixed(2));
}

export function convertFromSqFt(sqFtValue: number, targetUnitId: string): number {
  if (Number.isNaN(sqFtValue) || sqFtValue < 0) return 0;
  const unit = LAND_UNITS.find((u) => u.id === targetUnitId) || LAND_UNITS[0];
  return Number((sqFtValue / unit.toSqFt).toFixed(2));
}

export function getUnitLabel(unitId: string): string {
  const unit = LAND_UNITS.find((u) => u.id === unitId);
  return unit ? unit.short : "sq. ft.";
}
