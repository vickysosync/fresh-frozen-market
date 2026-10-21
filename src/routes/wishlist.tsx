import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist | Unique Fresh and Frozen Foods" }, { name: "description", content: "Wishlist — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Wishlist | Unique Fresh" }, { property: "og:description", content: "Wishlist — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Wishlist" text="This page is part of the demo and is still being built." />,
});
