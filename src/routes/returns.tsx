import { createFileRoute } from "@tanstack/react-router";
import { Policy } from "@/components/Policy";
export const Route = createFileRoute("/returns")({
  head: () => ({ meta: [{ title: "Returns and Refunds | Unique Fresh and Frozen Foods" }, { name: "description", content: "Returns and Refunds — editable demo content for Unique Fresh and Frozen Foods." }, { property: "og:title", content: "Returns and Refunds | Unique Fresh" }, { property: "og:description", content: "Returns and Refunds (demo content)." }] }),
  component: () => <Policy k="returns" title="Returns and Refunds" />,
});
