import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { CarCard } from "@/components/CarCard";
import { cars, RATES, inr, type CarType } from "@/lib/fleet";

export const Route = createFileRoute("/fleet")({
  head: () => ({
    meta: [
      { title: "Our Cars – SUVs & Sedans for Rent | AR Rentals Hyderabad" },
      { name: "description", content: "Toyota Fortuner, Mahindra XUV700, Honda City and Hyundai Verna available for rent in Hyderabad." },
      { property: "og:title", content: "Our Fleet – AR Rentals Hyderabad" },
      { property: "og:description", content: "SUVs and sedans available for daily rent in Hyderabad." },
    ],
  }),
  component: Fleet,
});

function Fleet() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Our cars</h1>
        <p className="text-muted-foreground mt-3 max-w-xl">All cars are air-conditioned, insured and serviced regularly.</p>
        {(["SUV", "Sedan"] as CarType[]).map((t) => (
          <section key={t} className="mt-14">
            <h2 className="text-2xl font-extrabold">{t}s <span className="text-accent">· {inr(RATES[t])}/day</span></h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {cars.filter((c) => c.type === t).map((c) => <CarCard key={c.name} car={c} flip />)}
            </div>
          </section>
        ))}
      </div>
    </SiteLayout>
  );
}
