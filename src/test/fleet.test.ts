import { describe, it, expect } from "vitest";
import { RATES, cars, rentalTotal, buildWhatsAppLink, buildReviewWhatsAppMessage } from "@/lib/fleet";

describe("AR Rentals pricing", () => {
  it("SUV is ₹2000 per day", () => expect(RATES.SUV).toBe(2000));
  it("Sedan is ₹1000 per day", () => expect(RATES.Sedan).toBe(1000));
  it("3-day SUV costs ₹6000", () => expect(rentalTotal("SUV", 3)).toBe(6000));
  it("lists at least 2 SUVs and 2 sedans", () => {
    expect(cars.filter((c) => c.type === "SUV").length).toBeGreaterThanOrEqual(2);
    expect(cars.filter((c) => c.type === "Sedan").length).toBeGreaterThanOrEqual(2);
  });
});

describe("WhatsApp review handoff", () => {
  it("links to the owner's WhatsApp number", () => {
    expect(buildWhatsAppLink("hi there")).toBe(
      "https://wa.me/919121705635?text=" + encodeURIComponent("hi there"),
    );
  });
  it("review message carries name, rating and review text", () => {
    const msg = buildReviewWhatsAppMessage("Abdul", 5, "Toyota Fortuner", "Great car");
    expect(msg).toContain("Abdul");
    expect(msg).toContain("5/5");
    expect(msg).toContain("Toyota Fortuner");
    expect(msg).toContain("Great car");
  });
});
