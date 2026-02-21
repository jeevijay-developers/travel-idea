
-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  location TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  destination TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a review
CREATE POLICY "Anyone can submit reviews"
ON public.reviews FOR INSERT
WITH CHECK (true);

-- Only approved reviews are publicly visible
CREATE POLICY "Approved reviews are publicly readable"
ON public.reviews FOR SELECT
USING (is_approved = true);

-- Admins can view all reviews
CREATE POLICY "Admins can view all reviews"
ON public.reviews FOR SELECT
USING (is_admin());

-- Admins can update reviews (approve/reject)
CREATE POLICY "Admins can update reviews"
ON public.reviews FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Admins can delete reviews
CREATE POLICY "Admins can delete reviews"
ON public.reviews FOR DELETE
USING (is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
