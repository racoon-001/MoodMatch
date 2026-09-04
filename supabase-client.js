const SUPABASE_URL = "https://yuniytnkjxazyibezith.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_EUu8d7kbtJWBQHyYZM3i0Q_MRujqL7n";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
console.log("✅ MoodMatch Supabase client initialized");