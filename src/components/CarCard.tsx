import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { RATES, inr, type cars } from "@/lib/fleet";

type Car = (typeof cars)[number];

const included = [
  "Self-drive or with driver",
  "Doorstep delivery inside Hyderabad",
  "Refundable security deposit",
  "24/7 roadside assistance",
];

function Front({ car }: { car: Car }) {
  return (
    <>
      <img src={car.image} alt={car.name} loading="lazy" width={1024} height={768} className="aspect-[4/3] w-full object-cover" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-accent">{car.type}</span>
          <span className="text-xs text-muted-foreground">Available</span>
        </div>
        <h3 className="text-xl font-bold">{car.name}</h3>
        <ul className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
          <li>{car.seats} seats</li>
          <li>{car.fuel}</li>
          <li>{car.transmission}</li>
          <li>AC</li>
        </ul>
        <div className="mt-auto flex items-end justify-between pt-3 border-t">
          <p>
            <span className="text-2xl font-extrabold font-display">{inr(RATES[car.type])}</span>
            <span className="text-sm text-muted-foreground"> / day</span>
          </p>
          <Link to="/contact" search={{ car: car.name }} className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground">
            Book now
          </Link>
        </div>
      </div>
    </>
  );
}

function Back({ car }: { car: Car }) {
  return (
    <div className="p-5 flex flex-col gap-3 flex-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-widest text-accent">{car.type}</span>
        <span className="text-xs text-muted-foreground">Details</span>
      </div>
      <h3 className="text-xl font-bold">{car.name}</h3>
      <p className="text-sm text-muted-foreground">
        {car.seats} seats · {car.fuel} · {car.transmission} · AC
      </p>
      <ul className="text-sm flex flex-col gap-1.5 mt-1">
        {included.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-accent font-bold" aria-hidden>✓</span>
            <span className="text-muted-foreground">{i}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-end justify-between pt-3 border-t">
        <p>
          <span className="text-2xl font-extrabold font-display">{inr(RATES[car.type])}</span>
          <span className="text-sm text-muted-foreground"> / day</span>
        </p>
        <Link
          to="/contact"
          search={{ car: car.name }}
          tabIndex={-1}
          className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground"
        >
          Book now
        </Link>
      </div>
    </div>
  );
}

export function CarCard({ car, flip = false }: { car: Car; flip?: boolean }) {
  const [open, setOpen] = useState(false);

  if (!flip) {
    return (
      <article className="rounded-xl border bg-card overflow-hidden shadow-card flex flex-col">
        <Front car={car} />
      </article>
    );
  }

  return (
    <article
      className="car-flip rounded-xl bg-card shadow-card"
      data-open={open ? "true" : "false"}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a,button")) return;
        setOpen((o) => !o);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((o) => !o);
        }
      }}
      tabIndex={0}
      aria-label={`${car.name} — press Enter to see details`}
    >
      <div className="car-flip__inner">
        <div className="car-flip__face car-flip__front rounded-xl border overflow-hidden flex flex-col">
          <Front car={car} />
          <span className="flip-hint">Hover or tap to flip</span>
        </div>
        <div className="car-flip__face car-flip__back rounded-xl border overflow-hidden flex flex-col bg-secondary">
          <Back car={car} />
        </div>
      </div>
    </article>
  );
}
