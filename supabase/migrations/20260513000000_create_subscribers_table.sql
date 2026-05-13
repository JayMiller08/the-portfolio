-- Create the subscribers table
CREATE TABLE subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  source text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) to secure your database
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their email via your public frontend (the popup)
CREATE POLICY "Allow public inserts" ON subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only allow authenticated users to read the emails
CREATE POLICY "Allow authenticated reads" ON subscribers
  FOR SELECT
  TO authenticated
  USING (true);
