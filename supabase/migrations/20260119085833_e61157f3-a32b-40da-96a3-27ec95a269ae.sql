-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create countries table
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  flag_url TEXT,
  region TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visas table
CREATE TABLE public.visas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  visa_type TEXT NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  additional_fees TEXT,
  processing_days INTEGER NOT NULL DEFAULT 7,
  validity TEXT,
  required_documents TEXT[],
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_fast BOOLEAN NOT NULL DEFAULT false,
  issued_recently INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  author TEXT DEFAULT 'Travel Idea Team',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enquiries table
CREATE TABLE public.enquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  destination TEXT,
  visa_id UUID REFERENCES public.visas(id) ON DELETE SET NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_settings table for simple password protection
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories, countries, visas (published), blog_posts (published)
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Countries are publicly readable" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Visas are publicly readable" ON public.visas FOR SELECT USING (true);
CREATE POLICY "Published blog posts are publicly readable" ON public.blog_posts FOR SELECT USING (is_published = true);

-- Public can insert enquiries
CREATE POLICY "Anyone can create enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Admin full access policies (using service role in edge functions)
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access countries" ON public.countries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access visas" ON public.visas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access enquiries" ON public.enquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin settings accessible" ON public.admin_settings FOR ALL USING (true) WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON public.countries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visas_updated_at BEFORE UPDATE ON public.visas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_enquiries_updated_at BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON public.admin_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin password (travelidea2024)
INSERT INTO public.admin_settings (setting_key, setting_value) VALUES ('admin_password', 'travelidea2024');

-- Insert sample categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Tourist', 'tourist', 'Standard tourist visas for leisure travel'),
  ('Business', 'business', 'Business and work-related visas'),
  ('Transit', 'transit', 'Short-term transit visas'),
  ('Student', 'student', 'Educational and student visas'),
  ('Medical', 'medical', 'Medical treatment visas');

-- Insert sample countries
INSERT INTO public.countries (name, slug, code, region) VALUES
  ('United Arab Emirates', 'uae', 'AE', 'Middle East'),
  ('United States of America', 'usa', 'US', 'North America'),
  ('Japan', 'japan', 'JP', 'Asia'),
  ('Singapore', 'singapore', 'SG', 'Asia'),
  ('Thailand', 'thailand', 'TH', 'Asia'),
  ('Malaysia', 'malaysia', 'MY', 'Asia'),
  ('Vietnam', 'vietnam', 'VN', 'Asia'),
  ('United Kingdom', 'uk', 'GB', 'Europe'),
  ('South Korea', 'south-korea', 'KR', 'Asia'),
  ('Australia', 'australia', 'AU', 'Oceania');

-- Insert sample visas
INSERT INTO public.visas (country_id, category_id, visa_type, title, short_description, price, additional_fees, processing_days, validity, required_documents, is_featured, is_fast, issued_recently)
SELECT 
  c.id,
  cat.id,
  'eVisa',
  c.name || ' Tourist Visa',
  'Tourist visa for ' || c.name,
  CASE 
    WHEN c.slug = 'uae' THEN 7399
    WHEN c.slug = 'usa' THEN 17020
    WHEN c.slug = 'japan' THEN 2000
    WHEN c.slug = 'singapore' THEN 4500
    WHEN c.slug = 'thailand' THEN 2500
    WHEN c.slug = 'malaysia' THEN 1800
    WHEN c.slug = 'vietnam' THEN 2000
    WHEN c.slug = 'uk' THEN 12500
    WHEN c.slug = 'south-korea' THEN 3400
    WHEN c.slug = 'australia' THEN 8500
    ELSE 5000
  END,
  CASE 
    WHEN c.slug IN ('usa', 'south-korea', 'japan') THEN '₹2999 (Fees+Tax)'
    ELSE NULL
  END,
  CASE 
    WHEN c.slug IN ('uae', 'singapore', 'thailand') THEN 5
    WHEN c.slug IN ('malaysia', 'vietnam') THEN 3
    WHEN c.slug = 'japan' THEN 12
    WHEN c.slug = 'south-korea' THEN 15
    WHEN c.slug = 'uk' THEN 21
    WHEN c.slug = 'australia' THEN 30
    WHEN c.slug = 'usa' THEN 270
    ELSE 14
  END,
  '30-90 days',
  ARRAY['Valid Passport', 'Passport-size Photos', 'Travel Itinerary', 'Proof of Accommodation'],
  true,
  CASE WHEN c.slug IN ('uae', 'singapore', 'thailand', 'malaysia', 'vietnam', 'japan') THEN true ELSE false END,
  CASE 
    WHEN c.slug = 'uae' THEN 1954
    WHEN c.slug = 'thailand' THEN 1245
    WHEN c.slug = 'singapore' THEN 892
    WHEN c.slug = 'malaysia' THEN 567
    WHEN c.slug = 'vietnam' THEN 423
    WHEN c.slug = 'south-korea' THEN 338
    WHEN c.slug = 'japan' THEN 320
    WHEN c.slug = 'uk' THEN 156
    WHEN c.slug = 'australia' THEN 89
    WHEN c.slug = 'usa' THEN 2
    ELSE 100
  END
FROM public.countries c
CROSS JOIN (SELECT id FROM public.categories WHERE slug = 'tourist' LIMIT 1) cat;

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, category, is_published, published_at) VALUES
  ('Top 10 Tips for First-Time Visa Applicants', 'top-10-tips-first-time-visa', 'Essential tips to ensure your first visa application is successful.', 'Full content here...', 'Visa Tips', true, now()),
  ('Best Countries to Visit in 2024', 'best-countries-visit-2024', 'Discover the most popular travel destinations for this year.', 'Full content here...', 'Destinations', true, now()),
  ('Understanding Schengen Visa Requirements', 'understanding-schengen-visa', 'Everything you need to know about applying for a Schengen visa.', 'Full content here...', 'Visa Tips', true, now());