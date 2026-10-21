// Centralised demo mock data. All values are illustrative and editable from the admin panel.
import hero from "@/assets/hero.jpg";
import veg from "@/assets/cat-veg.jpg";
import fruits from "@/assets/cat-fruits.jpg";
import snacks from "@/assets/cat-snacks.jpg";
import ready from "@/assets/cat-ready.jpg";
import meat from "@/assets/cat-meat.jpg";
import seafood from "@/assets/cat-seafood.jpg";
import bakery from "@/assets/cat-bakery.jpg";
import combo from "@/assets/cat-combo.jpg";
import fresh from "@/assets/cat-fresh.jpg";
import about from "@/assets/about.jpg";
import promo from "@/assets/promo.jpg";
import type { Coupon } from "./pricing";

export const IMAGES = { hero, veg, fruits, snacks, ready, meat, seafood, bakery, combo, fresh, about, promo };

export type ProductType = "fresh" | "frozen" | "ready" | "combo";
export type Product = {
  id: string; name: string; category: string; type: ProductType; pack: string; price: number; mrp: number;
  stock: number; sku: string; description: string; image: string; rating: number; popularity: number;
  featured: boolean; bestseller: boolean; available: boolean;
};
export type Category = { id: string; slug: string; name: string; description: string; image: string; visible: boolean; illustrative: boolean };
export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type Order = {
  id: string; customer: string; email: string; phone: string; address: string; date: string;
  items: { id: string; name: string; qty: number; price: number }[];
  subtotal: number; delivery: number; discount: number; total: number;
  payment: string; paymentStatus: "Paid (demo)" | "Unpaid (demo)"; status: OrderStatus; notes?: string;
};
export type Customer = { id: string; name: string; email: string; phone: string; city: string; joined: string };
export type Banner = { id: string; slot: "hero" | "promo"; eyebrow: string; title: string; subtitle: string; image: string; ctaText: string; ctaLink: string; visible: boolean };
export type Enquiry = { id: string; name: string; email: string; subject: string; message: string; date: string; status: "Unread" | "Read" | "Resolved" };
export type Settings = { storeName: string; currency: string; deliveryFee: number; freeThreshold: number; lowStock: number; phone: string; email: string; address: string; announcement: string };
export type Content = {
  trust: { title: string; text: string }[];
  categoriesHeading: string; bestsellersHeading: string; bestsellersText: string;
  promoHeading: string; promoText: string;
  whyHeading: string; whyText: string;
  aboutTitle: string; aboutBody: string; footerDesc: string;
  privacy: string; terms: string; shipping: string; returns: string;
};

export const defaultCategories: Category[] = [
  { id: "c1", slug: "fresh-essentials", name: "Fresh Essentials", description: "Everyday greens, paneer and kitchen basics.", image: fresh, visible: true, illustrative: true },
  { id: "c2", slug: "frozen-vegetables", name: "Frozen Vegetables", description: "Peas, corn, mixed veg and more.", image: veg, visible: true, illustrative: true },
  { id: "c3", slug: "frozen-fruits", name: "Frozen Fruits", description: "Berries and fruit cubes for smoothies.", image: fruits, visible: true, illustrative: true },
  { id: "c4", slug: "frozen-snacks", name: "Frozen Snacks", description: "Samosas, rolls, nuggets and wedges.", image: snacks, visible: true, illustrative: true },
  { id: "c5", slug: "ready-to-cook", name: "Ready-to-Cook Foods", description: "Parathas, dumplings and quick meals.", image: ready, visible: true, illustrative: true },
  { id: "c6", slug: "meat-poultry", name: "Frozen Meat & Poultry", description: "Marinated cuts and kebabs.", image: meat, visible: true, illustrative: true },
  { id: "c7", slug: "seafood", name: "Seafood", description: "Prawns and fish fillets.", image: seafood, visible: true, illustrative: true },
  { id: "c8", slug: "bakery-desserts", name: "Bakery & Frozen Desserts", description: "Ice creams, croissants and cakes.", image: bakery, visible: true, illustrative: true },
  { id: "c9", slug: "combos", name: "Food Combos & Family Packs", description: "Value bundles for the whole family.", image: combo, visible: true, illustrative: true },
];

const P = (id: string, name: string, category: string, type: ProductType, pack: string, price: number, mrp: number, stock: number, image: string, extra: Partial<Product> = {}): Product => ({
  id, name, category, type, pack, price, mrp, stock, image, sku: `UFF-${id.toUpperCase()}`,
  description: `${name} — a sample product description for this demo store. Replace with the actual product information supplied by the business.`,
  rating: 4.2 + ((id.charCodeAt(1) % 7) / 10), popularity: 100 - Number(id.slice(1)) * 3,
  featured: false, bestseller: false, available: true, ...extra,
});

export const defaultProducts: Product[] = [
  P("p1", "Green Garden Peas", "frozen-vegetables", "frozen", "1 kg", 199, 240, 64, veg, { bestseller: true }),
  P("p2", "Sweet Corn Kernels", "frozen-vegetables", "frozen", "500 g", 129, 150, 40, veg),
  P("p3", "Mixed Vegetables", "frozen-vegetables", "frozen", "1 kg", 219, 260, 8, veg, { bestseller: true }),
  P("p4", "Berry Medley", "frozen-fruits", "frozen", "400 g", 349, 420, 22, fruits, { bestseller: true, featured: true }),
  P("p5", "Alphonso Mango Cubes", "frozen-fruits", "frozen", "500 g", 299, 340, 0, fruits, { available: false }),
  P("p6", "Punjabi Samosa", "frozen-snacks", "frozen", "12 pcs", 179, 210, 55, snacks, { bestseller: true }),
  P("p7", "Veg Spring Rolls", "frozen-snacks", "frozen", "10 pcs", 159, 180, 30, snacks),
  P("p8", "Potato Cheese Nuggets", "frozen-snacks", "frozen", "400 g", 189, 220, 6, snacks),
  P("p9", "Laccha Paratha", "ready-to-cook", "ready", "5 pcs", 119, 140, 80, ready, { bestseller: true, featured: true }),
  P("p10", "Veg Momos", "ready-to-cook", "ready", "20 pcs", 199, 230, 35, ready),
  P("p11", "Chicken Seekh Kebab", "meat-poultry", "frozen", "500 g", 399, 460, 18, meat, { bestseller: true }),
  P("p12", "Tandoori Chicken Tikka", "meat-poultry", "ready", "450 g", 429, 480, 12, meat),
  P("p13", "Tiger Prawns (Cleaned)", "seafood", "frozen", "500 g", 549, 650, 9, seafood, { bestseller: true }),
  P("p14", "Basa Fish Fillet", "seafood", "frozen", "1 kg", 479, 540, 20, seafood),
  P("p15", "Vanilla Bean Ice Cream", "bakery-desserts", "frozen", "1 L", 249, 290, 26, bakery, { bestseller: true }),
  P("p16", "Butter Croissants (Bake at Home)", "bakery-desserts", "ready", "6 pcs", 229, 260, 14, bakery),
  P("p17", "Fresh Paneer Block", "fresh-essentials", "fresh", "200 g", 99, 110, 45, fresh, { featured: true }),
  P("p18", "Spinach & Herbs Bundle", "fresh-essentials", "fresh", "500 g", 79, 90, 30, fresh),
  P("p19", "Family Freezer Combo", "combos", "combo", "6 items", 999, 1290, 15, combo, { featured: true }),
  P("p20", "Snack Party Pack", "combos", "combo", "4 items", 649, 790, 20, combo, { featured: true }),
];

export const defaultCustomers: Customer[] = [
  { id: "u1", name: "Sample Customer A", email: "customer.a@example.com", phone: "+91 00000 00001", city: "City placeholder", joined: "2026-06-12" },
  { id: "u2", name: "Sample Customer B", email: "customer.b@example.com", phone: "+91 00000 00002", city: "City placeholder", joined: "2026-07-03" },
  { id: "u3", name: "Sample Customer C", email: "customer.c@example.com", phone: "+91 00000 00003", city: "City placeholder", joined: "2026-08-21" },
  { id: "u4", name: "Sample Customer D", email: "customer.d@example.com", phone: "+91 00000 00004", city: "City placeholder", joined: "2026-09-09" },
];

const O = (id: string, c: Customer, date: string, items: [string, string, number, number][], status: OrderStatus, payment: string): Order => {
  const its = items.map(([i, n, q, p]) => ({ id: i, name: n, qty: q, price: p }));
  const subtotal = its.reduce((s, i) => s + i.qty * i.price, 0);
  const delivery = subtotal >= 799 ? 0 : 49;
  return { id, customer: c.name, email: c.email, phone: c.phone, address: "Address placeholder", date, items: its, subtotal, delivery, discount: 0, total: subtotal + delivery, payment, paymentStatus: payment === "Cash on Delivery" && status !== "Delivered" ? "Unpaid (demo)" : "Paid (demo)", status };
};

export const defaultOrders: Order[] = [
  O("UFF-10241", defaultCustomers[0]!, "2026-10-18", [["p1", "Green Garden Peas", 2, 199], ["p6", "Punjabi Samosa", 1, 179]], "Delivered", "UPI (demo)"),
  O("UFF-10242", defaultCustomers[1]!, "2026-10-19", [["p19", "Family Freezer Combo", 1, 999]], "Shipped", "Card (demo)"),
  O("UFF-10243", defaultCustomers[2]!, "2026-10-20", [["p11", "Chicken Seekh Kebab", 1, 399], ["p9", "Laccha Paratha", 2, 119]], "Processing", "Cash on Delivery"),
  O("UFF-10244", defaultCustomers[3]!, "2026-10-20", [["p4", "Berry Medley", 2, 349]], "Pending", "UPI (demo)"),
  O("UFF-10245", defaultCustomers[0]!, "2026-10-21", [["p13", "Tiger Prawns (Cleaned)", 1, 549], ["p15", "Vanilla Bean Ice Cream", 1, 249]], "Confirmed", "Card (demo)"),
];

export const defaultCoupons: Coupon[] = [
  { id: "o1", code: "FRESH10", title: "10% off orders above ₹500", type: "percent", value: 10, minOrder: 500, start: "2026-01-01", end: "2027-12-31", active: true, visible: true },
  { id: "o2", code: "FROZEN100", title: "₹100 off orders above ₹1,200", type: "fixed", value: 100, minOrder: 1200, start: "2026-01-01", end: "2027-12-31", active: true, visible: true },
  { id: "o3", code: "WELCOME50", title: "₹50 off your first order", type: "fixed", value: 50, minOrder: 300, start: "2026-01-01", end: "2026-03-31", active: false, visible: false },
];

export const defaultBanners: Banner[] = [
  { id: "b1", slot: "hero", eyebrow: "FRESHNESS YOU CAN TRUST", title: "Fresh Choices. Frozen Goodness.", subtitle: "Discover quality food essentials and frozen favourites made for everyday convenience.", image: hero, ctaText: "Shop All Products", ctaLink: "/shop", visible: true },
  { id: "b2", slot: "promo", eyebrow: "DEMO OFFER", title: "Stock your freezer, the easy way.", subtitle: "Use code FRESH10 for 10% off orders above ₹500. Sample promotion for demonstration only.", image: promo, ctaText: "Shop Frozen Essentials", ctaLink: "/shop?type=frozen", visible: true },
];

export const defaultEnquiries: Enquiry[] = [
  { id: "e1", name: "Sample Visitor 1", email: "visitor1@example.com", subject: "Bulk order question", message: "Do you offer family packs for events? (sample enquiry)", date: "2026-10-17", status: "Unread" },
  { id: "e2", name: "Sample Visitor 2", email: "visitor2@example.com", subject: "Delivery areas", message: "Which areas do you deliver to? (sample enquiry)", date: "2026-10-19", status: "Read" },
  { id: "e3", name: "Sample Visitor 3", email: "visitor3@example.com", subject: "Product request", message: "Will you stock frozen sweet potato fries? (sample enquiry)", date: "2026-10-20", status: "Resolved" },
];

export const defaultSettings: Settings = {
  storeName: "Unique Fresh & Frozen Foods", currency: "₹", deliveryFee: 49, freeThreshold: 799, lowStock: 10,
  phone: "+91 XXXXX XXXXX (placeholder)", email: "hello@your-domain.com (placeholder)", address: "Business address placeholder",
  announcement: "Demo store — free delivery on orders above ₹799 (sample value)",
};

const editable = "This is editable demo content. Replace it with the business's actual, legally reviewed policy text.";
export const defaultContent: Content = {
  trust: [
    { title: "Quality Food Selection", text: "A curated range of fresh and frozen essentials." },
    { title: "Convenient Shopping", text: "Browse, filter and order in a few taps." },
    { title: "Frozen Food Favourites", text: "Snacks, meals and desserts ready when you are." },
    { title: "Easy Order Review", text: "Check your cart and order summary at every step." },
  ],
  categoriesHeading: "Shop by Category",
  bestsellersHeading: "Bestselling Products",
  bestsellersText: "Popular picks from our demo catalogue.",
  promoHeading: "Special Offers & Combos",
  promoText: "Sample bundles and promotional prices for demonstration.",
  whyHeading: "Everyday meals, made simpler.",
  whyText: "From weeknight dinners to weekend snacks, our range is organised to help you plan meals quickly. Mix fresh essentials with frozen favourites and keep your kitchen ready for whatever the day brings.",
  aboutTitle: "About Unique Fresh and Frozen Foods",
  aboutBody: "UNIQUE FRESH AND FROZEN FOODS PRIVATE LIMITED focuses on fresh foods, frozen food products, ready-to-cook items and convenient food shopping. This About section is editable demo content — add the company's real story, team and history from the admin panel.",
  footerDesc: "Fresh foods, frozen favourites and ready-to-cook essentials for everyday convenience.",
  privacy: `${editable}\n\nDescribe what customer information is collected, how it is used and how customers can contact you about their data.`,
  terms: `${editable}\n\nDescribe the conditions of using this website and placing orders.`,
  shipping: `${editable}\n\nDescribe delivery areas, timelines and fees. The demo uses a sample delivery fee and free-delivery threshold set in admin settings.`,
  returns: `${editable}\n\nDescribe how returns, replacements and refunds are handled for fresh and frozen items.`,
};
