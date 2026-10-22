import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { cars, buildReviewWhatsAppMessage, buildWhatsAppLink } from "@/lib/fleet";
import { supabase } from "@/integrations/supabase/client";

export type Review = {
  id: string;
  name: string;
  rating: number;
  car: string | null;
  message: string;
  created_at: string;
};

export const listReviews = createServerFn({ method: "GET" }).handler(async (): Promise<Review[]> => {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const db = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    // Opaque sb_ keys aren't JWTs; send only apikey, not the default Authorization bearer.
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await db
    .from("reviews")
    .select("id, name, rating, car, message, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as Review[];
});

export const Route = createFileRoute("/reviews")({
  loader: () => listReviews(),
  head: () => ({
    meta: [
      { title: "Customer Reviews | AR Rentals Hyderabad" },
      { name: "description", content: "Read customer reviews and share your experience renting an SUV or sedan from AR Rentals, Hyderabad." },
      { property: "og:title", content: "AR Rentals Customer Reviews" },
      { property: "og:description", content: "See what customers say about self-drive car rentals from AR Rentals, Hyderabad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reviews,
});

const field = "w-full rounded-md border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";

const Stars = ({ value, className = "" }: { value: number; className?: string }) => (
  <span className={className} aria-label={`${value} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < value ? "text-accent" : "text-muted-foreground opacity-40"}>
        ★
      </span>
    ))}
  </span>
);

function Reviews() {
  const reviews = Route.useLoaderData() as Review[];
  const router = useRouter();

  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [car, setCar] = useState<string>("Other");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentName, setSentName] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (cleanName.length < 1 || cleanName.length > 60) {
      setError("Please enter your name (up to 60 characters).");
      return;
    }
    if (cleanMessage.length < 5 || cleanMessage.length > 1000) {
      setError("Your review must be between 5 and 1000 characters.");
      return;
    }
    setSubmitting(true);
    const { error: insertError } = await supabase
      .from("reviews")
      .insert({ name: cleanName, rating, car, message: cleanMessage });
    setSubmitting(false);
    if (insertError) {
      setError("Something went wrong while saving your review. Please try again.");
      return;
    }
    router.invalidate();
    setSentName(cleanName);
    window.open(
      buildWhatsAppLink(buildReviewWhatsAppMessage(cleanName, rating, car, cleanMessage)),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const avg = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : 0;

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Customer reviews</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Real feedback from customers who rented with us. Every review also reaches us directly on WhatsApp.
        </p>
        {reviews.length > 0 && (
          <p className="mt-4 text-sm">
            <Stars value={Math.round(avg)} />{" "}
            <span className="font-semibold">{avg}/5</span>
            <span className="text-muted-foreground"> · {reviews.length} review{reviews.length === 1 ? "" : "s"}</span>
          </p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-4">
            {reviews.length === 0 ? (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                No reviews yet — be the first to tell us about your rental.
              </div>
            ) : (
              reviews.map((r) => (
                <article key={r.id} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{r.name}</p>
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.car ? `${r.car} · ` : ""}
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">{r.message}</p>
                </article>
              ))
            )}
          </div>

          <div className="lg:col-span-2">
            {sentName ? (
              <div className="rounded-xl border bg-card p-8 shadow-card">
                <h2 className="text-2xl font-extrabold">Thanks, {sentName}!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your review is saved. A WhatsApp chat with your review is ready to send — press send and it reaches us instantly.
                </p>
                <a
                  href={buildWhatsAppLink(buildReviewWhatsAppMessage(sentName, rating, car, message.trim()))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-bold text-accent-foreground hover:brightness-110"
                >
                  Open WhatsApp again
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4 rounded-xl border bg-card p-6 shadow-card" noValidate>
                <h2 className="font-display text-xl font-extrabold">Leave a review</h2>
                <label className="text-sm font-medium">
                  Your name
                  <input
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`mt-1 ${field}`}
                    placeholder="e.g. Abdul R."
                  />
                </label>
                <div className="text-sm font-medium">
                  Rating
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        aria-label={`${n} star${n === 1 ? "" : "s"}`}
                        onClick={() => setRating(n)}
                        className={`text-2xl leading-none transition-transform hover:scale-110 ${
                          n <= rating ? "text-accent" : "text-muted-foreground opacity-40"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <label className="text-sm font-medium">
                  Car rented
                  <select value={car} onChange={(e) => setCar(e.target.value)} className={`mt-1 ${field}`}>
                    <option value="Other">Other / not sure</option>
                    {cars.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm font-medium">
                  Your review
                  <textarea
                    required
                    minLength={5}
                    maxLength={1000}
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`mt-1 ${field}`}
                    placeholder="How was the car, the pickup, the price?"
                  />
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-accent py-3 font-bold text-accent-foreground hover:brightness-110 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Submit review"}
                </button>
                <p className="text-xs text-muted-foreground">
                  Submitting saves your review here and opens WhatsApp with your review ready to send to us.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
