import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHero, Row } from "@/components/Layout";
import { F } from "@/components/Admin";
import { inr, useStore } from "@/lib/store";
import { CouponBox } from "./cart";
import type { Order } from "@/lib/data";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | Unique Fresh and Frozen Foods" }, { name: "description", content: "Demo checkout — no real order or payment is processed." }, { property: "og:title", content: "Checkout | Unique Fresh" }, { property: "og:description", content: "Demo checkout experience." }] }),
  component: Checkout,
});

const DELIVERY = [{ v: "standard", l: "Standard delivery (demo)", extra: 0 }, { v: "express", l: "Express delivery (demo)", extra: 50 }];
const PAY = ["Cash on Delivery", "UPI (demo)", "Card (demo)"];

function Checkout() {
  const { state, set, totals, notify } = useStore();
  const nav = useNavigate();
  const u = state.user;
  const [f, setF] = useState({ name: u?.name ?? "", email: u?.email ?? "", phone: u?.phone ?? "", address: "", city: "", postal: "", notes: "", delivery: "standard", payment: "Cash on Delivery" });
  const [err, setErr] = useState<Partial<Record<"name" | "email" | "phone" | "address" | "city" | "postal", string>>>({});
  const up = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const extra = DELIVERY.find((d) => d.v === f.delivery)!.extra;
  const total = totals.total + extra;

  if (state.cart.length === 0) return (
    <><PageHero eyebrow="Checkout" title="Checkout" /><div className="mx-auto max-w-xl px-4 py-16 text-center"><p className="text-muted-foreground">Your cart is empty.</p><Link to="/shop" className="btn btn-primary mt-6">Shop products</Link></div></>
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<"name" | "email" | "phone" | "address" | "city" | "postal", string>> = {};
    if (f.name.trim().length < 2) er.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email";
    if (!/^[+\d][\d\s-]{7,}$/.test(f.phone)) er.phone = "Enter a valid phone number";
    if (f.address.trim().length < 5) er.address = "Enter your delivery address";
    if (!f.city.trim()) er.city = "Enter your city";
    if (!/^\d{6}$/.test(f.postal)) er.postal = "Enter a 6-digit postal code";
    setErr(er);
    if (Object.keys(er).length) return notify("Please fix the highlighted fields", "err");
    const id = "UFF-" + Math.floor(10000 + Math.random() * 89999);
    const order: Order = {
      id, customer: f.name, email: f.email, phone: f.phone, address: `${f.address}, ${f.city} ${f.postal}`, date: new Date().toISOString().slice(0, 10),
      items: state.cart.map((i) => { const p = state.products.find((x) => x.id === i.id)!; return { id: p.id, name: p.name, qty: i.qty, price: p.price }; }),
      subtotal: totals.subtotal, delivery: totals.delivery + extra, discount: totals.discount, total,
      payment: f.payment, paymentStatus: "Unpaid (demo)", status: "Pending", notes: f.notes,
    };
    set("orders", (o) => [order, ...o]);
    set("products", (ps) => ps.map((p) => { const c = state.cart.find((i) => i.id === p.id); return c ? { ...p, stock: Math.max(0, p.stock - c.qty) } : p; }));
    if (!state.customers.some((c) => c.email === f.email)) set("customers", (c) => [...c, { id: "u" + Date.now(), name: f.name, email: f.email, phone: f.phone, city: f.city, joined: order.date }]);
    set("cart", []); set("couponCode", "");
    nav({ to: "/order/$id", params: { id } });
  };

  return (
    <>
      <PageHero eyebrow="Checkout" title="Checkout" text="This is a simulated checkout. No payment is taken and no real order is placed." />
      <form onSubmit={submit} noValidate className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6">
        <div className="space-y-6">
          <section className="card grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="text-xl text-primary sm:col-span-2">Contact details</h2>
            <F label="Full name *" error={err.name}><input className="field" value={f.name} onChange={up("name")} /></F>
            <F label="Email *" error={err.email}><input type="email" className="field" value={f.email} onChange={up("email")} /></F>
            <F label="Phone *" error={err.phone} className="sm:col-span-2"><input className="field" value={f.phone} onChange={up("phone")} placeholder="+91 98765 43210" /></F>
          </section>
          <section className="card grid gap-4 p-6 sm:grid-cols-2">
            <h2 className="text-xl text-primary sm:col-span-2">Delivery address</h2>
            <F label="Address *" error={err.address} className="sm:col-span-2"><textarea rows={2} className="field" value={f.address} onChange={up("address")} /></F>
            <F label="City *" error={err.city}><input className="field" value={f.city} onChange={up("city")} /></F>
            <F label="Postal code *" error={err.postal}><input className="field" inputMode="numeric" value={f.postal} onChange={up("postal")} /></F>
            <F label="Order notes" className="sm:col-span-2"><textarea rows={2} className="field" value={f.notes} onChange={up("notes")} placeholder="Optional" /></F>
          </section>
          <section className="card space-y-3 p-6">
            <h2 className="text-xl text-primary">Delivery option</h2>
            {DELIVERY.map((d) => <label key={d.v} className="flex items-center gap-2 text-sm"><input type="radio" name="delivery" checked={f.delivery === d.v} onChange={() => setF({ ...f, delivery: d.v })} />{d.l}{d.extra ? ` (+${inr(d.extra)})` : ""}</label>)}
          </section>
          <section className="card space-y-3 p-6">
            <h2 className="text-xl text-primary">Payment (demo)</h2>
            <p className="text-xs text-muted-foreground">No payment details are collected. Payment options are for demonstration only.</p>
            {PAY.map((p) => <label key={p} className="flex items-center gap-2 text-sm"><input type="radio" name="pay" checked={f.payment === p} onChange={() => setF({ ...f, payment: p })} />{p}</label>)}
          </section>
        </div>
        <aside className="card h-fit space-y-3 p-6 text-sm">
          <h2 className="text-xl text-primary">Order summary</h2>
          {state.cart.map((i) => { const p = state.products.find((x) => x.id === i.id); return p && <div key={i.id} className="flex justify-between gap-2"><span>{p.name} × {i.qty}</span><span>{inr(p.price * i.qty)}</span></div>; })}
          <div className="border-t pt-3" />
          <Row k="Subtotal" v={inr(totals.subtotal)} />
          <Row k="Delivery (demo)" v={totals.delivery + extra ? inr(totals.delivery + extra) : "Free"} />
          {totals.discount > 0 && <Row k={`Discount (${totals.coupon?.code})`} v={"−" + inr(totals.discount)} />}
          <Row k="Total" v={inr(total)} bold />
          <CouponBox />
          <button className="btn btn-primary w-full">Place demo order</button>
        </aside>
      </form>
    </>
  );
}
