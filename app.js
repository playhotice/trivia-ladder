import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { USE_SUPABASE, APP_ROOM_ID, supabaseUrl, supabaseAnonKey } from "./supabase-config.js";

const STORAGE_KEYS = {
  players: "triviaLadder.players.v8",
  activePlayer: "triviaLadder.activePlayer.v8",
  results: "triviaLadder.results.v8",
};

const QUESTION_VALUES = [100, 200, 300, 400, 500];
const QUESTION_SECONDS = 30;
const FINAL_SECONDS = 45;
const DEFAULT_PLAYERS = [
  { id: "ian", name: "Ian" },
  { id: "shannon", name: "Shannon" },
];

const QUESTION_BANK = {
  100: [
    { id: "100-geography-andes", category: "Geography", difficulty: "Easy", question: "The Andes Mountains are primarily found on which continent?", options: ["Europe", "South America", "Africa", "Asia"], answerIndex: 1, explanation: "The Andes run along the western side of South America." },
    { id: "100-science-water", category: "Science", difficulty: "Easy", question: "What is the chemical formula for water?", options: ["CO2", "H2O", "NaCl", "O2"], answerIndex: 1, explanation: "Water is made of two hydrogen atoms and one oxygen atom, written as H2O." },
    { id: "100-history-egypt", category: "History", difficulty: "Easy", question: "The ancient pyramids of Giza are located in which country?", options: ["Greece", "Egypt", "Turkey", "Morocco"], answerIndex: 1, explanation: "The pyramids of Giza are located near Cairo, Egypt." },
    { id: "100-books-hobbit", category: "Books", difficulty: "Easy", question: "Bilbo Baggins is the main character in which novel?", options: ["The Hobbit", "Dune", "The Lightning Thief", "The Giver"], answerIndex: 0, explanation: "Bilbo Baggins is the main character of The Hobbit." },
    { id: "100-sports-wimbledon", category: "Sports", difficulty: "Easy", question: "Wimbledon is a major tournament in which sport?", options: ["Golf", "Tennis", "Cricket", "Soccer"], answerIndex: 1, explanation: "Wimbledon is one of tennis’s four Grand Slam tournaments." },
    { id: "100-bible-moses", category: "Bible", difficulty: "Easy", question: "Who led the Israelites out of Egypt in the book of Exodus?", options: ["David", "Moses", "Paul", "Solomon"], answerIndex: 1, explanation: "Moses leads the Israelites out of Egypt in Exodus." },
  ],
  200: [
    { id: "200-geography-madagascar", category: "Geography", difficulty: "Medium", question: "Madagascar lies off the southeastern coast of which continent?", options: ["Asia", "Africa", "Australia", "South America"], answerIndex: 1, explanation: "Madagascar is an island country off the southeastern coast of Africa." },
    { id: "200-science-carbon", category: "Science", difficulty: "Medium", question: "Which element has the atomic number 6?", options: ["Oxygen", "Carbon", "Nitrogen", "Helium"], answerIndex: 1, explanation: "Carbon has atomic number 6 on the periodic table." },
    { id: "200-history-constantinople", category: "History", difficulty: "Medium", question: "Constantinople is now known as which city?", options: ["Athens", "Istanbul", "Rome", "Cairo"], answerIndex: 1, explanation: "Constantinople became known as Istanbul." },
    { id: "200-literature-atticus", category: "Literature", difficulty: "Medium", question: "Atticus Finch is a central character in which novel?", options: ["The Great Gatsby", "To Kill a Mockingbird", "Of Mice and Men", "Fahrenheit 451"], answerIndex: 1, explanation: "Atticus Finch is a central character in To Kill a Mockingbird." },
    { id: "200-sports-tour", category: "Sports", difficulty: "Medium", question: "The yellow jersey is associated with the leader of which race?", options: ["Tour de France", "Boston Marathon", "Kentucky Derby", "Indianapolis 500"], answerIndex: 0, explanation: "The yellow jersey is worn by the overall leader of the Tour de France." },
    { id: "200-bible-daniel", category: "Bible", difficulty: "Medium", question: "Which biblical figure interpreted dreams for King Nebuchadnezzar?", options: ["Daniel", "Jonah", "Samuel", "Elijah"], answerIndex: 0, explanation: "Daniel interprets dreams for King Nebuchadnezzar." },
  ],
  300: [
    { id: "300-science-oxygen", category: "Science", difficulty: "Hard", question: "Which scientist is often credited with discovering oxygen independently in the 1770s?", options: ["Joseph Priestley", "Isaac Newton", "Michael Faraday", "Gregor Mendel"], answerIndex: 0, explanation: "Joseph Priestley is often credited with discovering oxygen independently in the 1770s." },
    { id: "300-geography-capital-canada", category: "Geography", difficulty: "Hard", question: "What is the capital city of Canada?", options: ["Toronto", "Vancouver", "Montreal", "Ottawa"], answerIndex: 3, explanation: "Ottawa is the capital of Canada." },
    { id: "300-history-westphalia", category: "History", difficulty: "Hard", question: "The Peace of Westphalia ended which major European conflict?", options: ["The Hundred Years’ War", "The Thirty Years’ War", "The War of Spanish Succession", "The Napoleonic Wars"], answerIndex: 1, explanation: "The Peace of Westphalia ended the Thirty Years’ War in 1648." },
    { id: "300-literature-hamlet", category: "Literature", difficulty: "Hard", question: "Which Shakespeare play is set mainly in Denmark?", options: ["Macbeth", "Hamlet", "Othello", "King Lear"], answerIndex: 1, explanation: "Hamlet is set mainly in Denmark." },
    { id: "300-sports-perfect", category: "Sports", difficulty: "Hard", question: "In baseball, how many batters are retired in a perfect 9-inning game?", options: ["24", "25", "27", "30"], answerIndex: 2, explanation: "A perfect game requires 27 consecutive outs." },
    { id: "300-mythology-odysseus", category: "Mythology", difficulty: "Hard", question: "Who is the hero of Homer’s Odyssey?", options: ["Achilles", "Odysseus", "Hector", "Perseus"], answerIndex: 1, explanation: "The Odyssey follows Odysseus on his journey home." },
  ],
  400: [
    { id: "400-science-avogadro", category: "Science", difficulty: "Harder", question: "Avogadro’s number is closest to which value?", options: ["3.14 x 10^8", "6.02 x 10^23", "9.81 x 10^2", "1.61 x 10^12"], answerIndex: 1, explanation: "Avogadro’s number is approximately 6.02 x 10^23." },
    { id: "400-geography-bosporus", category: "Geography", difficulty: "Harder", question: "The Bosporus strait separates which two continents?", options: ["Europe and Asia", "Africa and Asia", "Europe and Africa", "North America and South America"], answerIndex: 0, explanation: "The Bosporus separates Europe and Asia in Turkey." },
    { id: "400-history-meiji", category: "History", difficulty: "Harder", question: "The Meiji Restoration transformed which country in the 19th century?", options: ["China", "Japan", "Korea", "Thailand"], answerIndex: 1, explanation: "The Meiji Restoration transformed Japan beginning in 1868." },
    { id: "400-literature-gatsby", category: "Literature", difficulty: "Harder", question: "What is the name of the narrator in The Great Gatsby?", options: ["Jay Gatsby", "Tom Buchanan", "Nick Carraway", "George Wilson"], answerIndex: 2, explanation: "Nick Carraway narrates The Great Gatsby." },
    { id: "400-sports-cricket", category: "Sports", difficulty: "Harder", question: "In cricket, what is the term for a score of zero by a batter?", options: ["Duck", "Blank", "Nil", "Scratch"], answerIndex: 0, explanation: "A score of zero in cricket is called a duck." },
    { id: "400-music-baroque", category: "Music", difficulty: "Harder", question: "Johann Sebastian Bach is most closely associated with which musical period?", options: ["Romantic", "Classical", "Baroque", "Modern"], answerIndex: 2, explanation: "Bach is one of the defining composers of the Baroque period." },
  ],
  500: [
    { id: "500-science-schrodinger", category: "Science", difficulty: "Very Hard", question: "Schrödinger’s equation is most closely associated with which field?", options: ["Quantum mechanics", "Plate tectonics", "Classical optics", "Thermodynamics"], answerIndex: 0, explanation: "Schrödinger’s equation is a central equation in quantum mechanics." },
    { id: "500-geography-titicaca", category: "Geography", difficulty: "Very Hard", question: "Lake Titicaca lies on the border of Bolivia and which other country?", options: ["Chile", "Peru", "Ecuador", "Argentina"], answerIndex: 1, explanation: "Lake Titicaca lies on the border of Bolivia and Peru." },
    { id: "500-history-magna", category: "History", difficulty: "Very Hard", question: "The Magna Carta was agreed to by King John in which year?", options: ["1066", "1215", "1415", "1492"], answerIndex: 1, explanation: "King John agreed to the Magna Carta in 1215." },
    { id: "500-literature-ulysses", category: "Literature", difficulty: "Very Hard", question: "Who wrote the novel Ulysses?", options: ["James Joyce", "Virginia Woolf", "T.S. Eliot", "D.H. Lawrence"], answerIndex: 0, explanation: "James Joyce wrote Ulysses." },
    { id: "500-art-guernica", category: "Art", difficulty: "Very Hard", question: "Guernica was painted by which artist?", options: ["Pablo Picasso", "Henri Matisse", "Joan Miró", "Diego Rivera"], answerIndex: 0, explanation: "Pablo Picasso painted Guernica." },
    { id: "500-music-dvorak", category: "Music", difficulty: "Very Hard", question: "Antonín Dvořák’s Symphony No. 9 is commonly known by what name?", options: ["Eroica", "From the New World", "Pastoral", "Jupiter"], answerIndex: 1, explanation: "Dvořák’s Symphony No. 9 is commonly called From the New World." },
  ],
};

const FINAL_BANK = [
  { id: "final-science-nitrogen", category: "Science", question: "Which element makes up the largest share of Earth’s atmosphere?", options: ["Oxygen", "Nitrogen", "Argon", "Carbon dioxide"], answerIndex: 1, explanation: "Nitrogen makes up the largest share of Earth’s atmosphere." },
  { id: "final-history-adams", category: "U.S. History", question: "Who was the first U.S. president to live in the White House?", options: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison"], answerIndex: 1, explanation: "John Adams was the first president to live in the White House." },
  { id: "final-geography-africa", category: "World Geography", question: "Which continent has the most countries?", options: ["Africa", "Asia", "Europe", "South America"], answerIndex: 0, explanation: "Africa has the most internationally recognized countries of any continent." },
  { id: "final-literature-smaug", category: "Books", question: "In The Hobbit, what is the name of the dragon?", options: ["Smaug", "Glaurung", "Drogon", "Ancalagon"], answerIndex: 0, explanation: "Smaug is the dragon in The Hobbit." },
  { id: "final-sports-mound", category: "Sports", question: "In Major League Baseball, the pitching rubber is how far from home plate?", options: ["55 feet", "60 feet 6 inches", "63 feet", "66 feet 6 inches"], answerIndex: 1, explanation: "The MLB pitching rubber is 60 feet 6 inches from home plate." },
];

const app = document.getElementById("app");
const toast = document.getElementById("toast");

const state = {
  players: DEFAULT_PLAYERS,
  activePlayerId: "ian",
  results: {},
  game: null,
  timerId: null,
  view: "home",
  sync: {
    enabled: false,
    connected: false,
    message: "Local mode",
    client: null,
    channel: null,
  },
};

init();

async function init() {
  state.activePlayerId = localStorage.getItem(STORAGE_KEYS.activePlayer) || "ian";
  state.results = loadJSON(STORAGE_KEYS.results, {});
  renderHome();

  await initSupabaseSync();
}

async function initSupabaseSync() {
  const hasConfig =
    USE_SUPABASE &&
    supabaseUrl &&
    supabaseAnonKey &&
    !String(supabaseUrl).includes("PASTE_") &&
    !String(supabaseAnonKey).includes("PASTE_");

  if (!hasConfig) {
    state.sync = { ...state.sync, enabled: false, connected: false, message: "Local mode" };
    renderCurrentView();
    return;
  }

  try {
    const client = createClient(supabaseUrl, supabaseAnonKey);

    state.sync = {
      ...state.sync,
      enabled: true,
      connected: false,
      message: "Connecting…",
      client,
      channel: null,
    };

    await loadSupabaseResults();

    const channel = client
      .channel(`trivia-ladder-${APP_ROOM_ID}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trivia_ladder_results",
          filter: `room_id=eq.${APP_ROOM_ID}`,
        },
        async () => {
          await loadSupabaseResults(false);
        }
      )
      .subscribe(status => {
        if (status === "SUBSCRIBED") {
          state.sync.connected = true;
          state.sync.message = "Shared leaderboard live";
          renderCurrentView();
        }
      });

    state.sync.channel = channel;
    state.sync.connected = true;
    state.sync.message = "Shared leaderboard live";
    renderCurrentView();
  } catch (error) {
    console.error(error);
    state.sync = { ...state.sync, enabled: false, connected: false, message: "Supabase setup needed" };
    renderCurrentView();
  }
}

async function loadSupabaseResults(shouldRender = true) {
  if (!state.sync.client) return;

  const { data, error } = await state.sync.client
    .from("trivia_ladder_results")
    .select("*")
    .eq("room_id", APP_ROOM_ID);

  if (error) {
    console.error(error);
    state.sync.connected = false;
    state.sync.message = "Sync error";
    if (shouldRender) renderCurrentView();
    return;
  }

  const nextResults = {};
  for (const row of data || []) {
    const dateKey = row.game_date;
    const playerId = row.player_id;

    if (!nextResults[dateKey]) nextResults[dateKey] = {};
    nextResults[dateKey][playerId] = {
      playerId,
      playerName: row.player_name,
      dateKey,
      bank: row.bank,
      completedAt: row.completed_at,
      answers: row.answers || [],
      final: row.final || {},
    };
  }

  state.results = nextResults;
  saveJSON(STORAGE_KEYS.results, state.results);
  state.sync.connected = true;
  state.sync.message = "Shared leaderboard live";

  if (shouldRender) renderCurrentView();
}

function renderCurrentView() {
  if (state.game) return;
  if (state.view === "leaderboard") renderLeaderboard();
  else if (state.view === "results" && state.lastResult) renderResults(state.lastResult);
  else renderHome();
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function persistResults() {
  saveJSON(STORAGE_KEYS.results, state.results);
}

function activePlayer() {
  return state.players.find(p => p.id === state.activePlayerId) || state.players[0];
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

function money(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function pickDailyQuestion(value, dateKey, usedCategories) {
  const bank = QUESTION_BANK[value] || [];
  const shuffled = [...bank].sort((a, b) => hashString(`${dateKey}-${value}-${a.id}`) - hashString(`${dateKey}-${value}-${b.id}`));
  const selected = shuffled.find(q => !usedCategories.has(q.category)) || shuffled[0];
  usedCategories.add(selected.category);
  return { ...selected, value };
}

function dailySet(dateKey = todayKey()) {
  const usedCategories = new Set();
  return {
    dateKey,
    questions: QUESTION_VALUES.map(value => pickDailyQuestion(value, dateKey, usedCategories)),
    final: FINAL_BANK[hashString(`${dateKey}-final-ladder-v7`) % FINAL_BANK.length],
  };
}

function playerResult(dateKey, playerId) {
  return state.results?.[dateKey]?.[playerId] || null;
}

function renderHome() {
  clearTimer();
  state.view = "home";
  state.game = null;
  state.lastResult = null;

  const existing = playerResult(todayKey(), state.activePlayerId);

  app.innerHTML = `
    <section class="screen">
      <div class="card home-card">
        <div class="logo">$</div>
        <span class="eyebrow">${formatDateLabel(todayKey())}</span>
        <h1>Today’s Board Is Live</h1>
        <p class="subtext">Choose player, start today’s round, and see who owns the board.</p>

        <div class="sync-pill ${state.sync.connected ? "connected" : ""}">
          <span class="sync-dot"></span>
          <span>${escapeHTML(state.sync.message)}</span>
        </div>

        <div class="player-picker">
          ${state.players.map(p => `
            <button class="player-option ${p.id === state.activePlayerId ? "active" : ""}" data-player-id="${p.id}" type="button">
              ${escapeHTML(p.name)}
            </button>
          `).join("")}
        </div>

        <div class="home-actions">
          <button class="primary-btn" id="startRoundButton" type="button">
            ${existing ? "View Today’s Result" : "Start Today’s Round"}
          </button>
          <button class="secondary-btn" id="leaderboardButton" type="button">Leaderboard</button>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll(".player-option").forEach(button => {
    button.addEventListener("click", () => {
      state.activePlayerId = button.dataset.playerId;
      localStorage.setItem(STORAGE_KEYS.activePlayer, state.activePlayerId);
      renderHome();
    });
  });

  document.getElementById("startRoundButton").addEventListener("click", () => {
    const result = playerResult(todayKey(), state.activePlayerId);
    if (result) renderResults(result);
    else startGame();
  });

  document.getElementById("leaderboardButton").addEventListener("click", renderLeaderboard);
}

function startGame() {
  const set = dailySet();
  const player = activePlayer();

  if (playerResult(set.dateKey, player.id)) {
    renderResults(playerResult(set.dateKey, player.id));
    return;
  }

  state.game = {
    playerId: player.id,
    playerName: player.name,
    dateKey: set.dateKey,
    questions: set.questions,
    final: set.final,
    currentIndex: 0,
    bank: 0,
    answers: [],
    selectedIndex: null,
    phase: "question",
    locked: false,
    timeLeft: QUESTION_SECONDS,
  };

  renderQuestion();
}

function renderQuestion() {
  clearTimer();
  const g = state.game;
  const q = g.questions[g.currentIndex];

  g.selectedIndex = null;
  g.locked = false;
  g.phase = "question";
  g.timeLeft = QUESTION_SECONDS;

  app.innerHTML = `
    <section class="screen">
      <div class="game-header">
        <div class="header-left">
          <span class="round-label">Q${g.currentIndex + 1} · ${escapeHTML(q.category)} · ${escapeHTML(q.difficulty)} · ${money(q.value)}</span>
          <span class="bank-label">${escapeHTML(g.playerName)} · Bank ${money(g.bank)}</span>
        </div>
        <div class="timer" id="timer">${g.timeLeft}</div>
      </div>

      <div class="card game-card">
        <span class="clue-value">For ${money(q.value)}</span>
        <div class="clue-text">${escapeHTML(q.question)}</div>

        <div class="answer-grid">
          ${q.options.map((option, index) => `
            <button class="answer-option" data-answer-index="${index}" type="button">${escapeHTML(option)}</button>
          `).join("")}
        </div>

        <div class="submit-area">
          <button class="primary-btn" id="submitAnswerButton" type="button" disabled>Submit</button>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll(".answer-option").forEach(button => {
    button.addEventListener("click", () => {
      if (g.locked) return;
      g.selectedIndex = Number(button.dataset.answerIndex);
      document.querySelectorAll(".answer-option").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("submitAnswerButton").disabled = false;
    });
  });

  document.getElementById("submitAnswerButton").addEventListener("click", () => submitQuestionAnswer(g.selectedIndex, "answer"));
  startTimer(() => submitQuestionAnswer(null, "time"));
}

function submitQuestionAnswer(selectedIndex, reason = "answer") {
  const g = state.game;
  if (!g || g.locked) return;

  g.locked = true;
  clearTimer();

  const q = g.questions[g.currentIndex];
  const correct = selectedIndex === q.answerIndex;
  const earned = correct ? q.value : 0;

  g.bank += earned;
  const answer = { questionId: q.id, category: q.category, value: q.value, selectedIndex, correct, earned, reason };
  g.answers.push(answer);

  renderQuestionFeedback(q, answer);
}

function renderQuestionFeedback(q, answer) {
  const g = state.game;
  const isLast = g.currentIndex + 1 >= g.questions.length;
  const title = answer.correct ? "Correct!" : answer.reason === "time" ? "Time!" : answer.reason === "tab" ? "Forfeit!" : "Incorrect";
  const subtitle = answer.correct ? `You won ${money(answer.earned)}.` : "You won $0.";

  app.innerHTML = `
    <section class="screen">
      <div class="game-header">
        <div class="header-left">
          <span class="round-label">Q${g.currentIndex + 1} Result</span>
          <span class="bank-label">Current Bank ${money(g.bank)}</span>
        </div>
      </div>

      <div class="card game-card">
        <div class="feedback-card">
          <span class="feedback-title ${answer.correct ? "good" : "bad"}">${title}</span>
          <span class="feedback-money">${subtitle}</span>
          <p class="feedback-explanation">${escapeHTML(q.explanation)}</p>
          <button class="primary-btn" id="nextButton" type="button">${isLast ? "Go to Final Ladder" : "Next Clue"}</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("nextButton").addEventListener("click", () => {
    if (isLast) renderFinalSetup();
    else {
      g.currentIndex += 1;
      renderQuestion();
    }
  });
}

function renderFinalSetup() {
  clearTimer();
  const g = state.game;

  app.innerHTML = `
    <section class="screen">
      <div class="card final-card">
        <span class="eyebrow">Final Ladder</span>
        <h2>Make Your Wager</h2>
        <p class="subtext">Current Bank: ${money(g.bank)}. Correct adds your wager. Incorrect subtracts it.</p>

        <div class="wager-options">
          <input class="text-input" id="wagerInput" type="number" min="0" max="${g.bank}" step="100" value="${Math.min(500, g.bank)}" />
          <div class="row-actions">
            <button class="secondary-btn" data-wager="0" type="button">${money(0)}</button>
            <button class="secondary-btn" data-wager="${Math.floor(g.bank / 2)}" type="button">Half</button>
            <button class="secondary-btn" data-wager="${g.bank}" type="button">All In</button>
          </div>
        </div>

        <div class="row-actions">
          <button class="primary-btn" id="lockWagerButton" type="button">Lock Wager</button>
          <button class="secondary-btn" id="skipFinalButton" type="button">Skip Final</button>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll("[data-wager]").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("wagerInput").value = button.dataset.wager;
    });
  });

  document.getElementById("lockWagerButton").addEventListener("click", () => {
    g.finalWager = clampWager(Number(document.getElementById("wagerInput").value || 0), g.bank);
    renderFinalQuestion();
  });

  document.getElementById("skipFinalButton").addEventListener("click", () => saveCompletedGame({ selectedIndex: null, correct: false, wager: 0, reason: "skipped", earned: 0 }));
}

function renderFinalQuestion() {
  clearTimer();
  const g = state.game;
  const f = g.final;

  g.selectedIndex = null;
  g.locked = false;
  g.phase = "final";
  g.timeLeft = FINAL_SECONDS;

  app.innerHTML = `
    <section class="screen">
      <div class="game-header">
        <div class="header-left">
          <span class="round-label">Final Ladder · ${escapeHTML(f.category)}</span>
          <span class="bank-label">Bank ${money(g.bank)} · Wager ${money(g.finalWager)}</span>
        </div>
        <div class="timer" id="timer">${g.timeLeft}</div>
      </div>

      <div class="card game-card">
        <span class="clue-value">Final Wager ${money(g.finalWager)}</span>
        <div class="clue-text">${escapeHTML(f.question)}</div>

        <div class="answer-grid">
          ${f.options.map((option, index) => `
            <button class="answer-option" data-answer-index="${index}" type="button">${escapeHTML(option)}</button>
          `).join("")}
        </div>

        <div class="submit-area">
          <button class="primary-btn" id="submitFinalButton" type="button" disabled>Submit Final</button>
        </div>
      </div>
    </section>
  `;

  document.querySelectorAll(".answer-option").forEach(button => {
    button.addEventListener("click", () => {
      if (g.locked) return;
      g.selectedIndex = Number(button.dataset.answerIndex);
      document.querySelectorAll(".answer-option").forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");
      document.getElementById("submitFinalButton").disabled = false;
    });
  });

  document.getElementById("submitFinalButton").addEventListener("click", () => submitFinalAnswer(g.selectedIndex, "answer"));
  startTimer(() => submitFinalAnswer(null, "time"));
}

function submitFinalAnswer(selectedIndex, reason = "answer") {
  const g = state.game;
  if (!g || g.locked) return;

  g.locked = true;
  clearTimer();

  const f = g.final;
  const correct = selectedIndex === f.answerIndex;
  const earned = correct ? g.finalWager : -g.finalWager;
  const finalBank = Math.max(0, g.bank + earned);

  renderFinalFeedback(f, { selectedIndex, correct, wager: g.finalWager, reason, earned, finalBank });
}

function renderFinalFeedback(f, answer) {
  const title = answer.correct ? "Correct!" : answer.reason === "time" ? "Time!" : answer.reason === "tab" ? "Forfeit!" : "Incorrect";
  const moneyText = answer.correct ? `You added ${money(answer.wager)}.` : `You lost ${money(answer.wager)}.`;

  app.innerHTML = `
    <section class="screen">
      <div class="card game-card">
        <div class="feedback-card">
          <span class="feedback-title ${answer.correct ? "good" : "bad"}">${title}</span>
          <span class="feedback-money">${moneyText}</span>
          <p class="feedback-explanation">${escapeHTML(f.explanation)}</p>
          <button class="primary-btn" id="saveResultButton" type="button">Save Result</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("saveResultButton").addEventListener("click", () => saveCompletedGame(answer));
}

async function saveCompletedGame(finalAnswer) {
  const g = state.game;
  const bank = typeof finalAnswer.finalBank === "number" ? finalAnswer.finalBank : Math.max(0, g.bank + (finalAnswer.earned || 0));

  const result = {
    playerId: g.playerId,
    playerName: g.playerName,
    dateKey: g.dateKey,
    bank,
    completedAt: new Date().toISOString(),
    answers: g.answers,
    final: {
      questionId: g.final.id,
      category: g.final.category,
      wager: finalAnswer.wager || 0,
      selectedIndex: finalAnswer.selectedIndex,
      correct: finalAnswer.correct,
      reason: finalAnswer.reason,
      earned: finalAnswer.earned || 0,
    },
  };

  if (!state.results[g.dateKey]) state.results[g.dateKey] = {};
  state.results[g.dateKey][g.playerId] = result;
  persistResults();
  state.game = null;

  if (state.sync.enabled && state.sync.client) {
    try {
      const row = {
        id: `${APP_ROOM_ID}_${g.dateKey}_${g.playerId}`,
        room_id: APP_ROOM_ID,
        player_id: g.playerId,
        player_name: g.playerName,
        game_date: g.dateKey,
        bank,
        answers: g.answers,
        final: result.final,
        completed_at: result.completedAt,
      };

      const { error } = await state.sync.client
        .from("trivia_ladder_results")
        .upsert(row, { onConflict: "id" });

      if (error) throw error;

      await loadSupabaseResults(false);
      showToast("Result saved to shared leaderboard.");
    } catch (error) {
      console.error(error);
      showToast("Saved locally. Shared sync failed.");
    }
  } else {
    showToast("Result saved locally.");
  }

  renderResults(result);
}

function renderResults(result) {
  clearTimer();
  state.view = "results";
  state.lastResult = result;

  const stats = computeStats();
  const s = stats[result.playerId] || { record: { w: 0, d: 0, l: 0 }, streak: "—", lifetimeBank: result.bank };

  app.innerHTML = `
    <section class="screen">
      <div class="card results-card">
        <span class="eyebrow">${formatDateLabel(result.dateKey)}</span>
        <h2>${escapeHTML(result.playerName)}’s Final Bank</h2>
        <div class="big-money">${money(result.bank)}</div>

        <div class="sync-pill ${state.sync.connected ? "connected" : ""}">
          <span class="sync-dot"></span>
          <span>${escapeHTML(state.sync.message)}</span>
        </div>

        <div class="stat-grid">
          <div class="stat-card"><span>Overall Record</span><strong>${s.record.w}-${s.record.d}-${s.record.l}</strong></div>
          <div class="stat-card"><span>Current Streak</span><strong>${s.streak}</strong></div>
          <div class="stat-card"><span>Lifetime Bank</span><strong>${money(s.lifetimeBank)}</strong></div>
        </div>

        <div class="row-actions">
          <button class="primary-btn" id="leaderboardButton" type="button">Leaderboard</button>
          <button class="secondary-btn" id="homeButton" type="button">Home</button>
          <button class="danger-btn" id="resetTodayButton" type="button">Reset Today</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("leaderboardButton").addEventListener("click", renderLeaderboard);
  document.getElementById("homeButton").addEventListener("click", renderHome);
  document.getElementById("resetTodayButton").addEventListener("click", () => resetTodayScore(result.playerId));
}

async function resetTodayScore(playerId) {
  const key = todayKey();

  if (state.results[key]?.[playerId]) {
    delete state.results[key][playerId];
    persistResults();
  }

  if (state.sync.enabled && state.sync.client) {
    try {
      const { error } = await state.sync.client
        .from("trivia_ladder_results")
        .delete()
        .eq("room_id", APP_ROOM_ID)
        .eq("game_date", key)
        .eq("player_id", playerId);

      if (error) throw error;

      await loadSupabaseResults(false);
      showToast("Today’s score reset from shared leaderboard.");
    } catch (error) {
      console.error(error);
      showToast("Local score reset. Shared reset failed.");
    }
  } else {
    showToast("Today’s score reset locally.");
  }

  renderHome();
}

function renderLeaderboard() {
  clearTimer();
  state.view = "leaderboard";
  state.game = null;
  state.lastResult = null;

  const stats = computeStats();
  const sorted = Object.values(stats).sort((a, b) => {
    const todayDiff = (b.todayBank ?? -1) - (a.todayBank ?? -1);
    if (todayDiff !== 0) return todayDiff;
    return b.lifetimeBank - a.lifetimeBank;
  });

  const rows = sorted.map(s => `
    <tr>
      <td><strong>${escapeHTML(s.player.name)}</strong></td>
      <td class="money-cell">${s.todayBank === null ? "—" : money(s.todayBank)}</td>
      <td>${s.record.w}-${s.record.d}-${s.record.l}</td>
      <td>${s.streak}</td>
      <td>${s.winsThisWeek}</td>
      <td>${s.overallWins}</td>
      <td class="money-cell">${money(s.lifetimeBank)}</td>
    </tr>
  `).join("");

  app.innerHTML = `
    <section class="screen">
      <div class="card leaderboard-card">
        <span class="eyebrow">${formatDateLabel(todayKey())}</span>
        <h2>Leaderboard</h2>

        <div class="sync-pill ${state.sync.connected ? "connected" : ""}">
          <span class="sync-dot"></span>
          <span>${escapeHTML(state.sync.message)}</span>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Player</th>
                <th>Today</th>
                <th>Record</th>
                <th>Streak</th>
                <th>Week Wins</th>
                <th>Total Wins</th>
                <th>Lifetime</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="row-actions">
          <button class="primary-btn" id="homeButton" type="button">Home</button>
          <button class="danger-btn" id="clearDataButton" type="button">Clear All Scores</button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("homeButton").addEventListener("click", renderHome);
  document.getElementById("clearDataButton").addEventListener("click", clearAllScores);
}

async function clearAllScores() {
  const confirmText = state.sync.enabled ? "Clear ALL shared scores for both phones?" : "Clear all saved scores from this browser?";
  if (!window.confirm(confirmText)) return;

  state.results = {};
  persistResults();

  if (state.sync.enabled && state.sync.client) {
    try {
      const { error } = await state.sync.client
        .from("trivia_ladder_results")
        .delete()
        .eq("room_id", APP_ROOM_ID);

      if (error) throw error;

      await loadSupabaseResults(false);
      showToast("Shared scores cleared.");
    } catch (error) {
      console.error(error);
      showToast("Local scores cleared. Shared clear failed.");
    }
  } else {
    showToast("Scores cleared locally.");
  }

  renderLeaderboard();
}

function computeStats() {
  const stats = {};
  const playerIds = state.players.map(p => p.id);

  for (const player of state.players) {
    stats[player.id] = {
      player,
      todayBank: playerResult(todayKey(), player.id)?.bank ?? null,
      lifetimeBank: 0,
      overallWins: 0,
      winsThisWeek: 0,
      record: { w: 0, d: 0, l: 0 },
      streak: "—",
    };
  }

  for (const byPlayer of Object.values(state.results || {})) {
    for (const [playerId, result] of Object.entries(byPlayer || {})) {
      if (stats[playerId]) stats[playerId].lifetimeBank += result.bank || 0;
    }
  }

  const dates = Object.keys(state.results || {}).sort();
  const weekStart = getWeekStart();

  for (const dateKey of dates) {
    const byPlayer = state.results[dateKey] || {};
    const completed = playerIds.map(id => ({ id, result: byPlayer[id] })).filter(x => x.result);
    if (completed.length < 2) continue;

    const high = Math.max(...completed.map(x => x.result.bank));
    const winners = completed.filter(x => x.result.bank === high);
    const isThisWeek = keyToDate(dateKey) >= weekStart;

    for (const item of completed) {
      if (winners.length > 1) stats[item.id].record.d += 1;
      else if (winners[0].id === item.id) {
        stats[item.id].record.w += 1;
        stats[item.id].overallWins += 1;
        if (isThisWeek) stats[item.id].winsThisWeek += 1;
      } else {
        stats[item.id].record.l += 1;
      }
    }
  }

  for (const id of playerIds) stats[id].streak = computeCurrentStreak(id, dates);
  return stats;
}

function computeCurrentStreak(playerId, dates) {
  const playerIds = state.players.map(p => p.id);
  let type = null;
  let count = 0;

  for (let i = dates.length - 1; i >= 0; i--) {
    const byPlayer = state.results[dates[i]] || {};
    const completed = playerIds.map(id => ({ id, result: byPlayer[id] })).filter(x => x.result);
    if (completed.length < 2 || !byPlayer[playerId]) continue;

    const high = Math.max(...completed.map(x => x.result.bank));
    const winners = completed.filter(x => x.result.bank === high);
    const dayType = winners.length > 1 ? "D" : winners[0].id === playerId ? "W" : "L";

    if (!type) {
      type = dayType;
      count = 1;
    } else if (type === dayType) {
      count += 1;
    } else {
      break;
    }
  }

  return type ? `${type}${count}` : "—";
}

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function keyToDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startTimer(onExpire) {
  clearTimer();
  state.timerId = setInterval(() => {
    if (!state.game || state.game.locked) return;
    state.game.timeLeft -= 1;

    const timer = document.getElementById("timer");
    if (timer) {
      timer.textContent = Math.max(state.game.timeLeft, 0);
      timer.classList.toggle("warning", state.game.timeLeft <= 10);
    }

    if (state.game.timeLeft <= 0) onExpire();
  }, 1000);
}

function clearTimer() {
  if (state.timerId) clearInterval(state.timerId);
  state.timerId = null;
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden && state.game && !state.game.locked) {
    if (state.game.phase === "final") submitFinalAnswer(null, "tab");
    else submitQuestionAnswer(null, "tab");
  }
});

function clampWager(wager, bank) {
  if (!Number.isFinite(wager)) return 0;
  return Math.max(0, Math.min(bank, Math.round(wager)));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2300);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
