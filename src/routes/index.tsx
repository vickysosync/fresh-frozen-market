import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Img } from "@/components/Img";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Unique Fresh and Frozen Foods | Fresh Choices. Frozen Goodness." }, { name: "description", content: "Quality food essentials and frozen favourites for everyday convenience." }, { property: "og:title", content: "Unique Fresh and Frozen Foods" }, { property: "og:description", content: "Fresh choices. Frozen goodness." }] }),
  component: Index,
});

function Index() {
  const { state } = useStore();
  const hero = state.banners.find((b) => b.slot === "hero" && b.visible);
  return (
    <>
      {hero && (
        <section className="bg-cream">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 lg:px-6">
            <div>
              <div className="eyebrow">{hero.eyebrow}</div>
              <h1 className="mt-3 text-5xl text-primary md:text-6xl">{hero.title}</h1>
              <p className="mt-4 max-w-md text-muted-foreground">{hero.subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/shop" className="btn btn-primary">{hero.ctaText}</Link>
                <Link to="/shop" search={{ type: "frozen" }} className="btn btn-outline">Explore Frozen Foods</Link>
              </div>
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lift"><Img src={hero.image} alt="Frozen vegetables, snacks and fresh ingredients on a kitchen counter" eager /></div>
          </div>
        </section>
      )}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <h2 className="text-3xl text-primary">{state.content.categoriesHeading}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {state.categories.filter((c) => c.visible).map((c) => (
            <Link key={c.id} to="/shop" search={{ category: c.slug }} className="card overflow-hidden">
              <div className="aspect-square"><Img src={c.image} alt={c.name} /></div>
              <div className="p-3 text-sm font-semibold">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <h2 className="text-3xl text-primary">{state.content.bestsellersHeading}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {state.products.filter((p) => p.bestseller).slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}
