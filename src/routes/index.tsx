import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import heroVideo from "@/assets/hero-video.mp4.asset.json";
import { SiteLayout } from "@/components/SiteLayout";
import { CarCard } from "@/components/CarCard";
import { cars, RATES, inr } from "@/lib/fleet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AR Rentals – Self-Drive Car Rentals in Hyderabad" },
      { name: "description", content: `Rent SUVs from ${inr(RATES.SUV)}/day and sedans from ${inr(RATES.Sedan)}/day in Hyderabad. Doorstep delivery, clean cars, 24/7 support.` },
      { property: "og:title", content: "AR Rentals – Car Rentals in Hyderabad" },
      { property: "og:description", content: "Well-maintained SUVs and sedans for rent across Hyderabad." },
    ],
  }),
  component: Index,
});

const features = [
  ["Doorstep delivery", "Pickup & drop anywhere in Hyderabad, Secunderabad and the airport (RGIA)."],
  ["Transparent pricing", "Flat daily rates. No hidden charges. Fuel policy explained upfront."],
  ["Sanitised & serviced", "Every car is cleaned and checked before each trip."],
  ["24/7 roadside help", "Breakdown or flat tyre? One call and we're on our way."],
];

const steps = [
  ["Choose your car", "Pick an SUV or sedan that fits your trip."],
  ["Share documents", "Driving licence, Aadhaar and a refundable deposit."],
  ["Drive away", "Collect at our Baradari office or get it delivered."],
];

function DriveLane({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setGo(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`drive-lane grid gap-6 sm:grid-cols-2 lg:grid-cols-4 overflow-x-clip ${go ? "is-driving" : ""}`}>
      {children}
    </div>
  );
}

function Index() {
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden text-primary-foreground">
        <video src={heroVideo.url} poster={hero} autoPlay muted loop playsInline aria-hidden className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto max-w-6xl px-5 py-28 md:py-40">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Hyderabad · Self-drive</p>
          <h1 className="mt-4 max-w-2xl text-4xl md:text-6xl font-extrabold leading-[1.05]">Rent a car in Hyderabad, your way.</h1>
          <p className="mt-5 max-w-lg text-lg opacity-85">
            SUVs at {inr(RATES.SUV)}/day. Sedans at {inr(RATES.Sedan)}/day. Clean cars, honest prices, delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/fleet" className="rounded-md bg-accent px-6 py-3 font-bold text-accent-foreground">View our cars</Link>
            <Link to="/contact" className="rounded-md border border-primary-foreground/40 px-6 py-3 font-semibold hover:border-accent hover:text-accent">Book a car</Link>
          </div>
        </div>
      </section>




      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold">Available now</h2>
            <p className="text-muted-foreground mt-2">2 SUVs and 2 sedans ready for your next trip.</p>
          </div>
          <Link to="/fleet" className="text-sm font-semibold underline underline-offset-4">See all</Link>
        </div>
        <DriveLane>
          {cars.map((c) => <CarCard key={c.name} car={c} />)}
        </DriveLane>
      </section>

      <section className="bg-secondary/70 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-5 py-20 grid gap-8 md:grid-cols-4">
          {features.map(([t, d]) => (
            <div key={t}>
              <div className="h-1 w-10 bg-accent mb-4" />
              <h3 className="font-bold text-lg">{t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10">How it works</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t} className="rounded-xl border bg-card/85 backdrop-blur p-6">
              <span className="font-display text-5xl font-extrabold text-accent">0{i + 1}</span>
              <h3 className="mt-3 font-bold text-lg">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </SiteLayout>
  );
}
