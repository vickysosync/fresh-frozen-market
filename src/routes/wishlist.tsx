import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Confirm } from "@/components/Admin";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist | Unique Fresh and Frozen Foods" }, { name: "description", content: "Products you've saved for later." }, { property: "og:title", content: "Wishlist | Unique Fresh" }, { property: "og:description", content: "Your saved products." }] }),
  component: Wishlist,
});

function Wishlist() {
  const { state, set, notify } = useStore();
  const [ask, setAsk] = useState(false);
  const items = state.products.filter((p) => state.wishlist.includes(p.id));
  return (
    <>
      <PageHero eyebrow="Saved" title="Your Wishlist" text={`${items.length} saved item${items.length === 1 ? "" : "s"}`} />
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        {items.length === 0 ? (
          <div className="card p-14 text-center"><h2 className="text-2xl text-primary">No saved items yet</h2><p className="mt-2 text-muted-foreground">Tap the heart on any product to save it.</p><Link to="/shop" className="btn btn-primary mt-6">Browse products</Link></div>
        ) : (
          <>
            <div className="mb-5 text-right"><button onClick={() => setAsk(true)} className="btn btn-outline">Remove all</button></div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div>
          </>
        )}
      </div>
      {ask && <Confirm text="Remove all items from your wishlist?" onCancel={() => setAsk(false)} onOk={() => { set("wishlist", []); setAsk(false); notify("Wishlist cleared"); }} />}
    </>
  );
}
