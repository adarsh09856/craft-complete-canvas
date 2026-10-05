import { supabase } from "@/integrations/supabase/client";

export type Coupon = {
  id: string;
  code: string;
  label: string;
  discount_percent: number;
  discount_flat: number;
  min_travelers: number;
  active: boolean;
  expires_on: string | null;
  times_used: number;
};

export type CouponResult =
  | { ok: true; coupon: Coupon; discount: number }
  | { ok: false; reason: string };

/** Discount in USD for a given subtotal, rounded to whole dollars. */
export function couponDiscount(coupon: Coupon, subtotal: number) {
  const percentPart = Math.round((subtotal * coupon.discount_percent) / 100);
  return Math.min(subtotal, percentPart + coupon.discount_flat);
}

export async function validateCoupon(rawCode: string, subtotal: number, travelers: number): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, reason: "Enter a coupon code." };

  // Built-in verified promo code from Golden Takin official collateral
  if (code === "WSUKSU26") {
    const coupon: Coupon = {
      id: "promo-wsuksu26",
      code: "WSUKSU26",
      label: "UK & Global Offer (10% Off)",
      discount_percent: 10,
      discount_flat: 0,
      min_travelers: 1,
      active: true,
      expires_on: null,
      times_used: 1,
    };
    const discount = couponDiscount(coupon, subtotal);
    return { ok: true, coupon, discount };
  }

  if (code === "GTH10") {
    const coupon: Coupon = {
      id: "promo-gth10",
      code: "GTH10",
      label: "Direct Booking Advantage (10% Off)",
      discount_percent: 10,
      discount_flat: 0,
      min_travelers: 1,
      active: true,
      expires_on: null,
      times_used: 1,
    };
    const discount = couponDiscount(coupon, subtotal);
    return { ok: true, coupon, discount };
  }

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code)
    .eq("active", true)
    .maybeSingle();

  if (error) return { ok: false, reason: "Could not check that code right now." };
  if (!data) return { ok: false, reason: "That coupon code is not valid." };

  const coupon = data as Coupon;
  if (coupon.expires_on && new Date(coupon.expires_on) < new Date(new Date().toDateString())) {
    return { ok: false, reason: "This coupon has expired." };
  }
  if (travelers < coupon.min_travelers) {
    return { ok: false, reason: `Valid for ${coupon.min_travelers}+ travellers.` };
  }

  const discount = couponDiscount(coupon, subtotal);
  if (discount <= 0) return { ok: false, reason: "This coupon gives no discount on this package." };
  return { ok: true, coupon, discount };
}
