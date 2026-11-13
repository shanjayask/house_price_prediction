import { RATE_REFERENCE_DATE } from "../data/regionalRates";

export const EXCHANGE_RATE_REFERENCE_DATE = RATE_REFERENCE_DATE;

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED" | "SGD";

export interface CurrencyMeta {
  code: CurrencyCode;
  name: string;
  symbol: string;
  locale: string;
  sampleUsdRate: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", locale: "en-IN", sampleUsdRate: 84.5 },
  USD: { code: "USD", name: "US Dollar", symbol: "$", locale: "en-US", sampleUsdRate: 1.0 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", locale: "de-DE", sampleUsdRate: 0.92 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", locale: "en-GB", sampleUsdRate: 0.78 },
  AED: { code: "AED", name: "UAE Dirham", symbol: "د.إ", locale: "en-AE", sampleUsdRate: 3.67 },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "S$", locale: "en-SG", sampleUsdRate: 1.34 },
};

const activeRates: Record<CurrencyCode, number> = {
  INR: CURRENCIES.INR.sampleUsdRate,
  USD: CURRENCIES.USD.sampleUsdRate,
  EUR: CURRENCIES.EUR.sampleUsdRate,
  GBP: CURRENCIES.GBP.sampleUsdRate,
  AED: CURRENCIES.AED.sampleUsdRate,
  SGD: CURRENCIES.SGD.sampleUsdRate,
};

let usingLiveRates = false;

export async function syncExchangeRatesIfAvailable(): Promise<{
  isLive: boolean;
  referenceDate: string;
}> {
  const apiUrl = import.meta.env.VITE_EXCHANGE_RATE_API_URL as string | undefined;
  if (!apiUrl) {
    usingLiveRates = false;
    return { isLive: false, referenceDate: EXCHANGE_RATE_REFERENCE_DATE };
  }

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Exchange rate fetch failed");
    const data = (await res.json()) as { rates?: Record<string, number> };
    if (data && data.rates) {
      (Object.keys(CURRENCIES) as CurrencyCode[]).forEach((code) => {
        const nextRate = data.rates?.[code];
        if (typeof nextRate === "number" && nextRate > 0) {
          activeRates[code] = nextRate;
        }
      });
      usingLiveRates = true;
    }
  } catch {
    usingLiveRates = false;
  }

  return { isLive: usingLiveRates, referenceDate: EXCHANGE_RATE_REFERENCE_DATE };
}

export function isUsingLiveExchangeRates(): boolean {
  return usingLiveRates;
}

export function getActiveExchangeRate(currencyCode: CurrencyCode): number {
  return activeRates[currencyCode] || 1;
}

export function convertFromUsd(amountUsd: number, currencyCode: CurrencyCode): number {
  const rate = activeRates[currencyCode] || 1;
  return amountUsd * rate;
}

export function convertToUsd(amountLocal: number, currencyCode: CurrencyCode): number {
  const rate = activeRates[currencyCode] || 1;
  return amountLocal / rate;
}

export function formatCurrency(
  amountInTargetCurrency: number,
  currencyCode: CurrencyCode = "INR",
  compact = false
): string {
  const meta = CURRENCIES[currencyCode] || CURRENCIES.INR;
  const safeVal = Number.isFinite(amountInTargetCurrency) ? amountInTargetCurrency : 0;

  if (compact) {
    if (currencyCode === "INR") {
      if (safeVal >= 1e7) return `${meta.symbol}${(safeVal / 1e7).toFixed(2)} Cr`;
      if (safeVal >= 1e5) return `${meta.symbol}${(safeVal / 1e5).toFixed(2)} L`;
    } else {
      if (safeVal >= 1e6) return `${meta.symbol}${(safeVal / 1e6).toFixed(2)}M`;
      if (safeVal >= 1e3) return `${meta.symbol}${(safeVal / 1e3).toFixed(1)}K`;
    }
  }

  try {
    return new Intl.NumberFormat(meta.locale, {
      style: "currency",
      currency: meta.code,
      maximumFractionDigits: 0,
    }).format(Math.round(safeVal));
  } catch {
    return `${meta.symbol}${Math.round(safeVal).toLocaleString()}`;
  }
}
