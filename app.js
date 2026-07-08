// Trivia Ladder — local first version
// Saves players and results in this browser using localStorage.
// You can later connect these same data shapes to Firebase/Supabase for shared devices/accounts.

const STORAGE_KEYS = {
  players: "triviaLadder.players.v1",
  activePlayer: "triviaLadder.activePlayer.v1",
  results: "triviaLadder.results.v1",
};

const QUESTION_VALUES = [100, 200, 300, 400, 500];
const QUESTION_SECONDS = 25;
const FINAL_SECONDS = 45;

const QUESTION_BANK = {
  100: [
    {
      id: "100-planet-red",
      category: "Science",
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Mercury"],
      answerIndex: 1,
      explanation: "Mars is called the Red Planet because iron oxide on its surface gives it a reddish color.",
    },
    {
      id: "100-france-capital",
      category: "Geography",
      question: "What is the capital of France?",
      options: ["Madrid", "Rome", "Paris", "Berlin"],
      answerIndex: 2,
      explanation: "Paris is the capital and largest city of France.",
    },
    {
      id: "100-baseball-innings",
      category: "Sports",
      question: "How many innings are in a standard Major League Baseball game?",
      options: ["7", "8", "9", "10"],
      answerIndex: 2,
      explanation: "A standard MLB game is scheduled for 9 innings.",
    },
    {
      id: "100-water-freeze",
      category: "Science",
      question: "At what temperature does water freeze in Fahrenheit?",
      options: ["0°F", "32°F", "50°F", "100°F"],
      answerIndex: 1,
      explanation: "Water freezes at 32°F, which is 0°C.",
    },
    {
      id: "100-pixar-toy-story",
      category: "Movies",
      question: "Which animated movie features Woody and Buzz Lightyear?",
      options: ["Shrek", "Toy Story", "Finding Nemo", "Cars"],
      answerIndex: 1,
      explanation: "Woody and Buzz Lightyear are the main characters in Toy Story.",
    },
    {
      id: "100-usa-currency",
      category: "General",
      question: "What currency is used in the United States?",
      options: ["Dollar", "Peso", "Euro", "Pound"],
      answerIndex: 0,
      explanation: "The United States uses the U.S. dollar.",
    },
    {
      id: "100-bible-first-book",
      category: "Bible",
      question: "What is the first book of the Bible?",
      options: ["Exodus", "Genesis", "Matthew", "Psalms"],
      answerIndex: 1,
      explanation: "Genesis is the first book of the Bible.",
    },
    {
      id: "100-liverpool-song",
      category: "Sports",
      question: "Which soccer club is strongly associated with the song “You’ll Never Walk Alone”?",
      options: ["Chelsea", "Liverpool", "Barcelona", "Juventus"],
      answerIndex: 1,
      explanation: "Liverpool supporters famously sing “You’ll Never Walk Alone.”",
    },
  ],
  200: [
    {
      id: "200-ocean-largest",
      category: "Geography",
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
      answerIndex: 2,
      explanation: "The Pacific Ocean is Earth’s largest ocean.",
    },
    {
      id: "200-blood-pump",
      category: "Science",
      question: "Which organ pumps blood through the human body?",
      options: ["Lung", "Liver", "Brain", "Heart"],
      answerIndex: 3,
      explanation: "The heart pumps blood through the circulatory system.",
    },
    {
      id: "200-guardians-city",
      category: "Sports",
      question: "The Guardians play Major League Baseball in which city?",
      options: ["Cincinnati", "Cleveland", "Detroit", "Pittsburgh"],
      answerIndex: 1,
      explanation: "The Cleveland Guardians play in Cleveland, Ohio.",
    },
    {
      id: "200-finding-nemo",
      category: "Movies",
      question: "In Finding Nemo, what kind of fish is Nemo?",
      options: ["Clownfish", "Goldfish", "Angelfish", "Blue tang"],
      answerIndex: 0,
      explanation: "Nemo is a clownfish.",
    },
    {
      id: "200-harry-potter-school",
      category: "Books",
      question: "What is the name of the wizarding school in Harry Potter?",
      options: ["Beauxbatons", "Hogwarts", "Durmstrang", "Ilvermorny"],
      answerIndex: 1,
      explanation: "Harry Potter attends Hogwarts School of Witchcraft and Wizardry.",
    },
    {
      id: "200-statue-liberty",
      category: "History",
      question: "The Statue of Liberty was a gift to the United States from which country?",
      options: ["France", "Spain", "England", "Italy"],
      answerIndex: 0,
      explanation: "France gave the Statue of Liberty to the United States.",
    },
    {
      id: "200-crossfit-amrap",
      category: "Fitness",
      question: "In CrossFit, what does AMRAP usually stand for?",
      options: ["As Many Rounds/Reps As Possible", "Advanced Movement Range and Power", "Athlete Maximum Rep Attempt Plan", "Active Mobility Recovery After Practice"],
      answerIndex: 0,
      explanation: "AMRAP stands for As Many Rounds or Reps As Possible.",
    },
    {
      id: "200-color-primary",
      category: "General",
      question: "Which of these is traditionally considered a primary color?",
      options: ["Green", "Purple", "Red", "Orange"],
      answerIndex: 2,
      explanation: "Red is traditionally one of the primary colors in basic color theory.",
    },
  ],
  300: [
    {
      id: "300-liberty-bell",
      category: "History",
      question: "The Liberty Bell is located in which U.S. city?",
      options: ["Boston", "Philadelphia", "Washington, D.C.", "New York City"],
      answerIndex: 1,
      explanation: "The Liberty Bell is in Philadelphia, Pennsylvania.",
    },
    {
      id: "300-periodic-au",
      category: "Science",
      question: "On the periodic table, what element has the symbol Au?",
      options: ["Silver", "Gold", "Argon", "Aluminum"],
      answerIndex: 1,
      explanation: "Au is the chemical symbol for gold.",
    },
    {
      id: "300-world-cup-four",
      category: "Sports",
      question: "How often is the FIFA World Cup usually held?",
      options: ["Every 2 years", "Every 3 years", "Every 4 years", "Every 5 years"],
      answerIndex: 2,
      explanation: "The FIFA World Cup is traditionally held every four years.",
    },
    {
      id: "300-lord-rings-author",
      category: "Books",
      question: "Who wrote The Lord of the Rings?",
      options: ["C.S. Lewis", "J.R.R. Tolkien", "George R.R. Martin", "Robert Jordan"],
      answerIndex: 1,
      explanation: "J.R.R. Tolkien wrote The Lord of the Rings.",
    },
    {
      id: "300-italian-dessert",
      category: "Food",
      question: "Which Italian dessert is traditionally made with mascarpone and espresso-soaked ladyfingers?",
      options: ["Cannoli", "Tiramisu", "Gelato", "Panna cotta"],
      answerIndex: 1,
      explanation: "Tiramisu is made with mascarpone and coffee-soaked ladyfingers.",
    },
    {
      id: "300-nile",
      category: "Geography",
      question: "The Nile River primarily flows through which continent?",
      options: ["Asia", "Africa", "Europe", "South America"],
      answerIndex: 1,
      explanation: "The Nile River is in Africa.",
    },
    {
      id: "300-constitution",
      category: "U.S. History",
      question: "What are the first ten amendments to the U.S. Constitution called?",
      options: ["The Federalist Papers", "The Bill of Rights", "The Articles", "The Civil Clauses"],
      answerIndex: 1,
      explanation: "The first ten amendments are known as the Bill of Rights.",
    },
    {
      id: "300-music-clef",
      category: "Music",
      question: "Which clef is also known as the G clef?",
      options: ["Bass clef", "Treble clef", "Alto clef", "Tenor clef"],
      answerIndex: 1,
      explanation: "The treble clef is also called the G clef.",
    },
  ],
  400: [
    {
      id: "400-mitochondria",
      category: "Science",
      question: "Which part of the cell is often called the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Cell membrane"],
      answerIndex: 2,
      explanation: "Mitochondria generate much of the energy cells use.",
    },
    {
      id: "400-shakespeare-denmark",
      category: "Literature",
      question: "Which Shakespeare play is set mainly in Denmark?",
      options: ["Macbeth", "Hamlet", "Othello", "King Lear"],
      answerIndex: 1,
      explanation: "Hamlet is set mainly in Denmark.",
    },
    {
      id: "400-mlb-perfect",
      category: "Sports",
      question: "In baseball, how many opposing batters are retired in a perfect 9-inning game?",
      options: ["24", "25", "27", "30"],
      answerIndex: 2,
      explanation: "A perfect game requires 27 consecutive outs in a 9-inning game.",
    },
    {
      id: "400-rome-seven",
      category: "History",
      question: "Rome is famously said to have been built on how many hills?",
      options: ["Five", "Six", "Seven", "Eight"],
      answerIndex: 2,
      explanation: "Rome is famously associated with seven hills.",
    },
    {
      id: "400-canada-capital",
      category: "Geography",
      question: "What is the capital city of Canada?",
      options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
      answerIndex: 3,
      explanation: "Ottawa is the capital of Canada.",
    },
    {
      id: "400-greek-odyssey",
      category: "Mythology",
      question: "Who is the hero of Homer’s Odyssey?",
      options: ["Achilles", "Odysseus", "Hector", "Perseus"],
      answerIndex: 1,
      explanation: "The Odyssey follows Odysseus on his journey home.",
    },
    {
      id: "400-music-tempo",
      category: "Music",
      question: "In music, what does “allegro” generally mean?",
      options: ["Slow", "Fast or lively", "Softly", "With silence"],
      answerIndex: 1,
      explanation: "Allegro usually indicates a fast or lively tempo.",
    },
    {
      id: "400-computer-html",
      category: "Technology",
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "High Transfer Machine Logic", "Home Tool Markup List", "Hyperlink Text Management Layer"],
      answerIndex: 0,
      explanation: "HTML stands for HyperText Markup Language.",
    },
  ],
  500: [
    {
      id: "500-voyager",
      category: "Science",
      question: "Which NASA spacecraft pair launched in 1977 to study the outer planets?",
      options: ["Pioneer 1 and 2", "Voyager 1 and 2", "Mariner 5 and 6", "Apollo 10 and 11"],
      answerIndex: 1,
      explanation: "Voyager 1 and Voyager 2 launched in 1977 and studied the outer planets.",
    },
    {
      id: "500-magna-carta",
      category: "History",
      question: "The Magna Carta was signed in which year?",
      options: ["1066", "1215", "1492", "1776"],
      answerIndex: 1,
      explanation: "King John agreed to the Magna Carta in 1215.",
    },
    {
      id: "500-soccer-ballondor",
      category: "Sports",
      question: "The Ballon d’Or is primarily awarded in which sport?",
      options: ["Basketball", "Soccer", "Tennis", "Cricket"],
      answerIndex: 1,
      explanation: "The Ballon d’Or is a prestigious soccer award.",
    },
    {
      id: "500-literary-1984",
      category: "Literature",
      question: "Who wrote the novel 1984?",
      options: ["Aldous Huxley", "George Orwell", "Ray Bradbury", "Kurt Vonnegut"],
      answerIndex: 1,
      explanation: "George Orwell wrote 1984.",
    },
    {
      id: "500-math-prime",
      category: "Math",
      question: "Which of these numbers is prime?",
      options: ["21", "33", "37", "49"],
      answerIndex: 2,
      explanation: "37 is prime because it has no positive divisors other than 1 and itself.",
    },
    {
      id: "500-painting-starry",
      category: "Art",
      question: "Who painted The Starry Night?",
      options: ["Claude Monet", "Pablo Picasso", "Vincent van Gogh", "Salvador Dalí"],
      answerIndex: 2,
      explanation: "Vincent van Gogh painted The Starry Night.",
    },
    {
      id: "500-bible-paul",
      category: "Bible",
      question: "On the road to which city did Saul experience the event that led to his conversion?",
      options: ["Jerusalem", "Damascus", "Rome", "Antioch"],
      answerIndex: 1,
      explanation: "Saul’s conversion is traditionally associated with the road to Damascus.",
    },
    {
      id: "500-tech-eniac",
      category: "Technology",
      question: "ENIAC is commonly associated with the early history of what?",
      options: ["Television", "Computers", "Satellites", "Radio"],
      answerIndex: 1,
      explanation: "ENIAC was an early electronic general-purpose computer.",
    },
  ],
};

const FINAL_BANK = [
  {
    id: "final-continents",
    category: "World Geography",
    question: "Which continent has the most countries?",
    options: ["Africa", "Asia", "Europe", "South America"],
    answerIndex: 0,
    explanation: "Africa has the most internationally recognized countries of any continent.",
  },
  {
    id: "final-us-presidents",
    category: "U.S. History",
    question: "Who was the first U.S. president to live in the White House?",
    options: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison"],
    answerIndex: 1,
    explanation: "John Adams was the first president to live in the White House.",
  },
  {
    id: "final-periodic",
    category: "Science",
    question: "Which element is the most abundant in Earth’s atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon", "Hydrogen"],
    answerIndex: 1,
    explanation: "Nitrogen makes up most of Earth’s atmosphere.",
  },
  {
    id: "final-mlb-mound",
    category: "Sports",
    question: "In Major League Baseball, the pitching mound is how far from home plate?",
    options: ["55 feet", "60 feet 6 inches", "63 feet", "66 feet 6 inches"],
    answerIndex: 1,
    explanation: "The MLB pitching rubber is 60 feet 6 inches from home plate.",
  },
  {
    id: "final-literature-hobbit",
    category: "Books",
    question: "In The Hobbit, what is the name of the dragon?",
    options: ["Smaug", "Glaurung", "Drogon", "Ancalagon"],
    answerIndex: 0,
    explanation: "Smaug is the dragon in The Hobbit.",
  },
  {
    id: "final-music-beatles",
    category: "Music",
    question: "Which Beatles album features the song “Come Together”?",
    options: ["Revolver", "Abbey Road", "Rubber Soul", "Let It Be"],
    answerIndex: 1,
    explanation: "“Come Together” appears on Abbey Road.",
  },
  {
    id: "final-geography-city",
    category: "Geography",
    question: "Which city sits on two continents, Europe and Asia?",
    options: ["Athens", "Istanbul", "Cairo", "Lisbon"],
    answerIndex: 1,
    explanation: "Istanbul spans Europe and Asia across the Bosporus.",
  },
  {
    id: "final-movie-oscar",
    category: "Movies",
    question: "Which film won the first Academy Award for Best Picture?",
    options: ["Wings", "Sunrise", "Metropolis", "The Jazz Singer"],
    answerIndex: 0,
    explanation: "Wings won the first Academy Award for Best Picture.",
  },
];

const state = {
  route: "home",
  players: [],
  activePlayerId: null,
  results: {},
  game: null,
  timerId: null,
};

const app = document.getElementById("app");
const toast = document.getElementById("toast");

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

function init() {
  state.players = loadJSON(STORAGE_KEYS.players, []);
  state.activePlayerId = localStorage.getItem(STORAGE_KEYS.activePlayer);
  state.results = loadJSON(STORAGE_KEYS.results, {});

  if (!state.players.some((p) => p.id === state.activePlayerId)) {
    state.activePlayerId = state.players[0]?.id || null;
    if (state.activePlayerId) localStorage.setItem(STORAGE_KEYS.activePlayer, state.activePlayerId);
  }

  bindNav();
  renderHome();
}

function bindNav() {
  document.getElementById("homeLogo").addEventListener("click", renderHome);
  document.getElementById("playerButton").addEventListener("click", renderPlayers);
  document.getElementById("leaderboardButton").addEventListener("click", renderLeaderboard);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.game && !state.game.locked && !state.game.completed) {
      handleVisibilityForfeit();
    }
  });
}

function makeId() {
  return `p_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function persistPlayers() {
  saveJSON(STORAGE_KEYS.players, state.players);
  if (state.activePlayerId) localStorage.setItem(STORAGE_KEYS.activePlayer, state.activePlayerId);
}

function persistResults() {
  saveJSON(STORAGE_KEYS.results, state.results);
}

function activePlayer() {
  return state.players.find((p) => p.id === state.activePlayerId) || null;
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDateLabel(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
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

function pickDailyQuestion(value, dateKey) {
  const bank = QUESTION_BANK[value];
  const idx = hashString(`${dateKey}-${value}-trivia-ladder`) % bank.length;
  return { ...bank[idx], value };
}

function pickDailyFinal(dateKey) {
  const idx = hashString(`${dateKey}-final-ladder`) % FINAL_BANK.length;
  return { ...FINAL_BANK[idx], value: "Final" };
}

function dailySet(dateKey = todayKey()) {
  return {
    dateKey,
    questions: QUESTION_VALUES.map((value) => pickDailyQuestion(value, dateKey)),
    final: pickDailyFinal(dateKey),
  };
}

function playerResult(dateKey, playerId) {
  return state.results?.[dateKey]?.[playerId] || null;
}

function allResultsFlat() {
  const rows = [];
  for (const [dateKey, byPlayer] of Object.entries(state.results || {})) {
    for (const [playerId, result] of Object.entries(byPlayer || {})) {
      rows.push({ dateKey, playerId, ...result });
    }
  }
  return rows.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function keyToDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function computeStats() {
  const stats = {};
  const playerIds = state.players.map((p) => p.id);

  for (const player of state.players) {
    stats[player.id] = {
      player,
      todayBank: playerResult(todayKey(), player.id)?.bank ?? null,
      lifetimeBank: 0,
      overallWins: 0,
      winsThisWeek: 0,
      record: { w: 0, d: 0, l: 0 },
      streak: "—",
      bestDay: 0,
      daysPlayed: 0,
      averageBank: 0,
    };
  }

  const rows = allResultsFlat();
  for (const row of rows) {
    if (!stats[row.playerId]) continue;
    stats[row.playerId].lifetimeBank += row.bank || 0;
    stats[row.playerId].bestDay = Math.max(stats[row.playerId].bestDay, row.bank || 0);
    stats[row.playerId].daysPlayed += 1;
  }

  for (const stat of Object.values(stats)) {
    stat.averageBank = stat.daysPlayed ? Math.round(stat.lifetimeBank / stat.daysPlayed) : 0;
  }

  const completedDates = Object.keys(state.results || {}).sort();
  const weekStart = getWeekStart();

  for (const dateKey of completedDates) {
    const byPlayer = state.results[dateKey] || {};
    const completed = playerIds
      .map((id) => ({ id, result: byPlayer[id] }))
      .filter((x) => x.result && typeof x.result.bank === "number");

    if (completed.length < 2) continue;

    const highest = Math.max(...completed.map((x) => x.result.bank));
    const winners = completed.filter((x) => x.result.bank === highest);
    const isThisWeek = keyToDate(dateKey) >= weekStart;

    for (const item of completed) {
      if (!stats[item.id]) continue;

      if (winners.length > 1) {
        stats[item.id].record.d += 1;
      } else if (winners[0].id === item.id) {
        stats[item.id].record.w += 1;
        stats[item.id].overallWins += 1;
        if (isThisWeek) stats[item.id].winsThisWeek += 1;
      } else {
        stats[item.id].record.l += 1;
      }
    }
  }

  for (const id of playerIds) {
    stats[id].streak = computeCurrentStreak(id, completedDates);
  }

  return stats;
}

function computeCurrentStreak(playerId, completedDates) {
  let currentType = null;
  let count = 0;
  const playerIds = state.players.map((p) => p.id);

  for (let i = completedDates.length - 1; i >= 0; i--) {
    const dateKey = completedDates[i];
    const byPlayer = state.results[dateKey] || {};
    const completed = playerIds
      .map((id) => ({ id, result: byPlayer[id] }))
      .filter((x) => x.result && typeof x.result.bank === "number");

    if (completed.length < 2 || !byPlayer[playerId]) continue;

    const highest = Math.max(...completed.map((x) => x.result.bank));
    const winners = completed.filter((x) => x.result.bank === highest);
    let type = "L";

    if (winners.length > 1) type = "D";
    else if (winners[0].id === playerId) type = "W";

    if (!currentType) {
      currentType = type;
      count = 1;
    } else if (currentType === type) {
      count += 1;
    } else {
      break;
    }
  }

  return currentType ? `${currentType}${count}` : "—";
}


function makeSafePlayerIdFromName(name) {
  const clean = String(name || "Player").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `shared_${clean || "player"}`;
}

function encodeScoreCode(result) {
  const safe = {
    app: "trivia-ladder",
    version: 2,
    dateKey: result.dateKey,
    playerName: result.playerName || "Player",
    bank: result.bank,
    completedAt: result.completedAt,
    answers: result.answers || [],
    final: result.final || {},
  };

  const json = JSON.stringify(safe);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeScoreCode(code) {
  const json = decodeURIComponent(escape(atob(String(code || "").trim())));
  const payload = JSON.parse(json);

  if (payload.app !== "trivia-ladder" || !payload.dateKey || !payload.playerName || typeof payload.bank !== "number") {
    throw new Error("Invalid Trivia Ladder score code.");
  }

  return payload;
}

function importScoreCode(code) {
  const payload = decodeScoreCode(code);
  const name = String(payload.playerName || "Player").trim();

  let player = state.players.find((p) => p.name.toLowerCase() === name.toLowerCase());
  if (!player) {
    player = {
      id: makeSafePlayerIdFromName(name),
      name,
      createdAt: new Date().toISOString(),
      imported: true,
    };

    let suffix = 2;
    while (state.players.some((p) => p.id === player.id)) {
      player.id = `${makeSafePlayerIdFromName(name)}-${suffix}`;
      suffix += 1;
    }

    state.players.push(player);
    persistPlayers();
  }

  const importedResult = {
    ...payload,
    playerId: player.id,
    playerName: player.name,
    importedAt: new Date().toISOString(),
  };

  if (!state.results[payload.dateKey]) state.results[payload.dateKey] = {};
  state.results[payload.dateKey][player.id] = importedResult;
  persistResults();

  return importedResult;
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } finally {
    textarea.remove();
  }
  return Promise.resolve();
}


function pageTitle(title, subtitle = "") {
  return `
    <div class="leaderboard-toolbar">
      <div>
        <span class="eyebrow">${formatDateLabel(todayKey())}</span>
        <h2>${title}</h2>
        ${subtitle ? `<p class="lede">${subtitle}</p>` : ""}
      </div>
    </div>
  `;
}

function renderHome() {
  clearTimer();
  state.route = "home";
  state.game = null;

  const player = activePlayer();
  const stats = computeStats();
  const activeStats = player ? stats[player.id] : null;
  const today = todayKey();
  const todayResults = state.results[today] || {};
  const set = dailySet(today);
  const activeResult = player ? playerResult(today, player.id) : null;

  const playerRows = state.players
    .map((p) => {
      const result = todayResults[p.id];
      return `
        <div class="player-chip">
          <div>
            <strong>${escapeHTML(p.name)}</strong>
            <span>${result ? `Today: ${money(result.bank)}` : "Not played yet today"}</span>
          </div>
          <span class="status-pill ${result ? "good" : ""}">${result ? "Done" : "Open"}</span>
        </div>
      `;
    })
    .join("");

  app.innerHTML = `
    <section class="hero">
      <div class="card hero-card">
        <span class="eyebrow">Tonight’s daily board</span>
        <h1>Tonight’s board is live.</h1>
        <p class="lede">
          Step up to today’s board: ${money(100)}, ${money(200)}, ${money(300)}, ${money(400)}, ${money(500)}, then a Final Ladder wager.
          Play on your phone, send your score code, and keep the head-to-head leaderboard alive.
        </p>
        <div class="hero-actions">
          ${
            player
              ? `<button class="primary-btn" id="startButton" type="button">${activeResult ? "View Today’s Result" : "Start Today’s Round"}</button>`
              : `<button class="primary-btn" id="choosePlayerButton" type="button">Choose Player</button>`
          }
          <button class="secondary-btn" id="homeLeaderboardButton" type="button">View Leaderboard</button>
        </div>

        <div class="quick-stats">
          <div class="mini-stat">
            <strong>${activeStats?.todayBank === null ? "—" : money(activeStats?.todayBank)}</strong>
            <span>Your today</span>
          </div>
          <div class="mini-stat">
            <strong>${activeStats ? `${activeStats.record.w}-${activeStats.record.d}-${activeStats.record.l}` : "—"}</strong>
            <span>Overall record</span>
          </div>
          <div class="mini-stat">
            <strong>${activeStats?.streak || "—"}</strong>
            <span>Current streak</span>
          </div>
        </div>
      </div>

      <aside class="side-stack">
        <div class="card side-card">
          <h3>Current player</h3>
          <div class="player-chip">
            <div>
              <strong>${player ? escapeHTML(player.name) : "No player selected"}</strong>
              <span>${player ? "This device will remember this player." : "Choose who is playing first."}</span>
            </div>
            <button class="ghost-btn" id="switchPlayerHome" type="button">Switch</button>
          </div>
        </div>

        <div class="card side-card">
          <h3>Today’s ladder</h3>
          <div class="ladder-preview">
            ${set.questions
              .map((q, index) => `<div class="rung"><span>Q${index + 1} · ${escapeHTML(q.category)}</span><strong>${money(q.value)}</strong></div>`)
              .join("")}
            <div class="rung"><span>Final · ${escapeHTML(set.final.category)}</span><strong>Wager</strong></div>
          </div>
        </div>

        <div class="card side-card">
          <h3>Phone matchup</h3>
          ${playerRows || `<p class="small-muted">Add players to start tracking the matchup.</p>`}
        </div>
      </aside>
    </section>
  `;

  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.addEventListener("click", () => {
      if (activeResult) renderResults(activeResult);
      else startGame();
    });
  }

  document.getElementById("homeLeaderboardButton").addEventListener("click", renderLeaderboard);
  document.getElementById("switchPlayerHome").addEventListener("click", renderPlayers);
  document.getElementById("choosePlayerButton")?.addEventListener("click", renderPlayers);
}

function renderPlayers() {
  clearTimer();
  state.route = "players";
  state.game = null;

  app.innerHTML = `
    <section class="card panel">
      ${pageTitle("Who’s playing?", "Pick your player once and this browser will remember it. You can add or rename players later in the code if you want.")}
      <div class="player-grid">
        ${state.players
          .map(
            (p) => `
            <button class="player-card ${p.id === state.activePlayerId ? "active" : ""}" data-player-id="${p.id}" type="button">
              <strong>${escapeHTML(p.name)}</strong>
              <small>${p.id === state.activePlayerId ? "Current player" : "Tap to switch"}</small>
            </button>
          `
          )
          .join("")}
      </div>

      <div class="add-player-form">
        <input class="text-input" id="newPlayerName" type="text" maxlength="28" placeholder="Add a player name" />
        <button class="primary-btn" id="addPlayerButton" type="button">Add Player</button>
      </div>

      <div class="row-actions" style="margin-top: 18px;">
        <button class="secondary-btn" id="backHomeButton" type="button">Back to Board</button>
      </div>
    </section>
  `;

  document.querySelectorAll(".player-card").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePlayerId = button.dataset.playerId;
      persistPlayers();
      showToast(`Player switched to ${activePlayer()?.name || "selected player"}.`);
      renderHome();
    });
  });

  document.getElementById("addPlayerButton").addEventListener("click", addPlayerFromInput);
  document.getElementById("newPlayerName").addEventListener("keydown", (event) => {
    if (event.key === "Enter") addPlayerFromInput();
  });
  document.getElementById("backHomeButton").addEventListener("click", renderHome);
}

function addPlayerFromInput() {
  const input = document.getElementById("newPlayerName");
  const name = input.value.trim();
  if (!name) {
    showToast("Enter a player name first.");
    return;
  }

  const player = { id: makeId(), name, createdAt: new Date().toISOString() };
  state.players.push(player);
  state.activePlayerId = player.id;
  persistPlayers();
  showToast(`${name} added.`);
  renderPlayers();
}

function startGame() {
  const player = activePlayer();
  if (!player) {
    renderPlayers();
    return;
  }

  const existing = playerResult(todayKey(), player.id);
  if (existing) {
    renderResults(existing);
    return;
  }

  const set = dailySet();
  state.game = {
    playerId: player.id,
    dateKey: set.dateKey,
    questions: set.questions,
    final: set.final,
    currentIndex: 0,
    bank: 0,
    answers: [],
    finalAnswer: null,
    phase: "question",
    locked: false,
    completed: false,
    timeLeft: QUESTION_SECONDS,
  };

  renderQuestion();
}

function renderQuestion() {
  clearTimer();
  const game = state.game;
  const question = game.questions[game.currentIndex];
  game.phase = "question";
  game.locked = false;
  game.timeLeft = QUESTION_SECONDS;

  app.innerHTML = `
    <section class="game-layout">
      <div class="card game-card">
        <div class="game-topbar">
          <div class="game-meta">
            <span class="meta-pill">Clue ${game.currentIndex + 1} of ${game.questions.length}</span>
            <span class="meta-pill">${escapeHTML(question.category)}</span>
            <span class="meta-pill money">Value <span class="question-value">${money(question.value)}</span></span>
          </div>
          <span class="meta-pill timer" id="timerPill">:${String(game.timeLeft).padStart(2, "0")}</span>
        </div>

        <h2 class="question-text">${escapeHTML(question.question)}</h2>

        <div class="answer-grid">
          ${question.options
            .map(
              (option, index) => `
                <button class="answer-btn" data-answer-index="${index}" type="button">
                  ${escapeHTML(option)}
                </button>
              `
            )
            .join("")}
        </div>

        <div id="feedbackSlot"></div>
      </div>

      ${renderLadderSidebar()}
    </section>
  `;

  document.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => handleAnswer(Number(button.dataset.answerIndex)));
  });

  startQuestionTimer();
}

function renderLadderSidebar() {
  const game = state.game;
  const rows = game.questions
    .map((q, index) => {
      const answer = game.answers[index];
      let cls = "";
      let label = money(q.value);

      if (index === game.currentIndex && game.phase === "question") cls = "current";
      if (answer) {
        cls = answer.correct ? "done" : "missed";
        label = answer.correct ? `+${money(q.value)}` : "$0";
      }

      return `<div class="progress-rung ${cls}"><span>Q${index + 1}</span><strong>${label}</strong></div>`;
    })
    .join("");

  return `
    <aside class="card ladder-card">
      <div class="bank-total">
        <span>Current Bank</span>
        <strong>${money(game.bank)}</strong>
      </div>
      <div class="ladder-progress">
        ${rows}
        <div class="progress-rung ${game.phase === "final" ? "current" : ""}"><span>Final Ladder</span><strong>Wager</strong></div>
      </div>
      <p class="small-muted" style="margin:14px 0 0;">
        Leaving the tab during a question forfeits that question.
      </p>
    </aside>
  `;
}

function startQuestionTimer() {
  clearTimer();

  state.timerId = setInterval(() => {
    if (!state.game || state.game.locked) return;
    state.game.timeLeft -= 1;

    const timerPill = document.getElementById("timerPill");
    if (timerPill) timerPill.textContent = `:${String(Math.max(state.game.timeLeft, 0)).padStart(2, "0")}`;

    if (state.game.timeLeft <= 0) {
      handleAnswer(null, "time");
    }
  }, 1000);
}

function handleAnswer(selectedIndex, reason = "answer") {
  const game = state.game;
  if (!game || game.locked) return;

  game.locked = true;
  clearTimer();

  const question = game.questions[game.currentIndex];
  const correct = selectedIndex === question.answerIndex;
  const earned = correct ? question.value : 0;
  game.bank += earned;

  game.answers[game.currentIndex] = {
    questionId: question.id,
    category: question.category,
    value: question.value,
    selectedIndex,
    correct,
    earned,
    reason,
  };

  document.querySelectorAll(".answer-btn").forEach((button) => {
    const idx = Number(button.dataset.answerIndex);
    button.disabled = true;
    if (idx === question.answerIndex) button.classList.add("correct");
    if (selectedIndex !== null && idx === selectedIndex && !correct) button.classList.add("wrong");
  });

  const feedbackSlot = document.getElementById("feedbackSlot");
  const headline = correct
    ? `Correct — you earned ${money(earned)}.`
    : reason === "time"
      ? "Time ran out — $0 earned."
      : reason === "tab"
        ? "Tab switch detected — this question is $0."
        : "Not quite — $0 earned.";

  feedbackSlot.innerHTML = `
    <div class="feedback ${correct ? "good" : "bad"}">
      <strong>${headline}</strong>
      <p>${escapeHTML(question.explanation)}</p>
      <button class="primary-btn" id="nextQuestionButton" type="button">
        ${game.currentIndex + 1 >= game.questions.length ? "Go to Final Ladder" : "Next Clue"}
      </button>
    </div>
  `;

  document.querySelector(".ladder-card")?.remove();
  document.querySelector(".game-layout")?.insertAdjacentHTML("beforeend", renderLadderSidebar());

  document.getElementById("nextQuestionButton").addEventListener("click", () => {
    if (game.currentIndex + 1 >= game.questions.length) {
      renderFinalSetup();
    } else {
      game.currentIndex += 1;
      renderQuestion();
    }
  });
}

function handleVisibilityForfeit() {
  const game = state.game;
  if (!game || game.locked) return;

  if (game.phase === "final") {
    handleFinalAnswer(null, "tab");
  } else {
    handleAnswer(null, "tab");
  }
}

function renderFinalSetup() {
  clearTimer();
  const game = state.game;
  game.phase = "final-setup";
  game.locked = true;

  app.innerHTML = `
    <section class="card final-card">
      <span class="eyebrow">Final Ladder</span>
      <h2>Make your wager.</h2>
      <p class="lede">
        You have ${money(game.bank)} in your bank. Wager any amount from ${money(0)} to ${money(game.bank)}.
        Correct adds the wager. Wrong subtracts it.
      </p>

      <div class="wager-box">
        <label for="wagerInput"><strong>Your wager</strong></label>
        <div class="wager-row">
          <input class="text-input" id="wagerInput" type="number" min="0" max="${game.bank}" step="100" value="${Math.min(500, game.bank)}" />
          <button class="primary-btn" id="lockWagerButton" type="button">Lock Wager</button>
        </div>
        <div class="choice-row">
          <button class="choice-pill" data-wager="0" type="button">${money(0)}</button>
          <button class="choice-pill" data-wager="${Math.floor(game.bank / 2)}" type="button">Half</button>
          <button class="choice-pill" data-wager="${game.bank}" type="button">All In</button>
        </div>
      </div>

      <div class="row-actions">
        <button class="secondary-btn" id="skipFinalButton" type="button">Skip Final and Save ${money(game.bank)}</button>
      </div>
    </section>
  `;

  const wagerInput = document.getElementById("wagerInput");
  document.querySelectorAll("[data-wager]").forEach((button) => {
    button.addEventListener("click", () => {
      wagerInput.value = button.dataset.wager;
    });
  });

  document.getElementById("lockWagerButton").addEventListener("click", () => {
    const wager = clampWager(Number(wagerInput.value || 0), game.bank);
    game.finalWager = wager;
    renderFinalQuestion();
  });

  document.getElementById("skipFinalButton").addEventListener("click", () => {
    game.finalWager = 0;
    saveCompletedGame({
      selectedIndex: null,
      correct: false,
      wager: 0,
      reason: "skipped",
      earned: 0,
    });
  });
}

function clampWager(wager, bank) {
  if (!Number.isFinite(wager)) return 0;
  return Math.max(0, Math.min(bank, Math.round(wager)));
}

function renderFinalQuestion() {
  clearTimer();
  const game = state.game;
  game.phase = "final";
  game.locked = false;
  game.timeLeft = FINAL_SECONDS;
  const final = game.final;

  app.innerHTML = `
    <section class="game-layout">
      <div class="card game-card">
        <div class="game-topbar">
          <div class="game-meta">
            <span class="meta-pill">Final Ladder</span>
            <span class="meta-pill">${escapeHTML(final.category)}</span>
            <span class="meta-pill money">Wager <span class="question-value">${money(game.finalWager)}</span></span>
          </div>
          <span class="meta-pill timer" id="timerPill">:${String(game.timeLeft).padStart(2, "0")}</span>
        </div>

        <h2 class="question-text">${escapeHTML(final.question)}</h2>

        <div class="answer-grid">
          ${final.options
            .map(
              (option, index) => `
                <button class="answer-btn" data-answer-index="${index}" type="button">
                  ${escapeHTML(option)}
                </button>
              `
            )
            .join("")}
        </div>

        <div id="feedbackSlot"></div>
      </div>

      <aside class="card ladder-card">
        <div class="bank-total">
          <span>Bank Before Final</span>
          <strong>${money(game.bank)}</strong>
        </div>
        <div class="ladder-progress">
          <div class="progress-rung current"><span>Wager</span><strong>${money(game.finalWager)}</strong></div>
          <div class="progress-rung"><span>Correct</span><strong>+${money(game.finalWager)}</strong></div>
          <div class="progress-rung missed"><span>Wrong</span><strong>-${money(game.finalWager)}</strong></div>
        </div>
        <p class="small-muted" style="margin:14px 0 0;">
          Leaving the tab during Final Ladder counts as incorrect.
        </p>
      </aside>
    </section>
  `;

  document.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => handleFinalAnswer(Number(button.dataset.answerIndex)));
  });

  startFinalTimer();
}

function startFinalTimer() {
  clearTimer();

  state.timerId = setInterval(() => {
    if (!state.game || state.game.locked) return;
    state.game.timeLeft -= 1;

    const timerPill = document.getElementById("timerPill");
    if (timerPill) timerPill.textContent = `:${String(Math.max(state.game.timeLeft, 0)).padStart(2, "0")}`;

    if (state.game.timeLeft <= 0) {
      handleFinalAnswer(null, "time");
    }
  }, 1000);
}

function handleFinalAnswer(selectedIndex, reason = "answer") {
  const game = state.game;
  if (!game || game.locked) return;

  game.locked = true;
  clearTimer();

  const final = game.final;
  const correct = selectedIndex === final.answerIndex;
  const earned = correct ? game.finalWager : -game.finalWager;
  const finalBank = Math.max(0, game.bank + earned);

  document.querySelectorAll(".answer-btn").forEach((button) => {
    const idx = Number(button.dataset.answerIndex);
    button.disabled = true;
    if (idx === final.answerIndex) button.classList.add("correct");
    if (selectedIndex !== null && idx === selectedIndex && !correct) button.classList.add("wrong");
  });

  const feedbackSlot = document.getElementById("feedbackSlot");
  const headline = correct
    ? `Correct — you added ${money(game.finalWager)}.`
    : reason === "time"
      ? `Time ran out — you lost ${money(game.finalWager)}.`
      : reason === "tab"
        ? `Tab switch detected — Final Ladder is incorrect and you lost ${money(game.finalWager)}.`
        : `Wrong — you lost ${money(game.finalWager)}.`;

  feedbackSlot.innerHTML = `
    <div class="feedback ${correct ? "good" : "bad"}">
      <strong>${headline}</strong>
      <p>${escapeHTML(final.explanation)}</p>
      <button class="primary-btn" id="saveResultButton" type="button">Save Result</button>
    </div>
  `;

  document.getElementById("saveResultButton").addEventListener("click", () => {
    saveCompletedGame({
      selectedIndex,
      correct,
      wager: game.finalWager,
      reason,
      earned,
      finalBank,
    });
  });
}

function saveCompletedGame(finalAnswer) {
  const game = state.game;
  const player = activePlayer();
  if (!game || !player) return;

  const bank = typeof finalAnswer.finalBank === "number"
    ? finalAnswer.finalBank
    : Math.max(0, game.bank + (finalAnswer.earned || 0));

  const result = {
    playerId: player.id,
    playerName: player.name,
    dateKey: game.dateKey,
    bank,
    completedAt: new Date().toISOString(),
    answers: game.answers,
    final: {
      questionId: game.final.id,
      category: game.final.category,
      wager: finalAnswer.wager || 0,
      selectedIndex: finalAnswer.selectedIndex,
      correct: finalAnswer.correct,
      reason: finalAnswer.reason,
      earned: finalAnswer.earned || 0,
    },
  };

  if (!state.results[game.dateKey]) state.results[game.dateKey] = {};
  state.results[game.dateKey][player.id] = result;
  persistResults();

  game.completed = true;
  state.game = null;

  showToast("Result saved.");
  renderResults(result);
}

function renderResults(result) {
  clearTimer();
  state.route = "results";
  state.game = null;

  const today = todayKey();
  const todayResults = state.results[today] || {};
  const completedPlayers = state.players
    .map((p) => ({ player: p, result: todayResults[p.id] }))
    .filter((x) => x.result);

  let matchupMessage = "Waiting for the other player to finish today’s round.";
  if (completedPlayers.length >= 2) {
    const highest = Math.max(...completedPlayers.map((x) => x.result.bank));
    const winners = completedPlayers.filter((x) => x.result.bank === highest);
    if (winners.length > 1) {
      matchupMessage = `Today is currently a draw at ${money(highest)}.`;
    } else {
      matchupMessage = `${winners[0].player.name} is today’s winner with ${money(highest)}.`;
    }
  }

  const answerRows = (result.answers || [])
    .map((a, idx) => {
      const reason = a.correct ? "Correct" : a.reason === "tab" ? "Forfeit" : a.reason === "time" ? "Timed out" : "Missed";
      return `<div class="progress-rung ${a.correct ? "done" : "missed"}"><span>Q${idx + 1} · ${escapeHTML(a.category)} · ${reason}</span><strong>${money(a.earned)}</strong></div>`;
    })
    .join("");

  app.innerHTML = `
    <section class="card panel result-hero">
      <span class="eyebrow">${formatDateLabel(result.dateKey)}</span>
      <h2>${escapeHTML(result.playerName || activePlayer()?.name || "Player")}’s Final Bank</h2>
      <div class="big-money">${money(result.bank)}</div>

      <div class="matchup-banner">
        <strong>${escapeHTML(matchupMessage)}</strong>
      </div>

      <div class="results-grid">
        <div class="stat-card">
          <strong>${money(result.final?.wager || 0)}</strong>
          <span>Final wager</span>
        </div>
        <div class="stat-card">
          <strong>${result.final?.correct ? "Correct" : result.final?.reason === "skipped" ? "Skipped" : "Missed"}</strong>
          <span>Final result</span>
        </div>
        <div class="stat-card">
          <strong>${completedPlayers.length}/${state.players.length}</strong>
          <span>Players done today</span>
        </div>
      </div>

      <div class="card side-card" style="text-align:left; box-shadow:none;">
        <h3>Round breakdown</h3>
        <div class="ladder-progress">
          ${answerRows}
          <div class="progress-rung ${result.final?.correct ? "done" : "missed"}">
            <span>Final Ladder · ${escapeHTML(result.final?.category || "Final")}</span>
            <strong>${result.final?.earned >= 0 ? "+" : ""}${money(result.final?.earned || 0)}</strong>
          </div>
        </div>
      </div>

      <div class="share-card">
        <h3>Playing on separate phones?</h3>
        <p class="small-muted">Send this score code by text. The other phone can paste it on the leaderboard to add your result.</p>
        <textarea class="score-code" id="scoreCodeBox" readonly>${encodeScoreCode(result)}</textarea>
        <div class="row-actions" style="justify-content:center;">
          <button class="primary-btn" id="copyScoreCodeButton" type="button">Copy Score Code</button>
        </div>
      </div>

      <div class="row-actions" style="justify-content:center; margin-top:20px;">
        <button class="primary-btn" id="resultsLeaderboardButton" type="button">View Leaderboard</button>
        <button class="secondary-btn" id="resultsHomeButton" type="button">Back to Board</button>
        <button class="danger-btn" id="resetTodayButton" type="button">Reset My Today Score</button>
      </div>
    </section>
  `;

  document.getElementById("copyScoreCodeButton").addEventListener("click", async () => {
    const code = document.getElementById("scoreCodeBox").value;
    await copyTextToClipboard(code);
    showToast("Score code copied.");
  });
  document.getElementById("resultsLeaderboardButton").addEventListener("click", renderLeaderboard);
  document.getElementById("resultsHomeButton").addEventListener("click", renderHome);
  document.getElementById("resetTodayButton").addEventListener("click", () => {
    const player = activePlayer();
    if (!player) return;
    if (state.results[today]?.[player.id]) {
      delete state.results[today][player.id];
      persistResults();
      showToast("Today’s score reset for testing.");
      renderHome();
    }
  });
}

function renderLeaderboard() {
  clearTimer();
  state.route = "leaderboard";
  state.game = null;

  const stats = computeStats();
  const sorted = Object.values(stats).sort((a, b) => {
    const todayDiff = (b.todayBank ?? -1) - (a.todayBank ?? -1);
    if (todayDiff !== 0) return todayDiff;
    return b.lifetimeBank - a.lifetimeBank;
  });

  const rows = sorted
    .map((s, index) => {
      const record = `${s.record.w}-${s.record.d}-${s.record.l}`;
      return `
        <tr>
          <td><span class="rank-badge">${index + 1}</span><strong>${escapeHTML(s.player.name)}</strong></td>
          <td class="money-cell">${s.todayBank === null ? "—" : money(s.todayBank)}</td>
          <td><strong>${record}</strong></td>
          <td><strong>${s.streak}</strong></td>
          <td>${s.winsThisWeek}</td>
          <td>${s.overallWins}</td>
          <td class="money-cell">${money(s.lifetimeBank)}</td>
          <td class="money-cell">${money(s.bestDay)}</td>
          <td>${s.daysPlayed}</td>
        </tr>
      `;
    })
    .join("");

  const todayResults = state.results[todayKey()] || {};
  const todayCompleted = Object.keys(todayResults).length;
  let todayLeader = "No scores yet";
  if (todayCompleted) {
    const complete = state.players
      .map((p) => ({ player: p, result: todayResults[p.id] }))
      .filter((x) => x.result);
    const high = Math.max(...complete.map((x) => x.result.bank));
    const winners = complete.filter((x) => x.result.bank === high);
    todayLeader = winners.length > 1
      ? `Draw at ${money(high)}`
      : `${winners[0].player.name} leads with ${money(high)}`;
  }

  app.innerHTML = `
    <section class="card panel">
      ${pageTitle("Leaderboard", "Track today’s bank, head-to-head record, current streaks, weekly wins, overall wins, and lifetime money.")}

      <div class="stat-grid">
        <div class="stat-card">
          <strong>${escapeHTML(todayLeader)}</strong>
          <span>Today’s matchup</span>
        </div>
        <div class="stat-card">
          <strong>${todayCompleted}/${state.players.length}</strong>
          <span>Players done today</span>
        </div>
        <div class="stat-card">
          <strong>${money(sorted.reduce((sum, s) => sum + s.lifetimeBank, 0))}</strong>
          <span>Combined lifetime bank</span>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Today</th>
              <th>Overall Record</th>
              <th>Current Streak</th>
              <th>Wins This Week</th>
              <th>Overall Wins</th>
              <th>Lifetime Bank</th>
              <th>Best Day</th>
              <th>Days Played</th>
            </tr>
          </thead>
          <tbody>
            ${rows || `<tr><td colspan="9"><div class="empty-state">No players yet.</div></td></tr>`}
          </tbody>
        </table>
      </div>

      <div class="import-card">
        <h3>Import a score from another phone</h3>
        <p class="small-muted">Paste the score code your opponent sent you, then import it to update this phone’s leaderboard.</p>
        <textarea class="score-code" id="importScoreCodeBox" placeholder="Paste score code here"></textarea>
        <div class="row-actions">
          <button class="primary-btn" id="importScoreButton" type="button">Import Score</button>
        </div>
      </div>

      <div class="row-actions" style="margin-top:18px;">
        <button class="primary-btn" id="leaderboardHomeButton" type="button">Back to Board</button>
        <button class="secondary-btn" id="leaderboardPlayerButton" type="button">Switch Player</button>
        <button class="danger-btn" id="clearDataButton" type="button">Clear All Saved Data</button>
      </div>
    </section>
  `;

  document.getElementById("importScoreButton").addEventListener("click", () => {
    const code = document.getElementById("importScoreCodeBox").value.trim();
    if (!code) {
      showToast("Paste a score code first.");
      return;
    }

    try {
      const imported = importScoreCode(code);
      showToast(`${imported.playerName}'s ${money(imported.bank)} score was imported.`);
      renderLeaderboard();
    } catch (error) {
      showToast("That score code did not work. Try copying it again.");
    }
  });
  document.getElementById("leaderboardHomeButton").addEventListener("click", renderHome);
  document.getElementById("leaderboardPlayerButton").addEventListener("click", renderPlayers);
  document.getElementById("clearDataButton").addEventListener("click", () => {
    const confirmed = window.confirm("Clear all saved players and scores from this browser?");
    if (!confirmed) return;
    localStorage.removeItem(STORAGE_KEYS.players);
    localStorage.removeItem(STORAGE_KEYS.activePlayer);
    localStorage.removeItem(STORAGE_KEYS.results);
    state.players = [];
    state.results = {};
    state.activePlayerId = null;
    init();
    showToast("Saved data cleared.");
  });
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();
