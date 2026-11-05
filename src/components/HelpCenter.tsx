import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { HelpCircle, X, Phone, MessageCircle } from "lucide-react";
import { PHONE, buildWhatsAppLink, RATES, inr } from "@/lib/fleet";

const faqs = [
  ["What documents do I need?", "A valid driving licence, Aadhaar card and a refundable security deposit."],
  ["How much does it cost?", `SUVs are ${inr(RATES.SUV)}/day and sedans are ${inr(RATES.Sedan)}/day. No hidden charges.`],
  ["Do you deliver the car?", "Yes — doorstep delivery across Hyderabad, Secunderabad and the airport, or pick up at our Baradari office."],
  ["What if the car breaks down?", "Call us anytime — we offer 24/7 roadside assistance."],
  ["Can I cancel a booking?", "Yes. Contact us on call or WhatsApp to cancel or change your booking."],
];

export function HelpCenter() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close help center" : "Open help center"}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-semibold hover:border-accent hover:text-accent"
      >
        {open ? <X className="h-4 w-4" /> : <HelpCircle className="h-4 w-4" />}
        <span className="hidden sm:inline">Help</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Help center" className="fixed right-3 left-3 top-20 sm:absolute sm:left-auto sm:top-12 sm:right-0 z-50 sm:w-96 max-h-[75vh] overflow-y-auto rounded-xl border bg-card p-4 shadow-card">
          <p className="font-display text-lg font-extrabold">Help Center</p>
          <p className="text-xs text-muted-foreground">Quick answers to common questions.</p>
          <div className="mt-3 space-y-2">
            {faqs.map(([q, a]) => (
              <details key={q} className="rounded-lg border bg-secondary px-3 py-2 text-sm">
                <summary className="cursor-pointer font-semibold">{q}</summary>
                <p className="mt-2 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold">Still need help?</p>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="flex items-center justify-center gap-1 rounded-md bg-accent px-3 py-2 font-bold text-accent-foreground"><Phone className="h-4 w-4" />Call</a>
            <a href={buildWhatsAppLink("Hi AR Rentals, I need help.")} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1 rounded-md border px-3 py-2 font-semibold hover:border-accent hover:text-accent"><MessageCircle className="h-4 w-4" />WhatsApp</a>
          </div>
          <Link to="/pricing" onClick={() => setOpen(false)} className="mt-3 block text-center text-xs underline underline-offset-4 text-muted-foreground">See full pricing & terms</Link>
        </div>
      )}
    </div>
  );
}
