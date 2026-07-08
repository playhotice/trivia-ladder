# Trivia Ladder v3 — Clean Mobile Flow

Updated from the latest design notes:

- Simple home screen: “Today’s Board Is Live,” choose Ian or Shannon, Start Today’s Round.
- Game screen only shows the current clue, answers, and a 30-second timer.
- Player selects an answer, then taps Submit.
- Feedback screen shows Correct/Incorrect, explanation, amount won, and Next Clue.
- Keeps Final Ladder, leaderboard, W-D-L record, current streak, weekly wins, lifetime bank, and score-code sharing for separate phones.

Open `index.html` locally or upload these files to GitHub Pages.


## New in v4

- The ladder now gets progressively harder by dollar value:
  - Q1 / $100 = Easy
  - Q2 / $200 = Easy-Medium
  - Q3 / $300 = Medium
  - Q4 / $400 = Hard
  - Q5 / $500 = Hardest
- Categories are randomized daily inside each difficulty tier.
- The daily picker tries to avoid duplicate categories on the same board when possible.
- The final question is also randomized daily.
