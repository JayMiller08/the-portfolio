-- Launch-tier pricing and link-delivered products.
--
-- Adds two capabilities to the store:
--   1. A product can be delivered as an access link (a web app) instead of a
--      file in the private bucket.
--   2. A product can have a launch price for its first N buyers, after which
--      the regular price applies.
--
-- All price decisions go through store_offers(), which both the storefront and
-- paystack-initialize read. The price a visitor is shown and the price they are
-- charged therefore come from the same query and cannot drift apart.

-- ---------------------------------------------------------------------------
-- Products: delivery and launch tier
-- ---------------------------------------------------------------------------
ALTER TABLE products ALTER COLUMN storage_path DROP NOT NULL;

ALTER TABLE products
  ADD COLUMN access_url text,
  ADD COLUMN launch_price_cents integer CHECK (launch_price_cents > 0),
  ADD COLUMN launch_quantity integer CHECK (launch_quantity > 0);

-- Every product is delivered exactly one way.
ALTER TABLE products
  ADD CONSTRAINT products_one_delivery_method
  CHECK ((storage_path IS NOT NULL) <> (access_url IS NOT NULL));

-- A launch tier needs both a price and a quantity, or neither.
ALTER TABLE products
  ADD CONSTRAINT products_launch_tier_complete
  CHECK ((launch_price_cents IS NULL) = (launch_quantity IS NULL));

-- ---------------------------------------------------------------------------
-- Orders: which tier the quoted price came from
-- ---------------------------------------------------------------------------
ALTER TABLE orders
  ADD COLUMN price_tier text NOT NULL DEFAULT 'regular'
  CHECK (price_tier IN ('launch', 'regular'));

-- ---------------------------------------------------------------------------
-- store_offers(): the current offer for every active product
-- ---------------------------------------------------------------------------
--
-- Launch spots are counted from PAID orders only. Counting pending checkouts as
-- well would stop the launch tier being oversold under simultaneous checkouts,
-- but it would let anyone hold all the spots by repeatedly starting checkouts
-- they never finish. Overselling by a buyer or two in a race is the far smaller
-- risk, and every buyer still pays exactly the amount they were quoted.
--
-- SECURITY DEFINER lets anonymous visitors see sales counts without any read
-- access to the orders table itself; only aggregates leave this function.
CREATE OR REPLACE FUNCTION public.store_offers()
RETURNS TABLE (
  product_id uuid,
  slug text,
  title text,
  currency text,
  delivery text,
  price_cents integer,
  price_tier text,
  regular_price_cents integer,
  launch_price_cents integer,
  launch_quantity integer,
  launch_remaining integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH launch_sold AS (
    SELECT o.product_id AS pid, count(*)::integer AS sold
    FROM orders o
    WHERE o.status = 'paid' AND o.price_tier = 'launch'
    GROUP BY o.product_id
  ),
  priced AS (
    SELECT
      p.id AS pid,
      p.slug AS p_slug,
      p.title AS p_title,
      p.currency AS p_currency,
      p.access_url AS p_access_url,
      p.price_cents AS p_price,
      p.launch_price_cents AS p_launch_price,
      p.launch_quantity AS p_launch_qty,
      p.launch_price_cents IS NOT NULL
        AND coalesce(ls.sold, 0) < p.launch_quantity AS in_launch,
      CASE
        WHEN p.launch_price_cents IS NULL THEN NULL
        ELSE greatest(p.launch_quantity - coalesce(ls.sold, 0), 0)
      END AS remaining
    FROM products p
    LEFT JOIN launch_sold ls ON ls.pid = p.id
    WHERE p.active
  )
  SELECT
    pr.pid,
    pr.p_slug,
    pr.p_title,
    pr.p_currency,
    CASE WHEN pr.p_access_url IS NOT NULL THEN 'access' ELSE 'download' END,
    CASE WHEN pr.in_launch THEN pr.p_launch_price ELSE pr.p_price END,
    CASE WHEN pr.in_launch THEN 'launch' ELSE 'regular' END,
    pr.p_price,
    pr.p_launch_price,
    pr.p_launch_qty,
    pr.remaining
  FROM priced pr;
$$;

REVOKE ALL ON FUNCTION public.store_offers() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.store_offers() TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Redline Portfolio Grader
--
-- INACTIVE ON PURPOSE. As of this migration the deployed app does not work
-- (its app.js 404s) and its scoring is Math.random(). Activate only once the
-- grader genuinely analyses the URL it is given:
--
--   UPDATE products SET active = true WHERE slug = 'redline-portfolio-grader';
--
-- price_cents = 0 means the post-launch regular price has not been decided, so
-- once the 50 launch spots are sold the product shows as sold out rather than
-- charging a price nobody chose. Set it when you know it, e.g. R499:
--
--   UPDATE products SET price_cents = 49900 WHERE slug = 'redline-portfolio-grader';
-- ---------------------------------------------------------------------------
INSERT INTO products (
  slug, title, description, price_cents, currency,
  storage_path, access_url, launch_price_cents, launch_quantity, active
) VALUES (
  'redline-portfolio-grader',
  'Redline Portfolio Grader',
  'An interactive workbook that grades your portfolio the way a hiring manager does: first impression, proof, clarity, craft.',
  0, 'ZAR',
  NULL, 'https://portfolio-analyzer-lemon.vercel.app/', 29900, 50,
  false
)
ON CONFLICT (slug) DO NOTHING;
