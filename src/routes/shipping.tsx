import { createFileRoute } from "@tanstack/react-router";
import { Policy } from "@/components/Policy";
export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping and Delivery | Unique Fresh and Frozen Foods" }, { name: "description", content: "Shipping and Delivery — editable demo content for Unique Fresh and Frozen Foods." }, { property: "og:title", content: "Shipping and Delivery | Unique Fresh" }, { property: "og:description", content: "Shipping and Delivery (demo content)." }] }),
  component: () => <Policy k="shipping" title="Shipping and Delivery" />,
});
