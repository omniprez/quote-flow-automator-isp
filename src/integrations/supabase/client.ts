
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const SUPABASE_URL = "https://ccuqqikylhsakqgtlnzq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdXFxaWt5bGhzYWtxZ3RsbnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzM2OTEsImV4cCI6MjA1OTEwOTY5MX0.tvRthp3pq5Km91b7Jh7544cPwKbBedDUCknMfoDedTM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
