import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/Layout";
export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account | Unique Fresh and Frozen Foods" }, { name: "description", content: "My Account — Unique Fresh and Frozen Foods demo store." }, { property: "og:title", content: "My Account | Unique Fresh" }, { property: "og:description", content: "My Account — demo store page." }] }),
  component: () => <PageHero eyebrow="Demo page" title="My Account" text="This page is part of the demo and is still being built." />,
});
