import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xagjbayxieodaodsalir.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhZ2piYXl4aWVvZGFvZHNhbGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODQ2MTgsImV4cCI6MjEwNDE2MDYxOH0.DZTVDUNYtUV4lQkkOpn5PxZ5y3fDEu5BGLK0C2bSqUI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
