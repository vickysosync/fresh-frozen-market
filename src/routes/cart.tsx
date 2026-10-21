import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart | Unique Fresh and Frozen Foods" }, { name: "description", content: "Your Cart — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Your Cart | Unique Fresh" }, { property: "og:description", content: "Your Cart — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Your Cart" text="This page is part of the demo and is still being built." />,
});
