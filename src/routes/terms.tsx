import { createFileRoute } from "@tanstack/react-router";
import { Policy } from "@/components/Policy";
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms and Conditions | Unique Fresh and Frozen Foods" }, { name: "description", content: "Terms and Conditions — editable demo content for Unique Fresh and Frozen Foods." }, { property: "og:title", content: "Terms and Conditions | Unique Fresh" }, { property: "og:description", content: "Terms and Conditions (demo content)." }] }),
  component: () => <Policy k="terms" title="Terms and Conditions" />,
});
