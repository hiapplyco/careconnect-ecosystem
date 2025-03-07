
import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error('Missing environment variable VITE_SUPABASE_URL');
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing environment variable VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  'https://upbnysrcdcpumjyjhysy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYm55c3JjZGNwdW1qeWpoeXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzk2NTMsImV4cCI6MjA1Njk1NTY1M30.azZU9tUlojBLAUqxMs-54uUCdfsfksabJXMCO9j1QBw'
);
