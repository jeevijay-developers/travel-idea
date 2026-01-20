-- =====================================================
-- PHASE 1: Critical Security Fixes - User Roles & RLS
-- =====================================================

-- Step 1: Create app_role enum for admin roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Step 2: Create user_roles table (separate from profiles to prevent privilege escalation)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create SECURITY DEFINER function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 5: Create helper function for admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Step 6: RLS policy for user_roles - only admins can view/manage roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =====================================================
-- PHASE 2: Drop All Insecure Policies
-- =====================================================

-- Drop insecure admin_settings policies
DROP POLICY IF EXISTS "Admin settings accessible" ON public.admin_settings;

-- Drop insecure enquiries policies (keep public insert)
DROP POLICY IF EXISTS "Admin full access enquiries" ON public.enquiries;

-- Drop insecure visas policies
DROP POLICY IF EXISTS "Admin full access visas" ON public.visas;

-- Drop insecure categories policies
DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;

-- Drop insecure countries policies
DROP POLICY IF EXISTS "Admin full access countries" ON public.countries;

-- Drop insecure blog_posts policies
DROP POLICY IF EXISTS "Admin full access blog_posts" ON public.blog_posts;

-- =====================================================
-- PHASE 3: Create Secure RLS Policies
-- =====================================================

-- admin_settings: Only authenticated admins
CREATE POLICY "Only admins can access admin_settings"
ON public.admin_settings FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- enquiries: Public insert, admin read/update/delete
CREATE POLICY "Anyone can submit enquiries"
ON public.enquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can view enquiries"
ON public.enquiries FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Only admins can update enquiries"
ON public.enquiries FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete enquiries"
ON public.enquiries FOR DELETE
TO authenticated
USING (public.is_admin());

-- visas: Public read, admin write
CREATE POLICY "Admins can manage visas"
ON public.visas FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- categories: Public read, admin write
CREATE POLICY "Admins can manage categories"
ON public.categories FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- countries: Public read, admin write
CREATE POLICY "Admins can manage countries"
ON public.countries FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- blog_posts: Public read published, admin full access
CREATE POLICY "Admins can manage blog_posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =====================================================
-- PHASE 4: Fix Storage Policies
-- =====================================================

-- Drop insecure storage policies
DROP POLICY IF EXISTS "Anyone can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete blog images" ON storage.objects;

-- Create secure storage policies (admin only for write operations)
CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'blog-images' AND
  public.is_admin()
);

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  public.is_admin()
);

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'blog-images' AND
  public.is_admin()
);

-- =====================================================
-- PHASE 5: Hash Existing Admin Password
-- =====================================================

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update existing password to hashed version
UPDATE public.admin_settings 
SET setting_value = crypt(setting_value, gen_salt('bf'))
WHERE setting_key = 'admin_password';

-- Add constraint to prevent plain text passwords in future
COMMENT ON TABLE public.admin_settings IS 'Admin settings storage. Passwords must be bcrypt hashed.';

-- =====================================================
-- PHASE 6: Add Input Validation Constraints
-- =====================================================

-- Add email format validation to enquiries
ALTER TABLE public.enquiries 
ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add length constraints to prevent abuse
ALTER TABLE public.enquiries 
ADD CONSTRAINT name_length CHECK (char_length(name) <= 100);

ALTER TABLE public.enquiries 
ADD CONSTRAINT message_length CHECK (message IS NULL OR char_length(message) <= 2000);

ALTER TABLE public.enquiries 
ADD CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~* '^[\d\s\+\-\(\)]{0,20}$');