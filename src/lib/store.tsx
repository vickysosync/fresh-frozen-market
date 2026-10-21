// Frontend-only demo state. Persisted in localStorage. NOT secure — demo authentication only.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as D from "./data";
import { computeTotals, type Coupon } from "./pricing";

export type CartItem = { id: string; qty: number };
export type State = {
  products: D.Product[]; categories: D.Category[]; orders: D.Order[]; customers: D.Customer[];
  coupons: Coupon[]; banners: D.Banner[]; enquiries: D.Enquiry[]; settings: D.Settings; content: D.Content;
  cart: CartItem[]; wishlist: string[]; couponCode: string;
  user: { name: string; email: string; phone?: string } | null; admin: boolean; subscribers: string[];
};

const KEY = "uff-demo-v1";
const defaults = (): State => ({
  products: D.defaultProducts, categories: D.defaultCategories, orders: D.defaultOrders, customers: D.defaultCustomers,
  coupons: D.defaultCoupons, banners: D.defaultBanners, enquiries: D.defaultEnquiries, settings: D.defaultSettings,
  content: D.defaultContent, cart: [], wishlist: [], couponCode: "", user: null, admin: false, subscribers: [],
});

type Toast = { id: number; msg: string; kind: "ok" | "err" };
type Ctx = {
  state: State; ready: boolean;
  set: <K extends keyof State>(k: K, v: State[K] | ((p: State[K]) => State[K])) => void;
  reset: () => void;
  notify: (msg: string, kind?: "ok" | "err") => void; toasts: Toast[];
  addToCart: (id: string, qty?: number) => void; setQty: (id: string, qty: number) => void; removeFromCart: (id: string) => void;
  toggleWish: (id: string) => void;
  cartOpen: boolean; setCartOpen: (b: boolean) => void;
  totals: ReturnType<typeof computeTotals> & { count: number; coupon?: Coupon | undefined };
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(defaults);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const tid = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...defaults(), ...JSON.parse(raw) });
    } catch { /* ignore corrupt storage */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(state)); }, [state, ready]);

  const set: Ctx["set"] = useCallback((k, v) => {
    setState((s) => ({ ...s, [k]: typeof v === "function" ? (v as (p: unknown) => unknown)(s[k]) : v }));
  }, []);
  const notify = useCallback((msg: string, kind: "ok" | "err" = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const addToCart = (id: string, qty = 1) => {
    const p = state.products.find((x) => x.id === id);
    if (!p || !p.available || p.stock <= 0) return notify("This item is currently unavailable", "err");
    set("cart", (c) => {
      const ex = c.find((i) => i.id === id);
      return ex ? c.map((i) => (i.id === id ? { ...i, qty: Math.min(i.qty + qty, p.stock) } : i)) : [...c, { id, qty: Math.min(qty, p.stock) }];
    });
    notify(`${p.name} added to cart`);
  };
  const setQty = (id: string, qty: number) => {
    const p = state.products.find((x) => x.id === id);
    const q = Math.max(1, Math.min(qty, p?.stock ?? 99));
    set("cart", (c) => c.map((i) => (i.id === id ? { ...i, qty: q } : i)));
  };
  const removeFromCart = (id: string) => set("cart", (c) => c.filter((i) => i.id !== id));
  const toggleWish = (id: string) => {
    const has = state.wishlist.includes(id);
    set("wishlist", (w) => (has ? w.filter((x) => x !== id) : [...w, id]));
    notify(has ? "Removed from wishlist" : "Saved to wishlist");
  };

  const totals = useMemo(() => {
    const subtotal = state.cart.reduce((s, i) => s + (state.products.find((p) => p.id === i.id)?.price ?? 0) * i.qty, 0);
    const coupon = state.coupons.find((c) => c.code.toUpperCase() === state.couponCode.toUpperCase() && state.couponCode);
    return { ...computeTotals(subtotal, state.settings, coupon), count: state.cart.reduce((s, i) => s + i.qty, 0), coupon };
  }, [state.cart, state.products, state.coupons, state.couponCode, state.settings]);

  const reset = () => { const keep = { admin: state.admin }; setState({ ...defaults(), ...keep }); notify("Demo data reset"); };

  return (
    <StoreCtx.Provider value={{ state, ready, set, reset, notify, toasts, addToCart, setQty, removeFromCart, toggleWish, cartOpen, setCartOpen, totals }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const uid = () => Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
