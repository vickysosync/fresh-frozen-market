import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product Details | Unique Fresh and Frozen Foods" }, { name: "description", content: "Product Details — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Product Details | Unique Fresh" }, { property: "og:description", content: "Product Details — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Product Details" text="This page is part of the demo and is still being built." />,
});
