import { useState } from "react";
import { Icon } from "./Icon";

export function Img({ src, alt, className = "", eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [err, setErr] = useState(false);
  if (err || !src)
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-mint text-fresh ${className}`} role="img" aria-label={alt}>
        <Icon name="leaf" className="h-8 w-8" />
        <span className="text-xs font-semibold">Image coming soon</span>
      </div>
    );
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setErr(true)} className={`h-full w-full object-cover ${className}`} />;
}
