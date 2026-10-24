import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For reading public data (approved names, etc.) — anon key is sufficient since RLS allows it
export function createServerSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// For admin operations that need to bypass RLS
export function createAdminSupabase() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey;
  return createClient(supabaseUrl, secret);
}
