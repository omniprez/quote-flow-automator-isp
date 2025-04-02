
# MCS Quote Automator - Admin Setup

To set up your first admin user, follow these steps after running the application:

1. Sign up for an account through the login page
2. After signing up, you'll need to add your user to the admin_users table
3. Run the following SQL query in your Supabase SQL editor:

```sql
INSERT INTO public.admin_users (user_id) VALUES ('YOUR-USER-ID-HERE');
```

Replace 'YOUR-USER-ID-HERE' with your actual Supabase user ID. You can find this in the Supabase dashboard under Authentication > Users.

After adding yourself as an admin, log out and log back in, and you'll see the "Manage Services & Pricing" button on the dashboard.

## Table Schema

The admin_users table has the following structure:

```sql
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (user_id)
);
```

This table uses Row Level Security to ensure that only admin users can view the admin list.
