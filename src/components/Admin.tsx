import type { ReactNode } from "react";
import { Icon } from "./Icon";

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-charcoal/50 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={`card my-8 w-full ${wide ? "max-w-3xl" : "max-w-lg"} p-6`} onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-xl text-primary">{title}</h2><button onClick={onClose} aria-label="Close"><Icon name="x" /></button></div>
        {children}
      </div>
    </div>
  );
}

export function Confirm({ text, onOk, onCancel, ok = "Confirm" }: { text: string; onOk: () => void; onCancel: () => void; ok?: string }) {
  return (
    <Modal title="Please confirm" onClose={onCancel}>
      <p className="text-sm text-muted-foreground">{text}</p>
      <div className="mt-6 flex justify-end gap-2"><button onClick={onCancel} className="btn btn-outline">Cancel</button><button onClick={onOk} className="btn btn-danger">{ok}</button></div>
    </Modal>
  );
}

export function F({ label, error, children, className = "" }: { label: string; error?: string | undefined; children: ReactNode; className?: string }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1 block font-semibold">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export function AdminHead({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-3xl text-primary">{title}</h1>{text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}</div>
      {action}
    </div>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: boolean }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-soft text-xs uppercase tracking-wider text-muted-foreground"><tr>{head.map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody className="divide-y">{children}</tbody>
      </table>
      {empty && <p className="p-8 text-center text-sm text-muted-foreground">Nothing to show.</p>}
    </div>
  );
}

export function Pill({ children, tone = "muted" }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "muted" | "info" }) {
  const t = { ok: "bg-mint text-primary", warn: "bg-cream text-warning", bad: "bg-destructive/10 text-destructive", muted: "bg-soft text-muted-foreground", info: "bg-ice text-primary" }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${t}`}>{children}</span>;
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={`relative h-6 w-11 rounded-full transition ${on ? "bg-fresh" : "bg-border"}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}
