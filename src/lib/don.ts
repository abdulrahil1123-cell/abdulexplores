import { cars, type CarType } from "@/lib/fleet";

type Car = (typeof cars)[number];

export const QUESTIONS = [
  { key: "type", q: "What type of car are you looking for?", options: ["SUV", "Sedan", "Hatchback", "Luxury", "Any type"] },
  { key: "budget", q: "What is your approximate budget?", options: ["Under ₹5 Lakh", "₹5–10 Lakh", "₹10–20 Lakh", "₹20–30 Lakh", "Above ₹30 Lakh"] },
  { key: "use", q: "What will you mainly use the car for?", options: ["Family", "Daily commute", "Business", "Long trips", "Luxury / Premium", "General use"] },
  { key: "seats", q: "How many people do you usually need to accommodate?", options: ["2–4", "5", "6–7", "8+"] },
  { key: "fuel", q: "Any preferred fuel type?", options: ["Petrol", "Diesel", "Electric", "Any"] },
] as const;

export type Answers = Record<(typeof QUESTIONS)[number]["key"], string>;

// Car value bands (₹ lakh) used to match the customer's budget answer.
const BAND: Record<CarType, number> = { Sedan: 1, SUV: 3 };
const budgetBand = (b: string) => ["Under ₹5 Lakh", "₹5–10 Lakh", "₹10–20 Lakh", "₹20–30 Lakh", "Above ₹30 Lakh"].indexOf(b);
const minSeats = (s: string) => ({ "2–4": 2, "5": 5, "6–7": 6, "8+": 8 })[s] ?? 0;

export type Rec = { car: Car; score: number; reasons: string[] };

export function recommend(a: Answers): { recs: Rec[]; exact: boolean } {
  const wantType: CarType | null = a.type === "SUV" || a.type === "Luxury" ? "SUV" : a.type === "Sedan" || a.type === "Hatchback" ? "Sedan" : null;
  const scored = cars.map((car) => {
    let score = 0; const reasons: string[] = []; let exact = true;
    if (!wantType || car.type === wantType) { score += 3; reasons.push(wantType ? `${car.type} preference` : "any type"); } else exact = false;
    const bb = budgetBand(a.budget);
    if (bb < 0 || Math.abs(bb - BAND[car.type]) <= 1) { score += 2; reasons.push("your budget"); } else exact = false;
    if (car.seats >= minSeats(a.seats)) { score += 3; reasons.push(`${car.seats} seats`); } else exact = false;
    if (a.fuel === "Any" || car.fuel === a.fuel) { score += 2; if (a.fuel !== "Any") reasons.push(`${car.fuel} engine`); } else exact = false;
    const big = ["Family", "Long trips", "Luxury / Premium", "Business"].includes(a.use);
    if ((big && car.type === "SUV") || (!big && car.type === "Sedan") || a.use === "General use") { score += 1; reasons.push(`${a.use.toLowerCase()} use`); }
    return { car, score, reasons, exact };
  }).sort((x, y) => y.score - x.score);
  const exactOnes = scored.filter((s) => s.exact);
  const list = (exactOnes.length ? exactOnes : scored).slice(0, 3);
  return { recs: list.map(({ car, score, reasons }) => ({ car, score, reasons })), exact: exactOnes.length > 0 };
}
