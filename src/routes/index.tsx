import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Img } from "@/components/Img";
import { Icon } from "@/components/Icon";
import { useStore } from "@/lib/store";
import { IMAGES } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Unique Fresh and Frozen Foods | Fresh Choices. Frozen Goodness." }, { name: "description", content: "Quality food essentials and frozen favourites for everyday convenience." }, { property: "og:title", content: "Unique Fresh and Frozen Foods" }, { property: "og:description", content: "Fresh choices. Frozen goodness." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Index,
});

const TRUST_ICONS = ["leaf", "basket", "snow", "check"];

function Index() {
  const { state } = useStore();
  const c = state.content;
  const hero = state.banners.find((b) => b.slot === "hero" && b.visible);
  const promo = state.banners.find((b) => b.slot === "promo" && b.visible);
  const combos = state.products.filter((p) => p.type === "combo" || p.featured).slice(0, 4);
  return (
    <>
      {hero && (
        <section className="relative overflow-hidden bg-cream">
          <Icon name="snow" className="pointer-events-none absolute -left-10 top-10 h-48 w-48 text-ice" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20 lg:px-6">
            <div>
              <div className="eyebrow">{hero.eyebrow}</div>
              <h1 className="mt-3 text-5xl leading-[1.05] text-primary md:text-6xl">{hero.title}</h1>
              <p className="mt-5 max-w-md text-lg text-muted-foreground">{hero.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={hero.ctaLink} className="btn btn-primary">{hero.ctaText}</a>
                <Link to="/shop" search={{ type: "frozen" }} className="btn btn-outline">Explore Frozen Foods</Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-lift"><Img src={hero.image} alt="Frozen vegetables, snacks and fresh ingredients on a kitchen counter" eager /></div>
              <div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-semibold text-primary shadow-lift"><Icon name="leaf" className="h-4 w-4 text-fresh" /> Fresh & frozen, one basket</div>
            </div>
          </div>
        </section>
      )}

      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          {c.trust.map((t, i) => (
            <div key={i} className="flex gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-mint text-primary"><Icon name={TRUST_ICONS[i % 4]!} /></span>
              <div><div className="font-semibold">{t.title}</div><p className="text-sm text-muted-foreground">{t.text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="flex items-end justify-between gap-4">
          <div><div className="eyebrow">Categories</div><h2 className="mt-2 text-3xl text-primary md:text-4xl">{c.categoriesHeading}</h2></div>
          <Link to="/shop" className="text-sm font-semibold text-fresh hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {state.categories.filter((x) => x.visible).map((x) => (
            <Link key={x.id} to="/shop" search={{ category: x.slug }} className="group card overflow-hidden transition hover:shadow-lift">
              <div className="aspect-square overflow-hidden"><Img src={x.image} alt={x.name} className="transition duration-500 group-hover:scale-105" /></div>
              <div className="p-3">
                <div className="text-sm font-semibold">{x.name}</div>
                {x.illustrative && <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sample category</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="eyebrow">Popular</div>
        <h2 className="mt-2 text-3xl text-primary md:text-4xl">{c.bestsellersHeading}</h2>
        <p className="mt-2 text-muted-foreground">{c.bestsellersText}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {state.products.filter((p) => p.bestseller).slice(0, 8).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {promo && (
        <section className="mx-auto mt-20 max-w-7xl px-4 lg:px-6">
          <div className="grid overflow-hidden rounded-2xl bg-primary text-primary-foreground md:grid-cols-2">
            <div className="flex flex-col justify-center p-10 md:p-14">
              <div className="text-xs font-bold tracking-[0.18em] text-primary-foreground/70">{promo.eyebrow}</div>
              <h2 className="mt-3 text-4xl">{promo.title}</h2>
              <p className="mt-4 text-primary-foreground/80">{promo.subtitle}</p>
              <a href={promo.ctaLink} className="btn btn-light mt-7 self-start">{promo.ctaText}</a>
            </div>
            <div className="min-h-64"><Img src={promo.image} alt="Frozen food essentials" /></div>
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 grid max-w-7xl gap-5 px-4 md:grid-cols-3 lg:px-6">
        {[
          { t: "Fresh Food Essentials", d: "Paneer, greens and daily kitchen basics.", img: IMAGES.fresh, s: { type: "fresh" }, bg: "bg-mint" },
          { t: "Frozen Food Favourites", d: "Vegetables, snacks, seafood and desserts.", img: IMAGES.veg, s: { type: "frozen" }, bg: "bg-ice" },
          { t: "Quick Meal Solutions", d: "Ready-to-cook parathas, momos and more.", img: IMAGES.ready, s: { type: "ready" }, bg: "bg-cream" },
        ].map((col) => (
          <div key={col.t} className={`overflow-hidden rounded-2xl ${col.bg}`}>
            <div className="aspect-[16/10]"><Img src={col.img} alt={col.t} /></div>
            <div className="p-6">
              <h3 className="text-2xl text-primary">{col.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{col.d}</p>
              <Link to="/shop" search={col.s} className="btn btn-outline mt-5">Shop collection</Link>
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4 lg:px-6">
        <div className="eyebrow">Combos</div>
        <h2 className="mt-2 text-3xl text-primary md:text-4xl">{c.promoHeading}</h2>
        <p className="mt-2 text-muted-foreground">{c.promoText}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {combos.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-4 md:grid-cols-2 lg:px-6">
        <div className="aspect-[4/3] overflow-hidden rounded-2xl"><Img src={IMAGES.about} alt="Preparing an everyday meal with fresh and frozen ingredients" /></div>
        <div>
          <div className="eyebrow">Why shop with us?</div>
          <h2 className="mt-2 text-4xl text-primary">{c.whyHeading}</h2>
          <p className="mt-4 text-muted-foreground">{c.whyText}</p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Wide variety across fresh, frozen and ready-to-cook", "Simple filters to find what you need fast", "Clear order summary before you check out"].map((x) => (
              <li key={x} className="flex gap-2"><Icon name="check" className="h-5 w-5 text-fresh" />{x}</li>
            ))}
          </ul>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function Newsletter() {
  const { set, state } = useStore();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Please enter a valid email address.");
    setErr(""); setOk(true);
    if (!state.subscribers.includes(email)) set("subscribers", (s) => [...s, email]);
    setEmail("");
  };
  return (
    <section id="newsletter" className="mx-auto mt-20 max-w-7xl px-4 lg:px-6">
      <div className="rounded-2xl bg-ice px-6 py-12 text-center md:px-16">
        <Icon name="mail" className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 text-3xl text-primary">Get fresh updates</h2>
        <p className="mt-2 text-sm text-muted-foreground">Demo only — subscriptions are saved in this browser and no emails are sent.</p>
        {ok ? (
          <p className="mt-6 font-semibold text-fresh" role="status">Thanks! You're subscribed (demo).</p>
        ) : (
          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row" noValidate>
            <label htmlFor="nl-email" className="sr-only">Email address</label>
            <input id="nl-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="field" aria-invalid={!!err} />
            <button className="btn btn-primary">Subscribe</button>
          </form>
        )}
        {err && <p className="mt-2 text-sm text-destructive">{err}</p>}
      </div>
    </section>
  );
}
