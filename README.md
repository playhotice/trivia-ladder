# Trivia Ladder v7 — Firebase Shared Leaderboard

This version adds shared online score syncing with Firebase Realtime Database.

## What changed

- Ian and Shannon can play on separate phones.
- Scores save to one shared Firebase leaderboard.
- Leaderboard updates across devices.
- LocalStorage still works as a fallback if Firebase is not configured.
- Removed score-code sharing/import boxes.

## Files

- `index.html`
- `style.css`
- `app.js`
- `firebase-config.js`
- `database-rules.json`

## Setup steps

### 1. Create Firebase project

Go to Firebase Console and create a project.

### 2. Add a Web App

In the Firebase project overview, click the Web icon and register a web app. Firebase will give you a `firebaseConfig` object.

### 3. Create Realtime Database

In Firebase, create a Realtime Database.

### 4. Set temporary rules

For the first personal version, paste the rules from `database-rules.json`.

Important: these are simple prototype rules for a personal two-player game. They are not production security rules.

### 5. Paste Firebase config

Open `firebase-config.js`.

Change:

```js
export const USE_FIREBASE = false;
```

to:

```js
export const USE_FIREBASE = true;
```

Then paste your Firebase config into the `firebaseConfig` object.

### 6. Upload to GitHub Pages

Upload all files to your `trivia-ladder` GitHub repo:

- `index.html`
- `style.css`
- `app.js`
- `firebase-config.js`
- `database-rules.json`
- `README.md`

Once GitHub Pages rebuilds, open the site on both phones.

## Expected behavior

Home screen should show:

- Green dot: shared leaderboard live

Then Ian can play on one phone and Shannon can play on another phone. Both results should appear in the same leaderboard.
