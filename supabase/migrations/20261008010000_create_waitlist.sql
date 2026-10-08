-- Pre-launch waitlist, one row per (email, product).
--
-- Kept separate from `subscribers`: that table is unique on email alone, so a
-- visitor who had already subscribed through another form would "join" the
-- waitlist without leaving any trace of it. Here the same person can be on the
-- waitlist for each product, and nowhere else is affected.

CREATE TABLE waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL CHECK (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' AND length(email) <= 320),
  product_slug text NOT NULL CHECK (length(product_slug) BETWEEN 1 AND 100),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (email, product_slug)
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone may join. There is deliberately no SELECT policy for the public, so
-- the list of emails can only be read with the service role (dashboard / SQL).
CREATE POLICY "Anyone can join a waitlist" ON waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
