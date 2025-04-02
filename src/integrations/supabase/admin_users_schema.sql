
-- Create admin_users table to track which users have admin privileges
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id)
);

-- Add RLS policy to admin_users table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read the admin_users table
CREATE POLICY "Admins can read admin_users"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()
  ));

-- IMPORTANT: Run the following INSERT manually to add your first admin user
-- after you have signed up:
-- INSERT INTO public.admin_users (user_id) VALUES ('YOUR-USER-ID-HERE');
