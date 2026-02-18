import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://sccsglbwuosbvznysmxa.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjY3NnbGJ3dW9zYnZ6bnlzbXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5OTY5MjQsImV4cCI6MjA4NjU3MjkyNH0.F3lKL1BfAXxH3kv0BBmlnIx8FD1kfYeQ9PGDSJrf2rY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});