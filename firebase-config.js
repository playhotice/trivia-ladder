// Trivia Ladder Firebase config
// 1. Create a Firebase project.
// 2. Add a Web App.
// 3. Create a Realtime Database.
// 4. Paste your Firebase config below.
// 5. Change USE_FIREBASE from false to true.

export const USE_FIREBASE = false;

// Keep this simple and private-ish. It is just the room/path name in your database.
// You can change it to something like "ian-shannon-trivia-2026".
export const APP_ROOM_ID = "ian-shannon";

export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY_HERE",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://PASTE_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "PASTE_PROJECT_ID",
  storageBucket: "PASTE_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_SENDER_ID",
  appId: "PASTE_APP_ID"
};
