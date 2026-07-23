import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abkleazbtylzrqbvzaxb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFia2xlYXpidHlsenJxYnZ6YXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3Njg2OTgsImV4cCI6MjEwMDM0NDY5OH0.Yf9RPHITVE04z-ESdDFlsvqQKGDH9-Km0SGMpshnUWI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
