import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Bhutan tourism currency: Ngultrum (BTN). 1 USD ≈ 84 BTN.
// Source values are stored as USD; display as Nu. for the Bhutan storefront.
export const USD_TO_BTN = 84;
export function formatPrice(usd: number) {
  return `Nu. ${Math.round(usd * USD_TO_BTN).toLocaleString("en-IN")}`;
}
export function formatPriceFromBTN(btn: number) {
  return `Nu. ${Math.round(btn).toLocaleString("en-IN")}`;
}
