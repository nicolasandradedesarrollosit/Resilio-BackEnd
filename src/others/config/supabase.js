import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.URL_DB,
  process.env.SERVICE_KEY
);

export default supabase;