import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key';

// True only when real credentials are provided
export const hasSupabaseCredentials =
  !!import.meta.env.VITE_SUPABASE_URL &&
  !!import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

if (!hasSupabaseCredentials) {
  console.warn('Supabase credentials missing! Running in offline/fallback mode.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
