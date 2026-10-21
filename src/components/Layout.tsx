import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { inr, useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Img } from "./Img";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Unique Fresh and Frozen Foods home">
      <span className={`grid h-10 w-10 place-items-center rounded-full ${light ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"}`}>
        <Icon name="leaf" className="h-5 w-5" />
      </span>
      <span className="leading-none">
        <span className={`block font-display text-lg font-semibold ${light ? "text-primary-foreground" : "text-primary"}`}>Unique Fresh</span>
        <span className={`block text-[10px] font-bold tracking-[0.22em] ${light ? "text-primary-foreground/70" : "text-fresh"}`}>& FROZEN FOODS</span>
      </span>
    </Link>
  );
}

const NAV = [
  { label: "Home", to: "/", search: undefined },
  { label: "Shop All", to: "/shop", search: {} },
  { label: "Fresh Foods", to: "/shop", search: { type: "fresh" } },
  { label: "Frozen Foods", to: "/shop", search: { type: "frozen" } },
  { label: "Ready to Cook", to: "/shop", search: { type: "ready" } },
  { label: "Combos & Offers", to: "/shop", search: { type: "combo" } },
  { label: "About Us", to: "/about", search: undefined },
  { label: "Contact", to: "/contact", search: undefined },
] as const;

export function Header() {
  const { state, totals, setCartOpen } = useStore();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const submit = (e: FormEvent) => { e.preventDefault(); nav({ to: "/shop", search: { q } }); setSearch(false); setOpen(false); };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      {state.settings.announcement && <div className="bg-primary px-4 py-1.5 text-center text-xs font-medium text-primary-foreground">{state.settings.announcement}</div>}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}><Icon name={open ? "x" : "menu"} /></button>
        <Logo />
        <nav className="ml-6 hidden flex-1 items-center gap-5 text-sm font-medium lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} search={n.search as never} activeOptions={{ exact: true, includeSearch: true }} className="text-foreground/80 transition hover:text-fresh" activeProps={{ className: "text-primary font-semibold" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button onClick={() => setSearch(!search)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-mint" aria-label="Search"><Icon name="search" /></button>
          <Link to="/wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-mint" aria-label="Wishlist">
            <Icon name="heart" />{state.wishlist.length > 0 && <Badge n={state.wishlist.length} />}
          </Link>
          <button onClick={() => setCartOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-mint" aria-label="Cart">
            <Icon name="cart" />{totals.count > 0 && <Badge n={totals.count} />}
          </button>
          <Link to="/account" className="btn btn-primary ml-2 hidden px-4 py-2 sm:inline-flex"><Icon name="user" className="h-4 w-4" />{state.user ? state.user.name.split(" ")[0] : "Login"}</Link>
        </div>
      </div>
      {search && (
        <form onSubmit={submit} className="border-t bg-mint px-4 py-3">
          <div className="mx-auto flex max-w-2xl gap-2">
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <input id="site-search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search peas, samosa, prawns…" className="field" />
            <button className="btn btn-primary">Search</button>
          </div>
        </form>
      )}
      {open && (
        <nav className="border-t px-4 py-3 lg:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} search={n.search as never} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium hover:bg-mint">{n.label}</Link>
          ))}
          <Link to="/account" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 font-medium hover:bg-mint">Account / Login</Link>
        </nav>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-fresh px-1 text-[10px] font-bold text-primary-foreground">{n}</span>;
}

export function CartDrawer() {
  const { state, cartOpen, setCartOpen, totals, setQty, removeFromCart } = useStore();
  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/40" onClick={() => setCartOpen(false)} role="dialog" aria-modal="true" aria-label="Shopping cart">
      <aside className="flex h-full w-full max-w-md flex-col bg-background" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl">Your Cart ({totals.count})</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart"><Icon name="x" /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {state.cart.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground"><Icon name="cart" className="mx-auto mb-3 h-10 w-10" />Your cart is empty.</div>
          ) : state.cart.map((i) => {
            const p = state.products.find((x) => x.id === i.id);
            if (!p) return null;
            return (
              <div key={i.id} className="flex gap-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg"><Img src={p.image} alt={p.name} /></div>
                <div className="flex-1">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.pack} · {inr(p.price)}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <Qty value={i.qty} onChange={(q) => setQty(i.id, q)} />
                    <button onClick={() => removeFromCart(i.id)} className="text-muted-foreground hover:text-destructive" aria-label={`Remove ${p.name}`}><Icon name="trash" className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="space-y-2 border-t p-5 text-sm">
          <Row k="Subtotal" v={inr(totals.subtotal)} />
          <Row k="Delivery (demo)" v={totals.delivery ? inr(totals.delivery) : "Free"} />
          {totals.discount > 0 && <Row k={`Discount (${totals.coupon?.code})`} v={"−" + inr(totals.discount)} />}
          <Row k="Estimated total" v={inr(totals.total)} bold />
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link to="/cart" onClick={() => setCartOpen(false)} className="btn btn-outline">View Cart</Link>
            <Link to="/checkout" onClick={() => setCartOpen(false)} className={`btn btn-primary ${state.cart.length ? "" : "pointer-events-none opacity-50"}`}>Checkout</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function Row({ k, v, bold = false }: { k: string; v: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "border-t pt-2 text-base font-bold text-primary" : ""}`}><span>{k}</span><span>{v}</span></div>;
}

export function Qty({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border">
      <button onClick={() => onChange(value - 1)} disabled={value <= 1} className="grid h-8 w-8 place-items-center disabled:opacity-30" aria-label="Decrease quantity"><Icon name="minus" className="h-3.5 w-3.5" /></button>
      <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{value}</span>
      <button onClick={() => onChange(value + 1)} className="grid h-8 w-8 place-items-center" aria-label="Increase quantity"><Icon name="plus" className="h-3.5 w-3.5" /></button>
    </div>
  );
}

export function Toasts() {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-4 right-4 z-[60] space-y-2" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lift ${t.kind === "ok" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>{t.msg}</div>
      ))}
    </div>
  );
}

export function Footer() {
  const { state } = useStore();
  const s = state.settings;
  const cats = state.categories.filter((c) => c.visible).slice(0, 6);
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/75">{state.content.footerDesc}</p>
          <p className="mt-2 text-xs text-primary-foreground/60">UNIQUE FRESH AND FROZEN FOODS PRIVATE LIMITED</p>
          <div className="mt-5 flex gap-2">
            {["Instagram", "Facebook", "YouTube"].map((n) => <a key={n} href="#" onClick={(e) => e.preventDefault()} className="rounded-full border border-primary-foreground/30 px-3 py-1 text-xs hover:bg-primary-foreground/10" title="Social link placeholder">{n}</a>)}
          </div>
          <Link to="/" hash="newsletter" className="mt-4 inline-block text-sm underline underline-offset-4">Join our newsletter →</Link>
        </div>
        <FooterCol title="Shop">
          {cats.map((c) => <Link key={c.id} to="/shop" search={{ category: c.slug }}>{c.name}</Link>)}
        </FooterCol>
        <FooterCol title="Customer Service">
          <Link to="/account">My Account</Link><Link to="/cart">Cart</Link><Link to="/wishlist">Wishlist</Link>
          <Link to="/shipping">Shipping & Delivery</Link><Link to="/returns">Returns & Refunds</Link>
          <Link to="/privacy">Privacy Policy</Link><Link to="/terms">Terms & Conditions</Link>
        </FooterCol>
        <FooterCol title="Contact">
          <Link to="/about">About Us</Link><Link to="/contact">Contact Us</Link>
          <span>{s.phone}</span><span>{s.email}</span><span>{s.address}</span>
        </FooterCol>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/70 sm:flex-row lg:px-6">
          <span>© {new Date().getFullYear()} UNIQUE FRESH AND FROZEN FOODS PRIVATE LIMITED. Demo website.</span>
          <span>Designed and development by SOSynch Ai Tech</span>
          <Link to="/admin/login" className="opacity-60 hover:opacity-100">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-4 font-sans text-xs font-bold uppercase tracking-widest text-primary-foreground/60">{title}</h3>
      <div className="flex flex-col gap-2 text-sm text-primary-foreground/85 [&_a:hover]:text-primary-foreground [&_a:hover]:underline">{children}</div>
    </div>
  );
}

export function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-6">
        <div className="eyebrow">{eyebrow}</div>
        <h1 className="mt-2 text-4xl text-primary md:text-5xl">{title}</h1>
        {text && <p className="mt-3 max-w-2xl text-muted-foreground">{text}</p>}
      </div>
    </section>
  );
}

export { inr };
