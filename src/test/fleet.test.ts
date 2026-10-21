import { describe, it, expect } from "vitest";
import { RATES, cars, rentalTotal } from "@/lib/fleet";

describe("AR Rentals pricing", () => {
  it("SUV is ₹2000 per day", () => expect(RATES.SUV).toBe(2000));
  it("Sedan is ₹1000 per day", () => expect(RATES.Sedan).toBe(1000));
  it("3-day SUV costs ₹6000", () => expect(rentalTotal("SUV", 3)).toBe(6000));
  it("lists at least 2 SUVs and 2 sedans", () => {
    expect(cars.filter((c) => c.type === "SUV").length).toBeGreaterThanOrEqual(2);
    expect(cars.filter((c) => c.type === "Sedan").length).toBeGreaterThanOrEqual(2);
  });
});
