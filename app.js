import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { USE_SUPABASE, APP_ROOM_ID, supabaseUrl, supabaseAnonKey } from "./supabase-config.js";

const STORAGE_KEYS = {
  players: "triviaLadder.players.v11",
  activePlayer: "triviaLadder.activePlayer.v11",
  results: "triviaLadder.results.v11",
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



const EXTRA_QUESTION_BANK = {
  "100": [
    {
      "id": "100-space-jupiter",
      "category": "Space",
      "difficulty": "Easy",
      "question": "Which planet is the largest in our solar system?",
      "options": [
        "Earth",
        "Jupiter",
        "Mars",
        "Venus"
      ],
      "answerIndex": 1,
      "explanation": "Jupiter is the largest planet in our solar system."
    },
    {
      "id": "100-animals-panda",
      "category": "Animals",
      "difficulty": "Easy",
      "question": "What type of animal is a giant panda?",
      "options": [
        "Bear",
        "Cat",
        "Dog",
        "Rabbit"
      ],
      "answerIndex": 0,
      "explanation": "The giant panda is a bear."
    },
    {
      "id": "100-geography-france",
      "category": "Geography",
      "difficulty": "Easy",
      "question": "Paris is the capital of which country?",
      "options": [
        "Spain",
        "France",
        "Italy",
        "Germany"
      ],
      "answerIndex": 1,
      "explanation": "Paris is the capital city of France."
    },
    {
      "id": "100-science-mars",
      "category": "Science",
      "difficulty": "Easy",
      "question": "Which planet is often called the Red Planet?",
      "options": [
        "Mercury",
        "Mars",
        "Saturn",
        "Neptune"
      ],
      "answerIndex": 1,
      "explanation": "Mars is known as the Red Planet because of its reddish appearance."
    },
    {
      "id": "100-sports-nba",
      "category": "Sports",
      "difficulty": "Easy",
      "question": "How many points is a made free throw worth in basketball?",
      "options": [
        "1",
        "2",
        "3",
        "4"
      ],
      "answerIndex": 0,
      "explanation": "A made free throw is worth 1 point."
    },
    {
      "id": "100-food-sushi",
      "category": "Food",
      "difficulty": "Easy",
      "question": "Sushi is most strongly associated with which country?",
      "options": [
        "Japan",
        "Brazil",
        "Mexico",
        "Egypt"
      ],
      "answerIndex": 0,
      "explanation": "Sushi is a traditional Japanese food."
    },
    {
      "id": "100-music-piano",
      "category": "Music",
      "difficulty": "Easy",
      "question": "A piano is played using which of these?",
      "options": [
        "Keys",
        "Drumsticks",
        "A bow",
        "A pick"
      ],
      "answerIndex": 0,
      "explanation": "A piano is played by pressing keys."
    },
    {
      "id": "100-language-hola",
      "category": "Language",
      "difficulty": "Easy",
      "question": "In Spanish, what does 'hola' mean?",
      "options": [
        "Goodbye",
        "Thank you",
        "Hello",
        "Please"
      ],
      "answerIndex": 2,
      "explanation": "'Hola' means hello in Spanish."
    },
    {
      "id": "100-tech-keyboard",
      "category": "Technology",
      "difficulty": "Easy",
      "question": "Which device is commonly used to type letters into a computer?",
      "options": [
        "Keyboard",
        "Speaker",
        "Monitor",
        "Router"
      ],
      "answerIndex": 0,
      "explanation": "A keyboard is commonly used for typing."
    },
    {
      "id": "100-bible-ark",
      "category": "Bible",
      "difficulty": "Easy",
      "question": "Who built the ark in the book of Genesis?",
      "options": [
        "Noah",
        "Moses",
        "David",
        "Peter"
      ],
      "answerIndex": 0,
      "explanation": "Noah built the ark in Genesis."
    }
  ],
  "200": [
    {
      "id": "200-space-moon",
      "category": "Space",
      "difficulty": "Medium",
      "question": "Roughly how long does it take the Moon to orbit Earth?",
      "options": [
        "1 day",
        "7 days",
        "27 days",
        "365 days"
      ],
      "answerIndex": 2,
      "explanation": "The Moon takes about 27 days to orbit Earth."
    },
    {
      "id": "200-science-gold",
      "category": "Science",
      "difficulty": "Medium",
      "question": "What is the chemical symbol for gold?",
      "options": [
        "Go",
        "Gd",
        "Au",
        "Ag"
      ],
      "answerIndex": 2,
      "explanation": "Gold's chemical symbol is Au."
    },
    {
      "id": "200-geography-nile",
      "category": "Geography",
      "difficulty": "Medium",
      "question": "The Nile River is most closely associated with which country?",
      "options": [
        "Egypt",
        "Canada",
        "India",
        "Spain"
      ],
      "answerIndex": 0,
      "explanation": "The Nile River is famously associated with Egypt."
    },
    {
      "id": "200-history-romulus",
      "category": "History",
      "difficulty": "Medium",
      "question": "According to legend, Rome was founded by Romulus and whom?",
      "options": [
        "Remus",
        "Caesar",
        "Nero",
        "Augustus"
      ],
      "answerIndex": 0,
      "explanation": "Roman legend says Rome was founded by Romulus and Remus."
    },
    {
      "id": "200-literature-holmes",
      "category": "Literature",
      "difficulty": "Medium",
      "question": "Sherlock Holmes was created by which author?",
      "options": [
        "Arthur Conan Doyle",
        "Charles Dickens",
        "Mark Twain",
        "Jules Verne"
      ],
      "answerIndex": 0,
      "explanation": "Arthur Conan Doyle created Sherlock Holmes."
    },
    {
      "id": "200-sports-golf",
      "category": "Sports",
      "difficulty": "Medium",
      "question": "In golf, what is the term for one stroke under par on a hole?",
      "options": [
        "Birdie",
        "Bogey",
        "Eagle",
        "Double"
      ],
      "answerIndex": 0,
      "explanation": "A birdie is one stroke under par."
    },
    {
      "id": "200-music-mozart",
      "category": "Music",
      "difficulty": "Medium",
      "question": "Wolfgang Amadeus Mozart is most associated with which type of music?",
      "options": [
        "Classical",
        "Jazz",
        "Hip-hop",
        "Country"
      ],
      "answerIndex": 0,
      "explanation": "Mozart is one of the most famous composers of classical music."
    },
    {
      "id": "200-food-paella",
      "category": "Food",
      "difficulty": "Medium",
      "question": "Paella is a famous rice dish from which country?",
      "options": [
        "Spain",
        "Greece",
        "Thailand",
        "Morocco"
      ],
      "answerIndex": 0,
      "explanation": "Paella is a traditional Spanish rice dish."
    },
    {
      "id": "200-language-bonjour",
      "category": "Language",
      "difficulty": "Medium",
      "question": "In French, what does 'bonjour' mean?",
      "options": [
        "Good morning",
        "Good night",
        "Thank you",
        "Excuse me"
      ],
      "answerIndex": 0,
      "explanation": "'Bonjour' is commonly used to mean hello or good morning in French."
    },
    {
      "id": "200-bible-goliath",
      "category": "Bible",
      "difficulty": "Medium",
      "question": "Who defeated Goliath in the Bible?",
      "options": [
        "David",
        "Samson",
        "Joshua",
        "Solomon"
      ],
      "answerIndex": 0,
      "explanation": "David defeated Goliath."
    }
  ],
  "300": [
    {
      "id": "300-space-galaxy",
      "category": "Space",
      "difficulty": "Hard",
      "question": "What is the name of the galaxy that contains our solar system?",
      "options": [
        "Andromeda",
        "Milky Way",
        "Sombrero",
        "Whirlpool"
      ],
      "answerIndex": 1,
      "explanation": "Our solar system is located in the Milky Way galaxy."
    },
    {
      "id": "300-science-sodium",
      "category": "Science",
      "difficulty": "Hard",
      "question": "What is the chemical symbol for sodium?",
      "options": [
        "So",
        "S",
        "Na",
        "Sn"
      ],
      "answerIndex": 2,
      "explanation": "Sodium's chemical symbol is Na."
    },
    {
      "id": "300-geography-danube",
      "category": "Geography",
      "difficulty": "Hard",
      "question": "The Danube River flows through which of these capital cities?",
      "options": [
        "Vienna",
        "Madrid",
        "Oslo",
        "Dublin"
      ],
      "answerIndex": 0,
      "explanation": "The Danube flows through Vienna, Austria."
    },
    {
      "id": "300-history-hastings",
      "category": "History",
      "difficulty": "Hard",
      "question": "The Battle of Hastings took place in which year?",
      "options": [
        "1066",
        "1215",
        "1492",
        "1776"
      ],
      "answerIndex": 0,
      "explanation": "The Battle of Hastings took place in 1066."
    },
    {
      "id": "300-literature-orwell",
      "category": "Literature",
      "difficulty": "Hard",
      "question": "Who wrote Animal Farm?",
      "options": [
        "George Orwell",
        "Aldous Huxley",
        "Ernest Hemingway",
        "F. Scott Fitzgerald"
      ],
      "answerIndex": 0,
      "explanation": "George Orwell wrote Animal Farm."
    },
    {
      "id": "300-sports-nfl",
      "category": "Sports",
      "difficulty": "Hard",
      "question": "In the NFL, how many points is a safety worth?",
      "options": [
        "1",
        "2",
        "3",
        "6"
      ],
      "answerIndex": 1,
      "explanation": "A safety is worth 2 points in football."
    },
    {
      "id": "300-art-starry",
      "category": "Art",
      "difficulty": "Hard",
      "question": "Who painted The Starry Night?",
      "options": [
        "Vincent van Gogh",
        "Claude Monet",
        "Pablo Picasso",
        "Salvador Dali"
      ],
      "answerIndex": 0,
      "explanation": "Vincent van Gogh painted The Starry Night."
    },
    {
      "id": "300-music-fifth",
      "category": "Music",
      "difficulty": "Hard",
      "question": "Which composer wrote Symphony No. 5 in C minor?",
      "options": [
        "Beethoven",
        "Bach",
        "Vivaldi",
        "Chopin"
      ],
      "answerIndex": 0,
      "explanation": "Beethoven wrote Symphony No. 5 in C minor."
    },
    {
      "id": "300-mythology-thor",
      "category": "Mythology",
      "difficulty": "Hard",
      "question": "In Norse mythology, what is the name of Thor's hammer?",
      "options": [
        "Mjolnir",
        "Gungnir",
        "Excalibur",
        "Aegis"
      ],
      "answerIndex": 0,
      "explanation": "Thor's hammer is called Mjolnir."
    },
    {
      "id": "300-bible-paul",
      "category": "Bible",
      "difficulty": "Hard",
      "question": "Before he was known as Paul, what was the apostle Paul's name?",
      "options": [
        "Saul",
        "Simon",
        "Silas",
        "Stephen"
      ],
      "answerIndex": 0,
      "explanation": "Paul was previously known as Saul."
    }
  ],
  "400": [
    {
      "id": "400-space-titan",
      "category": "Space",
      "difficulty": "Harder",
      "question": "Titan is the largest moon of which planet?",
      "options": [
        "Saturn",
        "Jupiter",
        "Mars",
        "Uranus"
      ],
      "answerIndex": 0,
      "explanation": "Titan is Saturn's largest moon."
    },
    {
      "id": "400-science-mitochondria",
      "category": "Science",
      "difficulty": "Harder",
      "question": "Mitochondria are best known for producing what cells use for energy?",
      "options": [
        "ATP",
        "DNA",
        "Chlorophyll",
        "Insulin"
      ],
      "answerIndex": 0,
      "explanation": "Mitochondria produce ATP, the main energy currency of cells."
    },
    {
      "id": "400-geography-malacca",
      "category": "Geography",
      "difficulty": "Harder",
      "question": "The Strait of Malacca lies between the Malay Peninsula and which island?",
      "options": [
        "Sumatra",
        "Borneo",
        "Java",
        "Sri Lanka"
      ],
      "answerIndex": 0,
      "explanation": "The Strait of Malacca lies between the Malay Peninsula and Sumatra."
    },
    {
      "id": "400-history-versailles",
      "category": "History",
      "difficulty": "Harder",
      "question": "The Treaty of Versailles formally ended World War I between Germany and the Allied Powers in what year?",
      "options": [
        "1918",
        "1919",
        "1920",
        "1921"
      ],
      "answerIndex": 1,
      "explanation": "The Treaty of Versailles was signed in 1919."
    },
    {
      "id": "400-literature-dante",
      "category": "Literature",
      "difficulty": "Harder",
      "question": "The Divine Comedy was written by which poet?",
      "options": [
        "Dante Alighieri",
        "Geoffrey Chaucer",
        "John Milton",
        "Virgil"
      ],
      "answerIndex": 0,
      "explanation": "Dante Alighieri wrote The Divine Comedy."
    },
    {
      "id": "400-sports-f1",
      "category": "Sports",
      "difficulty": "Harder",
      "question": "In Formula 1, what color flag usually signals danger ahead and no overtaking?",
      "options": [
        "Yellow",
        "Blue",
        "Green",
        "Checkered"
      ],
      "answerIndex": 0,
      "explanation": "A yellow flag signals danger and usually means no overtaking."
    },
    {
      "id": "400-art-sistine",
      "category": "Art",
      "difficulty": "Harder",
      "question": "Who painted the ceiling of the Sistine Chapel?",
      "options": [
        "Michelangelo",
        "Raphael",
        "Leonardo da Vinci",
        "Donatello"
      ],
      "answerIndex": 0,
      "explanation": "Michelangelo painted the Sistine Chapel ceiling."
    },
    {
      "id": "400-music-four-seasons",
      "category": "Music",
      "difficulty": "Harder",
      "question": "The Four Seasons was composed by whom?",
      "options": [
        "Antonio Vivaldi",
        "Johann Strauss",
        "Franz Liszt",
        "Gustav Mahler"
      ],
      "answerIndex": 0,
      "explanation": "The Four Seasons is a set of violin concertos by Antonio Vivaldi."
    },
    {
      "id": "400-language-esperanto",
      "category": "Language",
      "difficulty": "Harder",
      "question": "Esperanto was created as what type of language?",
      "options": [
        "Constructed international language",
        "Ancient Greek dialect",
        "Secret military code",
        "Regional Italian dialect"
      ],
      "answerIndex": 0,
      "explanation": "Esperanto is a constructed international auxiliary language."
    },
    {
      "id": "400-bible-revelation",
      "category": "Bible",
      "difficulty": "Harder",
      "question": "The book of Revelation is traditionally associated with which author?",
      "options": [
        "John",
        "Luke",
        "Moses",
        "Isaiah"
      ],
      "answerIndex": 0,
      "explanation": "Revelation is traditionally associated with John."
    }
  ],
  "500": [
    {
      "id": "500-space-ceres",
      "category": "Space",
      "difficulty": "Very Hard",
      "question": "Ceres is located in which region of the solar system?",
      "options": [
        "Asteroid belt",
        "Kuiper belt",
        "Oort cloud",
        "Saturn's rings"
      ],
      "answerIndex": 0,
      "explanation": "Ceres is the largest object in the asteroid belt."
    },
    {
      "id": "500-science-heisenberg",
      "category": "Science",
      "difficulty": "Very Hard",
      "question": "The uncertainty principle is most closely associated with which physicist?",
      "options": [
        "Werner Heisenberg",
        "Niels Bohr",
        "Max Planck",
        "Enrico Fermi"
      ],
      "answerIndex": 0,
      "explanation": "The uncertainty principle is associated with Werner Heisenberg."
    },
    {
      "id": "500-geography-urals",
      "category": "Geography",
      "difficulty": "Very Hard",
      "question": "The Ural Mountains are commonly considered part of the boundary between which two continents?",
      "options": [
        "Europe and Asia",
        "Asia and Africa",
        "Europe and Africa",
        "North and South America"
      ],
      "answerIndex": 0,
      "explanation": "The Urals are often considered part of the boundary between Europe and Asia."
    },
    {
      "id": "500-history-defenestration",
      "category": "History",
      "difficulty": "Very Hard",
      "question": "The Defenestration of Prague helped trigger which conflict?",
      "options": [
        "Thirty Years' War",
        "Crimean War",
        "War of 1812",
        "Spanish Civil War"
      ],
      "answerIndex": 0,
      "explanation": "The 1618 Defenestration of Prague helped trigger the Thirty Years' War."
    },
    {
      "id": "500-literature-mock-epic",
      "category": "Literature",
      "difficulty": "Very Hard",
      "question": "The Rape of the Lock is a mock-epic poem by which writer?",
      "options": [
        "Alexander Pope",
        "John Donne",
        "Samuel Johnson",
        "William Blake"
      ],
      "answerIndex": 0,
      "explanation": "Alexander Pope wrote The Rape of the Lock."
    },
    {
      "id": "500-sports-olympics",
      "category": "Sports",
      "difficulty": "Very Hard",
      "question": "The first modern Olympic Games were held in which city?",
      "options": [
        "Athens",
        "Paris",
        "London",
        "Rome"
      ],
      "answerIndex": 0,
      "explanation": "The first modern Olympics were held in Athens in 1896."
    },
    {
      "id": "500-art-baroque",
      "category": "Art",
      "difficulty": "Very Hard",
      "question": "The artist Caravaggio is most closely associated with which art movement?",
      "options": [
        "Baroque",
        "Impressionism",
        "Cubism",
        "Surrealism"
      ],
      "answerIndex": 0,
      "explanation": "Caravaggio is strongly associated with Baroque art."
    },
    {
      "id": "500-music-rite",
      "category": "Music",
      "difficulty": "Very Hard",
      "question": "The Rite of Spring was composed by whom?",
      "options": [
        "Igor Stravinsky",
        "Claude Debussy",
        "Sergei Rachmaninoff",
        "Giacomo Puccini"
      ],
      "answerIndex": 0,
      "explanation": "Igor Stravinsky composed The Rite of Spring."
    },
    {
      "id": "500-language-rosetta",
      "category": "Language",
      "difficulty": "Very Hard",
      "question": "The Rosetta Stone helped scholars decipher which ancient writing system?",
      "options": [
        "Egyptian hieroglyphs",
        "Cuneiform",
        "Linear B",
        "Runes"
      ],
      "answerIndex": 0,
      "explanation": "The Rosetta Stone was key to deciphering Egyptian hieroglyphs."
    },
    {
      "id": "500-bible-pentateuch",
      "category": "Bible",
      "difficulty": "Very Hard",
      "question": "The Pentateuch traditionally refers to how many books?",
      "options": [
        "Five",
        "Seven",
        "Ten",
        "Twelve"
      ],
      "answerIndex": 0,
      "explanation": "The Pentateuch refers to the first five books of the Bible."
    }
  ]
};

for (const value of QUESTION_VALUES) {
  QUESTION_BANK[value].push(...(EXTRA_QUESTION_BANK[value] || []));
}

const EXTRA_FINAL_BANK = [
  {
    "id": "final-space-lightyear",
    "category": "Space",
    "question": "A light-year measures which of these?",
    "options": [
      "Distance",
      "Time",
      "Mass",
      "Temperature"
    ],
    "answerIndex": 0,
    "explanation": "A light-year is a unit of distance."
  },
  {
    "id": "final-science-dna",
    "category": "Science",
    "question": "DNA stands for which phrase?",
    "options": [
      "Deoxyribonucleic acid",
      "Dynamic nitrogen atom",
      "Double neutral acid",
      "Digital nucleic array"
    ],
    "answerIndex": 0,
    "explanation": "DNA stands for deoxyribonucleic acid."
  },
  {
    "id": "final-history-louisiana",
    "category": "U.S. History",
    "question": "The Louisiana Purchase was made during which U.S. president's administration?",
    "options": [
      "Thomas Jefferson",
      "John Adams",
      "Andrew Jackson",
      "James Monroe"
    ],
    "answerIndex": 0,
    "explanation": "The Louisiana Purchase occurred under Thomas Jefferson."
  },
  {
    "id": "final-geography-caspian",
    "category": "Geography",
    "question": "The Caspian Sea is often described as the world's largest what?",
    "options": [
      "Inland body of water",
      "Ocean gulf",
      "Freshwater lake",
      "Coral reef"
    ],
    "answerIndex": 0,
    "explanation": "The Caspian Sea is the world's largest inland body of water."
  },
  {
    "id": "final-literature-melville",
    "category": "Literature",
    "question": "Who wrote Moby-Dick?",
    "options": [
      "Herman Melville",
      "Nathaniel Hawthorne",
      "Walt Whitman",
      "Edgar Allan Poe"
    ],
    "answerIndex": 0,
    "explanation": "Herman Melville wrote Moby-Dick."
  },
  {
    "id": "final-sports-marathon",
    "category": "Sports",
    "question": "A standard marathon is approximately how many miles?",
    "options": [
      "26.2",
      "13.1",
      "20.0",
      "30.0"
    ],
    "answerIndex": 0,
    "explanation": "A marathon is approximately 26.2 miles."
  },
  {
    "id": "final-art-mona",
    "category": "Art",
    "question": "The Mona Lisa is housed in which museum?",
    "options": [
      "The Louvre",
      "The Prado",
      "The Uffizi",
      "The Met"
    ],
    "answerIndex": 0,
    "explanation": "The Mona Lisa is housed in the Louvre."
  },
  {
    "id": "final-music-hallelujah",
    "category": "Music",
    "question": "The Hallelujah Chorus is from which oratorio?",
    "options": [
      "Messiah",
      "The Creation",
      "Elijah",
      "St. Matthew Passion"
    ],
    "answerIndex": 0,
    "explanation": "The Hallelujah Chorus is from Handel's Messiah."
  },
  {
    "id": "final-bible-proverbs",
    "category": "Bible",
    "question": "The book of Proverbs is traditionally associated with which king?",
    "options": [
      "Solomon",
      "Saul",
      "Herod",
      "Ahab"
    ],
    "answerIndex": 0,
    "explanation": "Proverbs is traditionally associated with Solomon."
  },
  {
    "id": "final-tech-url",
    "category": "Technology",
    "question": "In web addresses, what does URL stand for?",
    "options": [
      "Uniform Resource Locator",
      "Universal Router Link",
      "User Request Line",
      "Unified Runtime Label"
    ],
    "answerIndex": 0,
    "explanation": "URL stands for Uniform Resource Locator."
  }
];
FINAL_BANK.push(...EXTRA_FINAL_BANK);

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

function usedQuestionIdsBefore(dateKey) {
  const used = new Set();

  for (const [pastDateKey, byPlayer] of Object.entries(state.results || {})) {
    // Do not count today's questions as used, otherwise Ian and Shannon could get different boards on the same day.
    if (pastDateKey >= dateKey) continue;

    for (const result of Object.values(byPlayer || {})) {
      for (const answer of result.answers || []) {
        if (answer.questionId) used.add(answer.questionId);
      }

      if (result.final?.questionId) used.add(result.final.questionId);
    }
  }

  return used;
}

function dateSerial(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const current = Date.UTC(year, month - 1, day);
  const base = Date.UTC(2026, 0, 1);
  return Math.max(0, Math.floor((current - base) / 86400000));
}

function shuffledOptionSet(correct, wrongs, seed) {
  const items = [correct, ...wrongs].map(value => String(value));
  const options = [...items].sort((a, b) => hashString(`${seed}-${a}`) - hashString(`${seed}-${b}`));
  return { options, answerIndex: options.indexOf(String(correct)) };
}

function generatedFallbackQuestion(value, dateKey) {
  const n = dateSerial(dateKey) + value;
  let category = "Daily Puzzle";
  let difficulty = "Easy";
  let question = "";
  let correct = 0;
  let wrongs = [];

  if (value === 100) {
    category = "Quick Math";
    difficulty = "Easy";
    const a = 8 + (n % 17);
    const b = 6 + ((n * 3) % 15);
    correct = a + b;
    wrongs = [correct + 1, correct - 2, correct + 4];
    question = `What is ${a} + ${b}?`;
  } else if (value === 200) {
    category = "Number Sense";
    difficulty = "Medium";
    const a = 4 + (n % 9);
    const b = 5 + ((n * 5) % 8);
    correct = a * b;
    wrongs = [correct + a, correct - b, correct + 10];
    question = `What is ${a} × ${b}?`;
  } else if (value === 300) {
    category = "Squares";
    difficulty = "Hard";
    const a = 8 + (n % 18);
    correct = a * a;
    wrongs = [(a + 1) * (a + 1), (a - 1) * (a - 1), correct + a];
    question = `What is ${a} squared?`;
  } else if (value === 400) {
    category = "Patterns";
    difficulty = "Harder";
    const start = 3 + (n % 11);
    const step = 4 + ((n * 7) % 9);
    correct = start + step * 4;
    wrongs = [correct + step, correct - step, correct + 2];
    question = `What comes next in this pattern: ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, ?`;
  } else {
    category = "Mental Math";
    difficulty = "Very Hard";
    const a = 11 + (n % 13);
    const b = 6 + ((n * 5) % 9);
    const c = 9 + ((n * 7) % 19);
    correct = a * b + c;
    wrongs = [a * b - c, correct + b, correct - a];
    question = `What is (${a} × ${b}) + ${c}?`;
  }

  const { options, answerIndex } = shuffledOptionSet(correct, wrongs, `${dateKey}-${value}-fallback`);
  return {
    id: `${value}-fallback-${dateKey}`,
    category,
    difficulty,
    question,
    options,
    answerIndex,
    explanation: `The correct answer is ${correct}.`,
    generated: true,
    value,
  };
}

function generatedFallbackFinal(dateKey) {
  const n = dateSerial(dateKey) + 900;
  const a = 7 + (n % 12);
  const b = 5 + ((n * 3) % 10);
  const c = 3 + ((n * 5) % 7);
  const d = 8 + ((n * 11) % 20);
  const correct = (a + b) * c - d;
  const wrongs = [correct + c, correct - b, correct + d];
  const { options, answerIndex } = shuffledOptionSet(correct, wrongs, `${dateKey}-final-fallback`);

  return {
    id: `final-fallback-${dateKey}`,
    category: "Final Puzzle",
    question: `What is (${a} + ${b}) × ${c} - ${d}?`,
    options,
    answerIndex,
    explanation: `First add ${a} + ${b}, then multiply by ${c}, then subtract ${d}. The answer is ${correct}.`,
    generated: true,
  };
}

function pickDailyQuestion(value, dateKey, usedCategories, usedQuestionIds, selectedQuestionIds) {
  const bank = QUESTION_BANK[value] || [];
  const shuffled = [...bank].sort((a, b) => hashString(`${dateKey}-${value}-${a.id}`) - hashString(`${dateKey}-${value}-${b.id}`));
  const unused = shuffled.filter(q => !usedQuestionIds.has(q.id) && !selectedQuestionIds.has(q.id));

  const selected =
    unused.find(q => !usedCategories.has(q.category)) ||
    unused[0] ||
    generatedFallbackQuestion(value, dateKey);

  usedCategories.add(selected.category);
  selectedQuestionIds.add(selected.id);
  return { ...selected, value };
}

function pickDailyFinal(dateKey, usedQuestionIds) {
  const shuffled = [...FINAL_BANK].sort((a, b) => hashString(`${dateKey}-final-${a.id}`) - hashString(`${dateKey}-final-${b.id}`));
  return shuffled.find(q => !usedQuestionIds.has(q.id)) || generatedFallbackFinal(dateKey);
}

function dailySet(dateKey = todayKey()) {
  const usedCategories = new Set();
  const usedQuestionIds = usedQuestionIdsBefore(dateKey);
  const selectedQuestionIds = new Set();

  return {
    dateKey,
    questions: QUESTION_VALUES.map(value => pickDailyQuestion(value, dateKey, usedCategories, usedQuestionIds, selectedQuestionIds)),
    final: pickDailyFinal(dateKey, usedQuestionIds),
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
