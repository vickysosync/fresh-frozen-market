import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

type S = { q?: string; category?: string; type?: string };
const str = (v: unknown) => (typeof v === "string" && v ? v : undefined);
export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): S => {
    const out: S = {};
    const q = str(s["q"]), c = str(s["category"]), t = str(s["type"]);
    if (q) out.q = q; if (c) out.category = c; if (t) out.type = t;
    return out;
  },
  head: () => ({ meta: [{ title: "Shop All | Unique Fresh and Frozen Foods" }, { name: "description", content: "Browse fresh foods, frozen favourites and ready-to-cook essentials." }, { property: "og:title", content: "Shop All | Unique Fresh" }, { property: "og:description", content: "Browse the demo catalogue." }] }),
  component: Shop,
});

const TYPES = [{ v: "fresh", l: "Fresh Foods" }, { v: "frozen", l: "Frozen Foods" }, { v: "ready", l: "Ready to Cook" }, { v: "combo", l: "Combos & Offers" }];
const PAGE = 8;

function Shop() {
  const search = Route.useSearch();
  const nav = useNavigate({ from: "/shop" });
  const { state } = useStore();
  const [max, setMax] = useState(1500);
  const [stock, setStock] = useState<"all" | "in" | "out">("all");
  const [sort, setSort] = useState("popular");
  const [shown, setShown] = useState(PAGE);
  const upd = (patch: Partial<S>) => { setShown(PAGE); nav({ search: (p: S) => { const n = { ...p, ...patch }; (Object.keys(n) as (keyof S)[]).forEach((k) => !n[k] && delete n[k]); return n; } }); };
  const visibleCats = state.categories.filter((c) => c.visible);

  const list = useMemo(() => {
    const q = search.q?.toLowerCase();
    const r = state.products.filter((p) => {
      const inStock = p.available && p.stock > 0;
      return (!q || p.name.toLowerCase().includes(q)) && (!search.category || p.category === search.category) && (!search.type || p.type === search.type)
        && p.price <= max && (stock === "all" || (stock === "in" ? inStock : !inStock)) && visibleCats.some((c) => c.slug === p.category);
    });
    const s = [...r];
    if (sort === "low") s.sort((a, b) => a.price - b.price);
    else if (sort === "high") s.sort((a, b) => b.price - a.price);
    else if (sort === "name") s.sort((a, b) => a.name.localeCompare(b.name));
    else s.sort((a, b) => b.popularity - a.popularity);
    return s;
  }, [state.products, search, max, stock, sort, visibleCats]);

  const title = search.category ? state.categories.find((c) => c.slug === search.category)?.name : search.type ? TYPES.find((t) => t.v === search.type)?.l : "Shop All Products";
  const clear = () => { setMax(1500); setStock("all"); setSort("popular"); setShown(PAGE); nav({ search: {} }); };

  return (
    <>
      <PageHero eyebrow="Shop" title={title ?? "Shop"} text={search.q ? `Results for "${search.q}"` : "Fresh, frozen and ready-to-cook — demo catalogue."} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[250px_1fr] lg:px-6">
        <aside className="space-y-6 text-sm" aria-label="Filters">
          <div>
            <label htmlFor="f-q" className="mb-1.5 block font-semibold">Search</label>
            <input id="f-q" className="field" value={search.q ?? ""} onChange={(e) => upd({ q: e.target.value })} placeholder="Product name" />
          </div>
          <div>
            <div className="mb-1.5 font-semibold">Type</div>
            <select aria-label="Type" className="field" value={search.type ?? ""} onChange={(e) => upd({ type: e.target.value })}>
              <option value="">All types</option>{TYPES.map((t) => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
          </div>
          <div>
            <div className="mb-1.5 font-semibold">Category</div>
            <div className="space-y-1">
              <button onClick={() => upd({ category: "" })} className={`block w-full rounded-lg px-3 py-1.5 text-left ${!search.category ? "bg-mint font-semibold text-primary" : "hover:bg-soft"}`}>All categories</button>
              {visibleCats.map((c) => <button key={c.id} onClick={() => upd({ category: c.slug })} className={`block w-full rounded-lg px-3 py-1.5 text-left ${search.category === c.slug ? "bg-mint font-semibold text-primary" : "hover:bg-soft"}`}>{c.name}</button>)}
            </div>
          </div>
          <div>
            <label htmlFor="f-price" className="mb-1.5 block font-semibold">Max price: ₹{max}</label>
            <input id="f-price" type="range" min={50} max={1500} step={50} value={max} onChange={(e) => setMax(+e.target.value)} className="w-full accent-[var(--primary)]" />
          </div>
          <div>
            <div className="mb-1.5 font-semibold">Availability</div>
            {(["all", "in", "out"] as const).map((v) => (
              <label key={v} className="flex items-center gap-2 py-0.5"><input type="radio" name="stock" checked={stock === v} onChange={() => setStock(v)} />{v === "all" ? "All" : v === "in" ? "In stock" : "Out of stock"}</label>
            ))}
          </div>
          <button onClick={clear} className="btn btn-outline w-full">Clear all filters</button>
        </aside>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{list.length} product{list.length === 1 ? "" : "s"}</p>
            <label className="flex items-center gap-2 text-sm">Sort
              <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Popularity</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option>
              </select>
            </label>
          </div>
          {list.length === 0 ? (
            <div className="card p-12 text-center"><h2 className="text-2xl text-primary">No products found</h2><p className="mt-2 text-muted-foreground">Try a different search or clear filters.</p><button onClick={clear} className="btn btn-primary mt-5">Clear filters</button></div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} />)}</div>
              {shown < list.length && <div className="mt-8 text-center"><button onClick={() => setShown(shown + PAGE)} className="btn btn-outline">Load more ({list.length - shown} left)</button></div>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
