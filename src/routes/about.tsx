import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us | Unique Fresh and Frozen Foods" }, { name: "description", content: "About Us — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "About Us | Unique Fresh" }, { property: "og:description", content: "About Us — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="About Us" text="This page is part of the demo and is still being built." />,
});
