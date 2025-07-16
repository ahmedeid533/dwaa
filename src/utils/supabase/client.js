import { createClient } from '@supabase/supabase-js';

// 1. Get the Supabase URL and Anon Key from environment variables.
//    These are read from your .env.local file.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. Create the Supabase client.
//    This object is the main interface for interacting with Supabase.
//    It's configured with your specific project URL and the public anon key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
