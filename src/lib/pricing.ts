export type Coupon = {
  id: string; code: string; title: string; type: "percent" | "fixed"; value: number;
  minOrder: number; start: string; end: string; active: boolean; visible: boolean;
};

export function couponError(c: Coupon | undefined, subtotal: number, today = new Date().toISOString().slice(0, 10)): string | null {
  if (!c) return "Coupon not found";
  if (!c.active) return "This coupon is disabled";
  if (today < c.start || today > c.end) return "This coupon is not valid today";
  if (subtotal < c.minOrder) return `Minimum order ₹${c.minOrder} required`;
  return null;
}

export function computeTotals(
  subtotal: number,
  settings: { deliveryFee: number; freeThreshold: number },
  coupon?: Coupon,
  today?: string,
) {
  const delivery = subtotal === 0 || subtotal >= settings.freeThreshold ? 0 : settings.deliveryFee;
  let discount = 0;
  if (coupon && !couponError(coupon, subtotal, today)) {
    discount = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
    discount = Math.min(discount, subtotal);
  }
  return { subtotal, delivery, discount, total: subtotal + delivery - discount };
}
