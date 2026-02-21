
-- Add enquiry_handler to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'enquiry_handler';
