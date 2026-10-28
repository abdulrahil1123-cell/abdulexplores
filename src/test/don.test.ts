import { describe, it, expect } from "vitest";
import { recommend } from "@/lib/don";

describe("DON recommendations", () => {
  it("SUV family diesel 7 seats → only SUVs", () => {
    const r = recommend({ type: "SUV", budget: "₹20–30 Lakh", use: "Family", seats: "6–7", fuel: "Diesel" });
    expect(r.exact).toBe(true);
    expect(r.recs.every((x) => x.car.type === "SUV")).toBe(true);
  });
  it("Sedan petrol commute → sedans", () => {
    const r = recommend({ type: "Sedan", budget: "₹5–10 Lakh", use: "Daily commute", seats: "5", fuel: "Petrol" });
    expect(r.recs.map((x) => x.car.name)).toEqual(expect.arrayContaining(["Honda City", "Hyundai Verna"]));
  });
  it("Electric has no exact match → closest cars, max 3", () => {
    const r = recommend({ type: "Any type", budget: "Above ₹30 Lakh", use: "General use", seats: "8+", fuel: "Electric" });
    expect(r.exact).toBe(false);
    expect(r.recs.length).toBe(3);
  });
});
