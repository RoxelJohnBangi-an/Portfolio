import { createClient } from '@supabase/supabase-js';

const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

export { publicAnonKey };
export const API_URL = `${supabaseUrl}/functions/v1/make-server-931ae6ba`;
