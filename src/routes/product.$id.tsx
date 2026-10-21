import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Qty } from "@/components/Layout";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";
import { ProductCard, StockBadge } from "@/components/ProductCard";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product Details | Unique Fresh and Frozen Foods" }, { name: "description", content: "Product details, pack size and storage guidance." }, { property: "og:title", content: "Product | Unique Fresh" }, { property: "og:description", content: "Product details from the demo catalogue." }] }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { state, ready, addToCart, toggleWish } = useStore();
  const [qty, setQty] = useState(1);
  const p = state.products.find((x) => x.id === id);
  if (!p) return ready ? (
    <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-4xl text-primary">Product not found</h1><Link to="/shop" className="btn btn-primary mt-6">Back to shop</Link></div>
  ) : <div className="py-24 text-center text-muted-foreground">Loading…</div>;
  const cat = state.categories.find((c) => c.slug === p.category);
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const related = state.products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const others = related.length ? related : state.products.filter((x) => x.type === p.type && x.id !== p.id).slice(0, 4);
  const wished = state.wishlist.includes(p.id);
  const out = !p.available || p.stock <= 0;
  const gallery = [p.image, cat?.image].filter((x, i, a): x is string => !!x && a.indexOf(x) === i);
  const [main, setMain] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
      <nav className="mb-6 text-sm text-muted-foreground"><Link to="/shop" className="hover:text-fresh">Shop</Link> / {cat && <Link to="/shop" search={{ category: cat.slug }} className="hover:text-fresh">{cat.name}</Link>} / {p.name}</nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-soft"><Img src={gallery[main] ?? p.image} alt={`${p.name}, ${p.pack}`} eager /></div>
          {gallery.length > 1 && <div className="mt-3 flex gap-3">{gallery.map((g, i) => <button key={g} onClick={() => setMain(i)} className={`h-20 w-20 overflow-hidden rounded-lg border-2 ${i === main ? "border-primary" : "border-transparent"}`} aria-label={`View image ${i + 1}`}><Img src={g} alt="" /></button>)}</div>}
        </div>
        <div>
          <div className="eyebrow">{cat?.name}</div>
          <h1 className="mt-2 text-4xl text-primary">{p.name}</h1>
          <div className="mt-2 text-sm text-muted-foreground">Pack size: {p.pack} · SKU {p.sku}</div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">{inr(p.price)}</span>
            {off > 0 && <><span className="text-muted-foreground line-through">{inr(p.mrp)}</span><span className="rounded-full bg-mint px-2 py-0.5 text-xs font-bold text-primary">{off}% off (demo)</span></>}
          </div>
          <div className="mt-2"><StockBadge p={p} /></div>
          <p className="mt-5 text-muted-foreground">{p.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Qty value={qty} onChange={(n) => setQty(Math.max(1, Math.min(n, p.stock || 1)))} />
            <button disabled={out} onClick={() => addToCart(p.id, qty)} className="btn btn-primary"><Icon name="cart" className="h-4 w-4" />Add to Cart</button>
            <button onClick={() => toggleWish(p.id)} className="btn btn-outline" aria-pressed={wished}><Icon name="heart" className="h-4 w-4" fill={wished} />{wished ? "Saved" : "Add to Wishlist"}</button>
          </div>
          <div className="mt-8 space-y-4 text-sm">
            <Info title="Ingredients">Ingredient information placeholder — to be supplied by the business.</Info>
            <Info title="Storage instructions">{p.type === "fresh" ? "Sample guidance: refrigerate and use soon after purchase." : "Sample guidance: keep frozen at −18 °C or below. Do not refreeze once thawed."} Replace with the manufacturer's instructions.</Info>
            <Info title="Nutrition & allergens">Not provided. The business will add verified information.</Info>
          </div>
        </div>
      </div>
      {others.length > 0 && (
        <section className="mt-20"><h2 className="text-3xl text-primary">Related products</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{others.map((x) => <ProductCard key={x.id} p={x} />)}</div>
        </section>
      )}
    </div>
  );
}

function Info({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl bg-soft p-4"><div className="font-semibold">{title}</div><p className="mt-1 text-muted-foreground">{children}</p></div>;
}
