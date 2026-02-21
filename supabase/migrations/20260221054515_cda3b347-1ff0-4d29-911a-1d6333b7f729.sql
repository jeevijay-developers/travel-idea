
-- Update is_staff function to include enquiry_handler
CREATE OR REPLACE FUNCTION public.is_staff()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'blog_editor', 'visa_manager', 'enquiry_handler')
  )
$$;

-- Create helper function for enquiry_handler check
CREATE OR REPLACE FUNCTION public.is_enquiry_handler()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'enquiry_handler'
  )
$$;

-- Allow enquiry_handlers to SELECT enquiries
CREATE POLICY "Enquiry handlers can view enquiries"
ON public.enquiries
FOR SELECT
USING (public.is_enquiry_handler());

-- Allow enquiry_handlers to UPDATE enquiries (status only enforced in app)
CREATE POLICY "Enquiry handlers can update enquiries"
ON public.enquiries
FOR UPDATE
USING (public.is_enquiry_handler())
WITH CHECK (public.is_enquiry_handler());
