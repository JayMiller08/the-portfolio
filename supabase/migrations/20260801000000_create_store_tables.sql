-- Store schema: products, orders, and private file storage for Paystack checkout.

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
CREATE TABLE products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  -- Price is stored in the smallest currency unit (cents for ZAR).
  -- This is the ONLY source of truth for price; the client never sends an amount.
  price_cents integer NOT NULL CHECK (price_cents >= 0),
  currency text NOT NULL DEFAULT 'ZAR',
  -- Path inside the private `product-files` storage bucket.
  storage_path text NOT NULL,
  -- Products are inactive until a real price is set. Inactive products cannot be bought.
  active boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Anyone may read active products (needed to render the store), but note the
-- storage_path is not sensitive on its own: the bucket is private and files are
-- only reachable through a signed URL issued after payment is verified.
CREATE POLICY "Public can read active products" ON products
  FOR SELECT
  TO public
  USING (active = true);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
CREATE TABLE orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Paystack transaction reference; unique so webhook retries are idempotent.
  reference text NOT NULL UNIQUE,
  email text NOT NULL,
  product_id uuid NOT NULL REFERENCES products(id),
  -- Amount we asked Paystack to charge, recorded at initialization time so the
  -- webhook can detect a mismatch against what was actually paid.
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'ZAR',
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'failed', 'mismatch')),
  paystack_event jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  paid_at timestamp with time zone,
  email_sent_at timestamp with time zone
);

CREATE INDEX orders_email_idx ON orders (email);
CREATE INDEX orders_status_idx ON orders (status);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Deliberately NO public policies on orders. Every read and write goes through
-- Edge Functions using the service role key, so customer emails and purchase
-- history are never exposed to the browser.

-- ---------------------------------------------------------------------------
-- Private storage for the purchasable files
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-files', 'product-files', false)
ON CONFLICT (id) DO NOTHING;

-- No storage policies are created for the anon role: the bucket stays private
-- and downloads are served exclusively via short-lived signed URLs created by
-- the paystack-verify function after a payment is confirmed.

-- ---------------------------------------------------------------------------
-- Seed the three products that currently sell through Gumroad.
--
-- IMPORTANT: price_cents is a placeholder and active is false. Set the real
-- price (in cents, e.g. 14900 = R149.00) and flip active to true before these
-- can be sold. See docs/PAYSTACK_SETUP.md step 5.
-- ---------------------------------------------------------------------------
INSERT INTO products (slug, title, description, price_cents, currency, storage_path, active) VALUES
  (
    'handbook',
    'The Beginner Programmers'' Survival Handbook',
    'A comprehensive guide to help you navigate the early stages of your programming journey.',
    0, 'ZAR', 'handbook.pdf', false
  ),
  (
    'playbook',
    'The Self-Taught Developer Playbook',
    'Your roadmap to becoming a successful self-taught developer.',
    0, 'ZAR', 'playbook.pdf', false
  ),
  (
    'notion-os',
    'The CS Student Life OS Notion Template',
    'Organize your computer science studies and life with this all-in-one Notion template.',
    0, 'ZAR', 'notion-os.pdf', false
  )
ON CONFLICT (slug) DO NOTHING;
