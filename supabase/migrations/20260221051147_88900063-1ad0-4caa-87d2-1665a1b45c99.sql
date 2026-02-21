ALTER TABLE public.enquiries
ADD COLUMN travel_date date,
ADD COLUMN travelers integer DEFAULT 1;