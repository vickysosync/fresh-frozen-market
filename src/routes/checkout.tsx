import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout | Unique Fresh and Frozen Foods" }, { name: "description", content: "Checkout — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Checkout | Unique Fresh" }, { property: "og:description", content: "Checkout — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Checkout" text="This page is part of the demo and is still being built." />,
});
