import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login | Unique Fresh and Frozen Foods" }, { name: "description", content: "Admin Login — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "Admin Login | Unique Fresh" }, { property: "og:description", content: "Admin Login — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="Admin Login" text="This page is part of the demo and is still being built." />,
});
