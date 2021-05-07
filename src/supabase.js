import { createClient } from '@supabase/supabase-js'

const createSupabaseClient = () => {
  const url = process.env.VUE_APP_SUPABASE_URL
  const key = process.env.VUE_APP_SUPABASE_KEY
  return createClient(url, key);
}

export default createSupabaseClient;