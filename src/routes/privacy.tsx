import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy | Unique Fresh and Frozen Foods" }, { name: "description", content: "Privacy Policy — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Privacy Policy | Unique Fresh" }, { property: "og:description", content: "Privacy Policy — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Privacy Policy" text="This page is part of the demo and is still being built." />,
});
