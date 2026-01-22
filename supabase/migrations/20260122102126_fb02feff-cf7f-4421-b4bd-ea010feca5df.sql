-- Add new roles to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'blog_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'visa_manager';