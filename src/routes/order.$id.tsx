import { createFileRoute, Link } from "@tanstack/react-router";
import { Row } from "@/components/Layout";
import { Icon } from "@/components/Icon";
import { inr, useStore } from "@/lib/store";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Order Confirmation | Unique Fresh and Frozen Foods" }, { name: "description", content: "Your simulated demo order confirmation." }, { property: "og:title", content: "Order Confirmation | Unique Fresh" }, { property: "og:description", content: "Demo order confirmation." }] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const { state, ready } = useStore();
  const o = state.orders.find((x) => x.id === id);
  if (!o) return <div className="mx-auto max-w-xl px-4 py-24 text-center">{ready ? <><h1 className="text-3xl text-primary">Order not found</h1><Link to="/" className="btn btn-primary mt-6">Go home</Link></> : "Loading…"}</div>;
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint text-fresh"><Icon name="check" className="h-8 w-8" /></span>
        <h1 className="mt-4 text-4xl text-primary">Thank you, {o.customer.split(" ")[0]}!</h1>
        <p className="mt-2 text-muted-foreground">Demo order <strong className="text-foreground">{o.id}</strong> has been recorded in this browser.</p>
        <p className="mx-auto mt-3 max-w-md rounded-lg bg-cream p-3 text-sm">This order is simulated. No real order has been placed and no payment was taken.</p>
      </div>
      <div className="card mt-8 space-y-2 p-6 text-sm">
        {o.items.map((i) => <div key={i.id} className="flex justify-between"><span>{i.name} × {i.qty}</span><span>{inr(i.qty * i.price)}</span></div>)}
        <div className="border-t pt-2" />
        <Row k="Subtotal" v={inr(o.subtotal)} /><Row k="Delivery (demo)" v={o.delivery ? inr(o.delivery) : "Free"} />
        {o.discount > 0 && <Row k="Discount" v={"−" + inr(o.discount)} />}
        <Row k="Total" v={inr(o.total)} bold />
        <p className="pt-3 text-muted-foreground">Deliver to: {o.address} · Payment: {o.payment}</p>
      </div>
      <div className="mt-8 flex justify-center gap-3"><Link to="/shop" className="btn btn-primary">Continue shopping</Link><Link to="/account" className="btn btn-outline">View my orders</Link></div>
    </div>
  );
}
