import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, X, RotateCcw } from "lucide-react";
import { QUESTIONS, recommend, type Answers } from "@/lib/don";
import { RATES, inr } from "@/lib/fleet";

export function DonChat() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const step = answers.length;
  const done = step >= QUESTIONS.length;
  const result = done
    ? recommend(Object.fromEntries(QUESTIONS.map((q, i) => [q.key, answers[i]!])) as Answers)
    : null;

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close DON car assistant" : "Open DON car assistant"}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent text-accent-foreground shadow-card"
      >
        {open ? <X /> : <MessageCircle />}
      </button>
      {open && (
        <div role="dialog" aria-label="DON — Car Assistant" className="fixed bottom-24 right-3 left-3 sm:left-auto z-50 sm:w-96 max-h-[70vh] flex flex-col rounded-xl border bg-card shadow-card overflow-hidden">
          <div className="flex items-start justify-between bg-secondary px-4 py-3 border-b">
            <div>
              <p className="font-display font-extrabold">DON — Car Assistant</p>
              <p className="text-xs text-muted-foreground">Find the right car for your needs.</p>
            </div>
            <button onClick={() => setAnswers([])} aria-label="Start over" className="text-muted-foreground hover:text-accent"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {QUESTIONS.slice(0, step + 1).map((q, i) => (
              <div key={q.key} className="space-y-2">
                <p className="rounded-lg bg-secondary px-3 py-2 max-w-[85%]">{q.q}</p>
                {answers[i] ? (
                  <p className="ml-auto w-fit rounded-lg bg-accent px-3 py-2 font-semibold text-accent-foreground">{answers[i]}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((o) => (
                      <button key={o} onClick={() => setAnswers([...answers, o])} className="rounded-full border px-3 py-1 hover:border-accent hover:text-accent">{o}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {result && (
              <div className="space-y-3">
                <p className="rounded-lg bg-secondary px-3 py-2">
                  {result.exact ? "Based on your requirements, I recommend:" : "I couldn't find an exact match, so these are the closest available cars:"}
                </p>
                {result.recs.map(({ car, reasons }, i) => (
                  <div key={car.name} className="rounded-lg border overflow-hidden">
                    <img src={car.image} alt={car.name} loading="lazy" className="h-28 w-full object-cover" />
                    <div className="p-3 space-y-1">
                      <p className="font-bold">{i === 0 ? "🚗 " : ""}{car.name} <span className="text-xs text-accent">{car.type}</span></p>
                      <p>💰 {inr(RATES[car.type])} / day</p>
                      <p className="text-xs text-muted-foreground">{car.seats} seats · {car.fuel} · {car.transmission}</p>
                      <p className="text-xs">⭐ Good match for {reasons.join(", ")}.</p>
                      <div className="flex gap-2 pt-1">
                        <Link to="/contact" search={{ car: car.name }} onClick={() => setOpen(false)} className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">Book</Link>
                        <Link to="/fleet" onClick={() => setOpen(false)} className="rounded-md border px-3 py-1.5 text-xs font-semibold">View details</Link>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">I'm DON, your car assistant. Tap ↻ to search again.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
