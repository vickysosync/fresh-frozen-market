import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us | Unique Fresh and Frozen Foods" }, { name: "description", content: "Contact Us — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Contact Us | Unique Fresh" }, { property: "og:description", content: "Contact Us — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Contact Us" text="This page is part of the demo and is still being built." />,
});
