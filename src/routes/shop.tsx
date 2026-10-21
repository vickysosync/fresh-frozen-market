import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";

type S = { q?: string; category?: string; type?: string };
export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): S => ({
    ...(typeof s.q === "string" ? { q: s.q } : {}),
    ...(typeof s.category === "string" ? { category: s.category } : {}),
    ...(typeof s.type === "string" ? { type: s.type } : {}),
  }),
  head: () => ({ meta: [{ title: "Shop All | Unique Fresh and Frozen Foods" }, { name: "description", content: "Browse fresh foods, frozen favourites and ready-to-cook essentials." }, { property: "og:title", content: "Shop All | Unique Fresh" }, { property: "og:description", content: "Browse the demo catalogue." }] }),
  component: Shop,
});

function Shop() {
  const { q, category, type } = Route.useSearch();
  const { state } = useStore();
  const list = state.products.filter((p) =>
    (!q || p.name.toLowerCase().includes(q.toLowerCase())) && (!category || p.category === category) && (!type || p.type === type));
  return (
    <>
      <PageHero eyebrow="Shop" title="Shop All Products" text={`${list.length} products`} />
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
        {list.length === 0 && <p className="text-muted-foreground">No products match your search.</p>}
      </div>
    </>
  );
}
