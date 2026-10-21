import { Link } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { inr, useStore } from "@/lib/store";
import { Icon } from "./Icon";
import { Img } from "./Img";

export function StockBadge({ p }: { p: Product }) {
  const { state } = useStore();
  if (!p.available || p.stock <= 0) return <span className="text-xs font-semibold text-destructive">Out of stock</span>;
  if (p.stock <= state.settings.lowStock) return <span className="text-xs font-semibold text-warning">Only {p.stock} left</span>;
  return <span className="text-xs font-semibold text-fresh">In stock</span>;
}

export function ProductCard({ p }: { p: Product }) {
  const { state, addToCart, toggleWish } = useStore();
  const [quick, setQuick] = useState(false);
  const cat = state.categories.find((c) => c.slug === p.category);
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const wished = state.wishlist.includes(p.id);
  return (
    <article className="group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-soft">
        <Link to="/product/$id" params={{ id: p.id }} aria-label={p.name}>
          <Img src={p.image} alt={`${p.name}, ${p.pack}`} className="transition duration-500 group-hover:scale-105" />
        </Link>
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground">{off}% OFF</span>}
        <button onClick={() => toggleWish(p.id)} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished}
          className={`absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-background/90 transition hover:scale-110 ${wished ? "text-destructive" : "text-foreground"}`}>
          <Icon name="heart" className="h-4 w-4" fill={wished} />
        </button>
        <button onClick={() => setQuick(true)} className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-background/95 py-2 text-xs font-semibold text-primary opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus:translate-y-0 focus:opacity-100">
          Quick View
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{cat?.name ?? p.category}</span>
          <span title="Mock demonstration rating" className="flex items-center gap-1"><Icon name="star" className="h-3 w-3 text-warning" fill />{p.rating.toFixed(1)} <em className="not-italic opacity-60">demo</em></span>
        </div>
        <Link to="/product/$id" params={{ id: p.id }} className="font-display text-lg leading-tight hover:text-fresh">{p.name}</Link>
        <div className="text-xs text-muted-foreground">{p.pack}</div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="text-lg font-bold text-primary">{inr(p.price)}</div>
            {off > 0 && <div className="text-xs text-muted-foreground line-through">{inr(p.mrp)}</div>}
          </div>
          <StockBadge p={p} />
        </div>
        <button onClick={() => addToCart(p.id)} disabled={!p.available || p.stock <= 0} className="btn btn-primary mt-2 w-full py-2.5">
          <Icon name="cart" className="h-4 w-4" /> Add to Cart
        </button>
      </div>
      {quick && <QuickView p={p} onClose={() => setQuick(false)} />}
    </article>
  );
}

function QuickView({ p, onClose }: { p: Product; onClose: () => void }) {
  const { addToCart } = useStore();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-charcoal/50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={p.name}>
      <div className="card grid max-w-3xl overflow-hidden md:grid-cols-2" onClick={(e) => e.stopPropagation()}>
        <div className="aspect-square bg-soft"><Img src={p.image} alt={p.name} /></div>
        <div className="flex flex-col gap-3 p-6">
          <button onClick={onClose} className="self-end" aria-label="Close"><Icon name="x" /></button>
          <h3 className="text-2xl">{p.name}</h3>
          <div className="text-sm text-muted-foreground">{p.pack}</div>
          <div className="text-2xl font-bold text-primary">{inr(p.price)}</div>
          <p className="text-sm text-muted-foreground">{p.description}</p>
          <StockBadge p={p} />
          <div className="mt-auto flex gap-2">
            <button className="btn btn-primary flex-1" disabled={!p.available || p.stock <= 0} onClick={() => { addToCart(p.id); onClose(); }}>Add to Cart</button>
            <Link to="/product/$id" params={{ id: p.id }} className="btn btn-outline">Details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
