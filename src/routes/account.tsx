import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/Layout";
import { F, Modal, Pill } from "@/components/Admin";
import { inr, useStore } from "@/lib/store";
import type { Order } from "@/lib/data";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account | Unique Fresh and Frozen Foods" }, { name: "description", content: "Demo customer account — profile and order history." }, { property: "og:title", content: "My Account | Unique Fresh" }, { property: "og:description", content: "Demo customer account." }] }),
  component: Account,
});

function Account() {
  const { state, set, notify } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [view, setView] = useState<Order | null>(null);
  const u = state.user;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters");
    if (mode === "register" && f.name.trim().length < 2) return setErr("Enter your name");
    const known = state.customers.find((c) => c.email.toLowerCase() === f.email.toLowerCase());
    const name = mode === "register" ? f.name : known?.name ?? f.email.split("@")[0]!;
    if (mode === "register" && !known) set("customers", (c) => [...c, { id: "u" + Date.now(), name, email: f.email, phone: f.phone, city: "—", joined: new Date().toISOString().slice(0, 10) }]);
    set("user", { name, email: f.email, phone: f.phone || known?.phone || "" });
    setErr(""); notify(`Welcome, ${name} (demo sign-in)`);
  };

  if (!u) return (
    <>
      <PageHero eyebrow="Account" title={mode === "login" ? "Sign in" : "Create account"} text="Demo accounts only — stored in this browser, not secure." />
      <div className="mx-auto max-w-md px-4 py-10">
        <form onSubmit={submit} noValidate className="card space-y-4 p-6">
          {mode === "register" && <F label="Full name"><input className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></F>}
          <F label="Email"><input type="email" className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></F>
          {mode === "register" && <F label="Phone"><input className="field" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></F>}
          <F label="Password"><input type="password" className="field" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></F>
          {err && <p className="text-sm text-destructive" role="alert">{err}</p>}
          <button className="btn btn-primary w-full">{mode === "login" ? "Sign in (demo)" : "Register (demo)"}</button>
          <p className="text-center text-sm">{mode === "login" ? "New here?" : "Already registered?"} <button type="button" className="font-semibold text-fresh" onClick={() => { setMode(mode === "login" ? "register" : "login"); setErr(""); }}>{mode === "login" ? "Create an account" : "Sign in"}</button></p>
          <p className="text-center text-xs text-muted-foreground">Tip: sign in as customer.a@example.com (any 6+ char password) to see sample orders.</p>
        </form>
      </div>
    </>
  );

  const orders = state.orders.filter((o) => o.email.toLowerCase() === u.email.toLowerCase());
  return (
    <>
      <PageHero eyebrow="Account" title={`Hello, ${u.name}`} text="Demo account — frontend only." />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[300px_1fr] lg:px-6">
        <aside className="card h-fit space-y-2 p-6 text-sm">
          <h2 className="text-xl text-primary">Profile</h2>
          <div><span className="text-muted-foreground">Name:</span> {u.name}</div>
          <div><span className="text-muted-foreground">Email:</span> {u.email}</div>
          <div><span className="text-muted-foreground">Phone:</span> {u.phone || "—"}</div>
          <button onClick={() => { set("user", null); notify("Signed out"); }} className="btn btn-outline mt-4 w-full">Log out</button>
        </aside>
        <section>
          <h2 className="text-2xl text-primary">Order history</h2>
          {orders.length === 0 ? <div className="card mt-4 p-10 text-center text-muted-foreground">No orders yet. <Link to="/shop" className="font-semibold text-fresh">Start shopping</Link></div> : (
            <div className="mt-4 space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="card flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                  <div><div className="font-semibold">{o.id}</div><div className="text-muted-foreground">{o.date} · {o.items.length} item(s)</div></div>
                  <Pill tone={o.status === "Delivered" ? "ok" : o.status === "Cancelled" ? "bad" : "info"}>{o.status}</Pill>
                  <div className="font-bold text-primary">{inr(o.total)}</div>
                  <button onClick={() => setView(o)} className="btn btn-outline px-4 py-1.5">Details</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      {view && (
        <Modal title={`Order ${view.id}`} onClose={() => setView(null)}>
          <div className="space-y-1 text-sm">
            {view.items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{inr(i.qty * i.price)}</span></div>)}
            <div className="flex justify-between border-t pt-2 font-bold"><span>Total</span><span>{inr(view.total)}</span></div>
            <p className="pt-2 text-muted-foreground">Status: {view.status} · Payment: {view.payment} ({view.paymentStatus})</p>
          </div>
        </Modal>
      )}
    </>
  );
}
