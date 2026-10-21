import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { RATES, inr } from "@/lib/fleet";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing, Documents & Terms | AR Rentals Hyderabad" },
      { name: "description", content: `SUV ${inr(RATES.SUV)}/day, sedan ${inr(RATES.Sedan)}/day. Required documents, deposit, fuel and cancellation policy.` },
      { property: "og:title", content: "Pricing & Terms – AR Rentals" },
      { property: "og:description", content: "Simple daily rates and clear rental terms." },
    ],
  }),
  component: Pricing,
});

const terms = [
  ["Documents required", "Valid Indian driving licence (min. 1 year old), Aadhaar card, and one additional ID (PAN / passport)."],
  ["Minimum age", "Driver must be 21 years or older."],
  ["Security deposit", "Refundable deposit of ₹5,000, returned within 48 hours after the car is returned in good condition."],
  ["Rental period", "Rates are per 24 hours. Late returns beyond 2 hours are charged as an extra day."],
  ["Kilometres", "300 km included per day. Extra km charged at ₹10/km."],
  ["Fuel policy", "Same-to-same: return the car with the same fuel level you received it with."],
  ["Insurance", "All cars carry comprehensive insurance. Damage liability is capped at the deposit amount, except for negligence."],
  ["Cancellation", "Free cancellation up to 24 hours before pickup. Later cancellations incur one day's rent."],
];

function Pricing() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Simple daily pricing</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {([["SUV", "Toyota Fortuner · Mahindra XUV700", RATES.SUV], ["Sedan", "Honda City · Hyundai Verna", RATES.Sedan]] as const).map(([t, m, r]) => (
            <div key={t} className="rounded-xl border bg-card p-8 shadow-card">
              <p className="text-sm font-bold uppercase tracking-widest text-accent">{t}</p>
              <p className="mt-3"><span className="font-display text-5xl font-extrabold">{inr(r)}</span><span className="text-muted-foreground"> / day</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{m}</p>
              <p className="mt-4 text-sm">Weekly (7 days): <strong>{inr(r * 7)}</strong></p>
            </div>
          ))}
        </div>
        <h2 className="mt-16 text-3xl font-extrabold">Rental terms</h2>
        <dl className="mt-6 divide-y border-y">
          {terms.map(([t, d]) => (
            <div key={t} className="grid md:grid-cols-3 gap-2 py-5">
              <dt className="font-bold">{t}</dt>
              <dd className="md:col-span-2 text-muted-foreground">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </SiteLayout>
  );
}
