-- Create site_settings table for contact details and other settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings
CREATE POLICY "Settings are publicly readable" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only admins can manage settings
CREATE POLICY "Only admins can manage settings" 
ON public.site_settings 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default contact settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('contact', '{
  "phone": "+91 9101197909",
  "email": "b2b@travelidea.in",
  "whatsapp": "919101197909",
  "head_office": {
    "name": "Head Office - Tezpur",
    "address": "Ground Floor, G-Square Mall, Tezpur Main Rd, Tezpur, Assam 784001"
  },
  "branch_office": {
    "name": "Branch Office - Kolkata",
    "address": "PS Arcadia, 9th Floor, 4A Camac Street, Kolkata 700016"
  },
  "business_hours": "Mon - Sat: 9AM - 7PM"
}'::jsonb),
('social', '{
  "facebook": "",
  "twitter": "",
  "instagram": "",
  "linkedin": "",
  "youtube": ""
}'::jsonb);