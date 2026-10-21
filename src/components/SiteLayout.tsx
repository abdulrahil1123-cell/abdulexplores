import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PHONE, EMAIL, ADDRESS } from "@/lib/fleet";

const nav = [
  { to: "/", label: "Home" },
  { to: "/fleet", label: "Our Cars" },
  { to: "/pricing", label: "Pricing & Terms" },
  { to: "/contact", label: "Contact & Booking" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
            AR<span className="text-accent"> Rentals</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="text-muted-foreground hover:text-foreground" activeProps={{ className: "text-foreground" }} activeOptions={{ exact: true }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground">
            Call {PHONE}
          </a>
        </div>
        <nav className="md:hidden flex gap-4 overflow-x-auto px-5 pb-3 text-sm">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="whitespace-nowrap text-muted-foreground" activeProps={{ className: "text-foreground font-semibold" }} activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-12 grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <p className="font-display text-xl font-extrabold">AR Rentals</p>
            <p className="mt-2 opacity-70">Self-drive SUV and sedan rentals across Hyderabad & Secunderabad.</p>
          </div>
          <div className="space-y-1 opacity-80">
            <p className="font-semibold opacity-100">Contact</p>
            <p>{PHONE}</p>
            <p>{EMAIL}</p>
            <p>{ADDRESS}</p>
          </div>
          <div className="space-y-1 opacity-80">
            <p className="font-semibold opacity-100">Hours</p>
            <p>Open 7 days, 8:00 AM – 10:00 PM</p>
            <p>24/7 roadside assistance</p>
          </div>
        </div>
        <p className="text-center text-xs opacity-60 pb-6">© {new Date().getFullYear()} AR Rentals, Hyderabad</p>
      </footer>
    </div>
  );
}
