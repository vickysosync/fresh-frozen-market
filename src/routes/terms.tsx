import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms and Conditions | Unique Fresh and Frozen Foods" }, { name: "description", content: "Terms and Conditions — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Terms and Conditions | Unique Fresh" }, { property: "og:description", content: "Terms and Conditions — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Terms and Conditions" text="This page is part of the demo and is still being built." />,
});
