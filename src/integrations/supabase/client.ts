// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fplfktjfmevzxnvlqmam.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwbGZrdGpmbWV2enhudmxxbWFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyOTAxOTUsImV4cCI6MjA2Nzg2NjE5NX0.mC3H6JQw6M3ZBGcqdH2p5uIHUHPpArAziS8i4tc6JYQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});