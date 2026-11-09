-- WhatsApp numbers collected in exchange for free resources.
--
-- One row per (number, resource): the same person downloading two resources is
-- two rows, and downloading the same one twice is not a duplicate.
--
-- POPIA (s69) requires opt-in consent before anyone is sent direct marketing
-- over electronic communication, which includes WhatsApp. The form requires an
-- explicit consent tick, and consented_at records when it was given, so there
-- is evidence of consent for every number on this list.

CREATE TABLE whatsapp_leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  -- E.164 format, e.g. +27712345678. The site normalises local formats such as
  -- "071 234 5678" before inserting, so every row is directly usable.
  phone text NOT NULL CHECK (phone ~ '^\+[1-9][0-9]{7,14}$'),
  resource_slug text NOT NULL CHECK (length(resource_slug) BETWEEN 1 AND 100),
  -- Where the number was given: the homepage popup or the Resources page.
  source text NOT NULL DEFAULT 'resources' CHECK (source IN ('homepage_popup', 'resources')),
  consented_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (phone, resource_slug)
);

CREATE INDEX whatsapp_leads_created_at_idx ON whatsapp_leads (created_at DESC);

ALTER TABLE whatsapp_leads ENABLE ROW LEVEL SECURITY;

-- Anyone may add their own number. There is deliberately no SELECT, UPDATE or
-- DELETE policy for the public: the list can only be read through the Supabase
-- dashboard or the service role, never from the browser.
CREATE POLICY "Anyone can leave their number" ON whatsapp_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (consented_at IS NOT NULL);
