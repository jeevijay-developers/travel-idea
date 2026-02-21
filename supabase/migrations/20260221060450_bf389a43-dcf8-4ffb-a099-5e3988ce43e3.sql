
-- Add assigned_to column to enquiries
ALTER TABLE public.enquiries ADD COLUMN assigned_to uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_enquiries_assigned_to ON public.enquiries(assigned_to);

-- Drop old enquiry handler policies and recreate so they only see assigned enquiries
DROP POLICY IF EXISTS "Enquiry handlers can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Enquiry handlers can update enquiries" ON public.enquiries;

-- Enquiry handlers can only view enquiries assigned to them
CREATE POLICY "Enquiry handlers can view assigned enquiries"
ON public.enquiries
FOR SELECT
USING (
  public.has_role(auth.uid(), 'enquiry_handler') AND assigned_to = auth.uid()
);

-- Enquiry handlers can only update enquiries assigned to them
CREATE POLICY "Enquiry handlers can update assigned enquiries"
ON public.enquiries
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'enquiry_handler') AND assigned_to = auth.uid()
)
WITH CHECK (
  public.has_role(auth.uid(), 'enquiry_handler') AND assigned_to = auth.uid()
);
