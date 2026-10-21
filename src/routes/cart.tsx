import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Qty, Row } from "@/components/Layout";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";
import { inr, useStore } from "@/lib/store";
import { couponError } from "@/lib/pricing";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart | Unique Fresh and Frozen Foods" }, { name: "description", content: "Review the items in your cart." }, { property: "og:title", content: "Cart | Unique Fresh" }, { property: "og:description", content: "Review your demo cart." }] }),
  component: Cart,
});

export function CouponBox() {
  const { state, set, totals } = useStore();
  const [code, setCode] = useState(state.couponCode);
  const [msg, setMsg] = useState("");
  const apply = () => {
    const c = state.coupons.find((x) => x.code.toUpperCase() === code.trim().toUpperCase());
    const e = couponError(c, totals.subtotal);
    if (e) { setMsg(e); set("couponCode", ""); } else { setMsg("Coupon applied (demo)"); set("couponCode", c!.code); }
  };
  const offers = state.coupons.filter((c) => c.visible && c.active);
  return (
    <div className="space-y-2">
      <label htmlFor="coupon" className="text-sm font-semibold">Coupon code</label>
      <div className="flex gap-2"><input id="coupon" className="field" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. FRESH10" /><button type="button" onClick={apply} className="btn btn-outline">Apply</button></div>
      {msg && <p className={`text-xs ${totals.discount ? "text-fresh" : "text-destructive"}`}>{msg}</p>}
      {offers.length > 0 && <p className="text-xs text-muted-foreground">Demo offers: {offers.map((o) => `${o.code} — ${o.title}`).join(" · ")}</p>}
    </div>
  );
}

function Cart() {
  const { state, totals, setQty, removeFromCart } = useStore();
  return (
    <>
      <PageHero eyebrow="Cart" title="Your Shopping Cart" text="Prices, delivery fees and promotions are demo values." />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        {state.cart.length === 0 ? (
          <div className="card p-14 text-center"><Icon name="cart" className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-3 text-2xl text-primary">Your cart is empty</h2><Link to="/shop" className="btn btn-primary mt-6">Start shopping</Link></div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="card divide-y">
              {state.cart.map((i) => {
                const p = state.products.find((x) => x.id === i.id);
                if (!p) return null;
                return (
                  <div key={i.id} className="flex gap-4 p-4">
                    <Link to="/product/$id" params={{ id: p.id }} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg"><Img src={p.image} alt={p.name} /></Link>
                    <div className="flex flex-1 flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div><div className="font-semibold">{p.name}</div><div className="text-xs text-muted-foreground">{p.pack} · {inr(p.price)} each</div></div>
                      <Qty value={i.qty} onChange={(q) => setQty(i.id, q)} />
                      <div className="w-24 font-bold text-primary sm:text-right">{inr(p.price * i.qty)}</div>
                      <button onClick={() => removeFromCart(i.id)} className="text-sm text-muted-foreground hover:text-destructive">Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <aside className="card h-fit space-y-3 p-6 text-sm">
              <h2 className="text-xl text-primary">Order summary</h2>
              <Row k="Subtotal" v={inr(totals.subtotal)} />
              <Row k="Delivery (demo)" v={totals.delivery ? inr(totals.delivery) : "Free"} />
              {totals.discount > 0 && <Row k={`Discount (${totals.coupon?.code})`} v={"−" + inr(totals.discount)} />}
              <Row k="Estimated total" v={inr(totals.total)} bold />
              {totals.delivery > 0 && <p className="text-xs text-muted-foreground">Add {inr(state.settings.freeThreshold - totals.subtotal)} more for free delivery (demo).</p>}
              <CouponBox />
              <Link to="/checkout" className="btn btn-primary w-full">Proceed to Checkout</Link>
              <Link to="/shop" className="btn btn-outline w-full">Continue Shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
