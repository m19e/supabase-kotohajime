import { createClient } from "@supabase/supabase-js"

export const SUPABASE_URL = process.env.NEXT_LOCAL_SUPABASE_URL!
export const SUPABASE_ANON_KEY = process.env.NEXT_LOCAL_SUPABASE_ANON_KEY!

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
