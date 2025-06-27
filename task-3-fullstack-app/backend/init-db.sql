-- ================================
-- Property Management Database Setup
-- ================================
-- Run this script in your Supabase SQL Editor
-- Go to: https://supabase.com/dashboard -> Your Project -> SQL Editor
-- Copy and paste this entire script, then click "Run"

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS public.properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  size DECIMAL(10,2) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  handover_date DATE NOT NULL,
  project_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample projects
INSERT INTO public.projects (id, name) VALUES
  ('proj_1', 'Downtown Towers'),
  ('proj_2', 'Marina Residences'),
  ('proj_3', 'Garden View Apartments'),
  ('proj_4', 'Skyline Complex')
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties
INSERT INTO public.properties (title, size, price, handover_date, project_id) VALUES
  ('Luxury Beachfront Villa', 3500, 1250000, '2025-08-15', 'proj_2'),
  ('Modern City Apartment', 1200, 650000, '2025-07-20', 'proj_1'),
  ('Garden View Penthouse', 2800, 950000, '2025-09-10', 'proj_3'),
  ('Skyline Studio', 850, 420000, '2025-06-30', 'proj_4'),
  ('Waterfront Condo', 1800, 780000, '2025-10-05', 'proj_2')
ON CONFLICT DO NOTHING;

-- Enable RLS (Row Level Security) if needed
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (if using anon key)
-- CREATE POLICY "Allow anonymous access" ON public.projects FOR ALL USING (true);
-- CREATE POLICY "Allow anonymous access" ON public.properties FOR ALL USING (true);

-- Verify tables were created
SELECT 'Projects table created' as message, count(*) as project_count FROM public.projects;
SELECT 'Properties table created' as message, count(*) as property_count FROM public.properties;