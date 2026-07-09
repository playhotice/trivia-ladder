// Trivia Ladder Supabase config
// 1. Create a Supabase project.
// 2. Run the SQL from `supabase-schema.sql`.
// 3. In Supabase, go to Project Settings > API.
// 4. Paste your Project URL and anon/public key below.
// 5. Change USE_SUPABASE from false to true.

export const USE_SUPABASE = false;

// This keeps your game in its own shared room.
// Keep this the same on both phones.
export const APP_ROOM_ID = "ian-shannon";

export const supabaseUrl = "PASTE_SUPABASE_PROJECT_URL_HERE";
export const supabaseAnonKey = "PASTE_SUPABASE_ANON_PUBLIC_KEY_HERE";
