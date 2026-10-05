import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "USD" | "INR" | "AUD" | "EUR" | "GBP";

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateFromUSD: number; // 1 USD in target currency
  locale: string;
  isSAARC?: boolean;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rateFromUSD: 1.0, locale: "en-US" },
  INR: { code: "INR", name: "Indian Rupee (Nu.)", symbol: "₹", flag: "🇮🇳", rateFromUSD: 87.5, locale: "en-IN", isSAARC: true },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rateFromUSD: 1.54, locale: "en-AU" },
  EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rateFromUSD: 0.92, locale: "de-DE" },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rateFromUSD: 0.79, locale: "en-GB" },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  config: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
  calculateSDF: (nights: number) => { amount: number; formatted: string; isIndianRate: boolean };
}

const STORAGE_KEY = "gth_selected_currency_v1";

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      } else {
        // Simple heuristic: if user timezone suggests India/SAARC, default to INR
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz.includes("Calcutta") || tz.includes("Kolkata") || tz.includes("Thimphu")) {
          setCurrencyState("INR");
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const config = CURRENCIES[currency];

  const convertPrice = (priceUSD: number): number => {
    if (currency === "USD") return priceUSD;
    return Math.round(priceUSD * config.rateFromUSD);
  };

  const formatPrice = (priceUSD: number): string => {
    const converted = convertPrice(priceUSD);
    const formattedNum = new Intl.NumberFormat(config.locale, {
      maximumFractionDigits: 0,
    }).format(converted);

    return `${config.symbol}${formattedNum}`;
  };

  // SDF Calculation:
  // Indian Travelers: INR 1,200 per adult per night
  // International Travelers: USD 100 per adult per night
  const calculateSDF = (nights: number) => {
    const isIndianRate = currency === "INR";
    if (isIndianRate) {
      const amount = 1200 * nights;
      return {
        amount,
        formatted: `₹${new Intl.NumberFormat("en-IN").format(amount)}`,
        isIndianRate: true,
      };
    }

    const usdTotal = 100 * nights;
    const amount = convertPrice(usdTotal);
    return {
      amount,
      formatted: `${config.symbol}${new Intl.NumberFormat(config.locale, { maximumFractionDigits: 0 }).format(amount)}`,
      isIndianRate: false,
    };
  };

  return (
    <CurrencyContext.Provider value={{ currency, config, setCurrency, convertPrice, formatPrice, calculateSDF }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      currency: "USD" as CurrencyCode,
      config: CURRENCIES.USD,
      setCurrency: () => {},
      convertPrice: (p: number) => p,
      formatPrice: (p: number) => `$${p}`,
      calculateSDF: (nights: number) => ({ amount: nights * 100, formatted: `$${nights * 100}`, isIndianRate: false }),
    };
  }
  return context;
}
