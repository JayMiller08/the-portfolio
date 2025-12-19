-- Create artifacts table
CREATE TABLE IF NOT EXISTS public.artifacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT NOT NULL, -- 'PDF', 'Video', 'Link', 'Figma'
    file_url TEXT NOT NULL,
    tag TEXT, -- Added tag to match frontend interface
    download_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on artifacts
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;

-- Artifacts Policies
-- Allow public read access
CREATE POLICY "Allow public read access" ON public.artifacts
    FOR SELECT
    USING (true);

-- Allow authenticated (admin) insert/update/delete
-- Note: In a real scenario, you'd check for a specific role. 
-- For this portfolio, we'll assume authenticated users are admins or we'll leave it open for now if auth isn't fully set up, 
-- BUT the prompt asks for "Admin (authenticated user)".
CREATE POLICY "Allow admin full access" ON public.artifacts
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');


-- Subscribers Table (Ensure it exists and has correct policies)
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Subscribers Policies
-- Allow public insert
CREATE POLICY "Allow public insert" ON public.subscribers
    FOR INSERT
    WITH CHECK (true);

-- Allow admin select only
CREATE POLICY "Allow admin select" ON public.subscribers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Seed some initial data for artifacts if empty
INSERT INTO public.artifacts (title, description, resource_type, file_url, tag)
SELECT 'Java Mastery Cheatsheet', 'A comprehensive quick-reference guide covering Java fundamentals, OOP concepts, data structures, and common patterns.', 'pdf', '/resources/java-cheatsheet.pdf', 'Java'
WHERE NOT EXISTS (SELECT 1 FROM public.artifacts WHERE title = 'Java Mastery Cheatsheet');

INSERT INTO public.artifacts (title, description, resource_type, file_url, tag)
SELECT 'Portfolio UI Kit', 'My custom Figma design system with reusable components, color tokens, and layouts.', 'figma', 'https://figma.com/community', 'Design'
WHERE NOT EXISTS (SELECT 1 FROM public.artifacts WHERE title = 'Portfolio UI Kit');

INSERT INTO public.artifacts (title, description, resource_type, file_url, tag)
SELECT '2025 Developer Roadmap', 'Watch my breakdown of the skills, tools, and technologies you need to master in 2025.', 'video', 'https://www.tiktok.com/@realjaycoding', 'Career'
WHERE NOT EXISTS (SELECT 1 FROM public.artifacts WHERE title = '2025 Developer Roadmap');

INSERT INTO public.artifacts (title, description, resource_type, file_url, tag)
SELECT 'React Hooks Deep Dive', 'A detailed guide explaining useState, useEffect, useContext, and custom hooks.', 'pdf', '/resources/react-hooks-guide.pdf', 'React'
WHERE NOT EXISTS (SELECT 1 FROM public.artifacts WHERE title = 'React Hooks Deep Dive');
