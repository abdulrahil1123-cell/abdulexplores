CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(name) <= 60),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  car TEXT,
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 5 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reviews"
  ON public.reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can submit a review"
  ON public.reviews FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    rating >= 1 AND rating <= 5
    AND char_length(name) BETWEEN 1 AND 60
    AND char_length(message) BETWEEN 5 AND 1000
  );