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


## New in v5

- Removed the score-code sharing/import boxes from the results and leaderboard screens.
- Tightened the mobile question layout so it fits the visible phone screen better.
- Reduced question text size, answer button height, gaps, and header spacing on small screens.
- Added dynamic viewport sizing with `100dvh` for mobile Safari/Chrome.


## New in v6

- Updated the ladder to match the requested difficulty curve:
  - Q1 / $100 = Easy
  - Q2 / $200 = Medium
  - Q3 / $300 = Hard
  - Q4 / $400 = Harder
  - Q5 / $500 = Very Hard
- Replaced easier questions with a tougher trivia bank.
- Categories still rotate randomly each day inside the correct difficulty tier.
