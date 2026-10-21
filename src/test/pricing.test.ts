import { describe, expect, it } from "vitest";
import { computeTotals, type Coupon } from "@/lib/pricing";

const s = { deliveryFee: 49, freeThreshold: 799 };
const c: Coupon = { id: "1", code: "X", title: "", type: "percent", value: 10, minOrder: 500, start: "2020-01-01", end: "2099-01-01", active: true, visible: true };

describe("pricing", () => {
  it("charges delivery below threshold", () => expect(computeTotals(500, s).delivery).toBe(49));
  it("free delivery at threshold", () => expect(computeTotals(799, s).delivery).toBe(0));
  it("percent coupon applies above minimum", () => expect(computeTotals(1000, s, c).discount).toBe(100));
  it("coupon ignored below minimum", () => expect(computeTotals(400, s, c).discount).toBe(0));
  it("disabled coupon ignored", () => expect(computeTotals(1000, s, { ...c, active: false }).discount).toBe(0));
});
