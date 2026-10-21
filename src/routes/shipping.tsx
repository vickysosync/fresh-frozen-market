import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping and Delivery | Unique Fresh and Frozen Foods" }, { name: "description", content: "Shipping and Delivery — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Shipping and Delivery | Unique Fresh" }, { property: "og:description", content: "Shipping and Delivery — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Shipping and Delivery" text="This page is part of the demo and is still being built." />,
});
