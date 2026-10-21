import { Link } from "@tanstack/react-router";
import { RATES, inr, type cars } from "@/lib/fleet";

export function CarCard({ car }: { car: (typeof cars)[number] }) {
  return (
    <article className="rounded-xl border bg-card overflow-hidden shadow-card flex flex-col">
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
          <Link to="/contact" search={{ car: car.name }} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Book now
          </Link>
        </div>
      </div>
    </article>
  );
}
