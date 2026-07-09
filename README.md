# Trivia Ladder v8 — Supabase Shared Leaderboard

This version uses Supabase instead of Firebase, so it can work more like your Hot Ice setup.

## What this version does

- Ian and Shannon can play on separate phones.
- Scores save to one shared Supabase table.
- Leaderboard pulls from Supabase.
- Realtime updates can work if Realtime is enabled for the table.
- If Supabase is not configured yet, the app still runs in local mode.

## Files to upload to GitHub

Upload all of these to your `trivia-ladder` repo:

- `index.html`
- `style.css`
- `app.js`
- `supabase-config.js`
- `supabase-schema.sql`
- `README.md`

You no longer need:

- `firebase-config.js`
- `database-rules.json`

## Supabase setup

### 1. Create or open your Supabase project

Use the same Supabase account/project style you used for Hot Ice, or create a new project for Trivia Ladder.

### 2. Run the SQL

Open Supabase > SQL Editor.

Paste everything from:

`supabase-schema.sql`

Run it.

### 3. Copy your Supabase keys

Go to Supabase > Project Settings > API.

Copy:

- Project URL
- anon/public key

### 4. Update `supabase-config.js`

Change:

```js
export const USE_SUPABASE = false;
```

to:

```js
export const USE_SUPABASE = true;
```

Then paste:

```js
export const supabaseUrl = "YOUR_PROJECT_URL";
export const supabaseAnonKey = "YOUR_ANON_PUBLIC_KEY";
```

### 5. Upload to GitHub Pages

Commit the updated files.

When the live site reloads, the home screen should show:

`Shared leaderboard live`

## Security note

The included Row Level Security policies are simple prototype policies for a two-player personal game. They restrict rows to the `ian-shannon` room and player IDs `ian` / `shannon`, but they are not production-level authentication.


## New in v9

- Removed the `Reset Today` button from the results screen.
- Removed the `Clear All Scores` button from the leaderboard screen.
- Ian and Shannon are now locked to one saved result per day from the app UI.
