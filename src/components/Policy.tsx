import { PageHero } from "./Layout";
import { useStore } from "@/lib/store";
import type { Content } from "@/lib/data";

export function Policy({ k, title }: { k: "privacy" | "terms" | "shipping" | "returns"; title: string }) {
  const { state } = useStore();
  const body = (state.content as Content)[k];
  return (
    <>
      <PageHero eyebrow="Information" title={title} text="Editable demo content" />
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-12 leading-relaxed text-muted-foreground">
        {body.split(/\n\n+/).map((para, i) => <p key={i} className={i === 0 ? "rounded-lg bg-cream p-4 text-sm text-foreground" : ""}>{para}</p>)}
      </article>
    </>
  );
}
