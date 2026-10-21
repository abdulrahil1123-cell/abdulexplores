import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { cars, rentalTotal, inr, PHONE, EMAIL, ADDRESS } from "@/lib/fleet";

export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): { car?: string | undefined } => ({ car: typeof s["car"] === "string" ? s["car"] : undefined }),
  head: () => ({
    meta: [
      { title: "Book a Car & Contact | AR Rentals Hyderabad" },
      { name: "description", content: "Book your SUV or sedan rental in Hyderabad. Call, WhatsApp or send a booking request to AR Rentals." },
      { property: "og:title", content: "Book with AR Rentals" },
      { property: "og:description", content: "Reserve your rental car in Hyderabad in minutes." },
    ],
  }),
  component: Contact,
});

const field = "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

function Contact() {
  const { car: preset } = Route.useSearch();
  const [car, setCar] = useState<string>(preset ?? cars[0]!.name);
  const [days, setDays] = useState(1);
  const [sent, setSent] = useState(false);
  const selected = cars.find((c) => c.name === car) ?? cars[0]!;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-16 grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h1 className="text-4xl md:text-5xl font-extrabold">Book your car</h1>
          <p className="mt-3 text-muted-foreground">Send a request and we'll confirm availability within 30 minutes.</p>
          <div className="mt-8 space-y-4 text-sm">
            <p><strong className="block">Phone / WhatsApp</strong>{PHONE}</p>
            <p><strong className="block">Email</strong>{EMAIL}</p>
            <p><strong className="block">Office</strong>{ADDRESS}</p>
            <p><strong className="block">Hours</strong>Open 7 days, 8:00 AM – 10:00 PM</p>
            <p><strong className="block">Service areas</strong>Baradari, Secunderabad, Hitech City, Gachibowli, Banjara Hills, Jubilee Hills, Kukatpally, RGIA Airport</p>
          </div>
        </div>
        <div className="lg:col-span-3 rounded-xl border bg-card p-6 md:p-8 shadow-card">
          {sent ? (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-extrabold">Request received!</h2>
              <p className="mt-2 text-muted-foreground">We'll call you shortly to confirm your {selected.name}.</p>
            </div>
          ) : (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label className="sm:col-span-2 text-sm font-medium">Full name<input required className={field} /></label>
              <label className="text-sm font-medium">Phone<input required type="tel" className={field} /></label>
              <label className="text-sm font-medium">Email<input type="email" className={field} /></label>
              <label className="sm:col-span-2 text-sm font-medium">Car
                <select className={field} value={car} onChange={(e) => setCar(e.target.value)}>
                  {cars.map((c) => <option key={c.name} value={c.name}>{c.name} ({c.type})</option>)}
                </select>
              </label>
              <label className="text-sm font-medium">Pickup date<input required type="date" className={field} /></label>
              <label className="text-sm font-medium">Number of days<input required type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value) || 1)} className={field} /></label>
              <label className="sm:col-span-2 text-sm font-medium">Pickup location<input placeholder="e.g. Baradari office, Secunderabad or RGIA Airport" className={field} /></label>
              <div className="sm:col-span-2 flex items-center justify-between rounded-md bg-secondary px-4 py-3">
                <span className="text-sm">Estimated rent</span>
                <span className="font-display text-2xl font-extrabold">{inr(rentalTotal(selected.type, days))}</span>
              </div>
              <button className="sm:col-span-2 rounded-md bg-accent py-3 font-bold text-accent-foreground">Send booking request</button>
            </form>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
