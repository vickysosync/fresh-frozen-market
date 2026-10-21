import { createFileRoute } from "@tanstack/react-router";
import { Policy } from "@/components/Policy";
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy | Unique Fresh and Frozen Foods" }, { name: "description", content: "Privacy Policy — editable demo content for Unique Fresh and Frozen Foods." }, { property: "og:title", content: "Privacy Policy | Unique Fresh" }, { property: "og:description", content: "Privacy Policy (demo content)." }] }),
  component: () => <Policy k="privacy" title="Privacy Policy" />,
});
