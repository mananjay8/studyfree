const questions = [
  {
    question: "भारत की राजधानी क्या है?",
    options: ["मुंबई", "नई दिल्ली", "कोलकाता", "चेन्नई"],
    answer: 1,
    explanation: "भारत की राजधानी नई दिल्ली है।"
  },
  {
    question: "जल का रासायनिक सूत्र क्या है?",
    options: ["CO₂", "O₂", "H₂O", "NaCl"],
    answer: 2,
    explanation: "जल के एक अणु में दो हाइड्रोजन और एक ऑक्सीजन परमाणु होते हैं, इसलिए इसका सूत्र H₂O है।"
  },
  {
    question: "2 + 2 × 3 का मान क्या होगा?",
    options: ["12", "10", "8", "6"],
    answer: 2, // ✅ FIXED: "8" is at index 2
    explanation: "BODMAS के अनुसार पहले गुणा होगा: 2 × 3 = 6, फिर 2 + 6 = 8।"
  }
];

// ---------- State ----------
let quizData = [];
let currentQuestion = 0;
let score = 0;
let answered = false;

// ---------- DOM ----------
const questionElement    = document.getElementById("question");
const optionsElement     = document.getElementById("options");
const explanationElement = document.getElementById("explanation");
const nextButton         = document.getElementById("nextBtn");
const questionNumber     = document.getElementById("questionNumber");
const scoreElement       = document.getElementById("score");

// ---------- Utility: shuffle ----------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle questions AND options, remapping the correct answer index
function prepareQuiz() {
  quizData = shuffle(questions).map((q) => {
    const correctText = q.options[q.answer];
    const shuffledOptions = shuffle(q.options);
    return {
      question: q.question,
      options: shuffledOptions,
      answer: shuffledOptions.indexOf(correctText),
      explanation: q.explanation
    };
  });
}

// ---------- Show a question ----------
function showQuestion() {
  answered = false;
  const q = quizData[currentQuestion];

  questionNumber.innerText =
    `Question ${currentQuestion + 1} / ${quizData.length}`;
  scoreElement.innerText = `Score: ${score}`;
  questionElement.innerText = q.question;

  optionsElement.innerHTML = "";
  explanationElement.style.display = "none";
  nextButton.hidden = true;
  nextButton.innerText =
    currentQuestion === quizData.length - 1 ? "Finish Quiz" : "Next Question";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.innerText = option;
    button.onclick = () => selectAnswer(index);
    optionsElement.appendChild(button);
  });
}

// ---------- Handle an answer ----------
function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQuestion];
  const buttons = document.querySelectorAll(".option");

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === q.answer) button.classList.add("correct");
  });

  if (selectedIndex === q.answer) {
    score++;
  } else {
    buttons[selectedIndex].classList.add("wrong");
  }

  scoreElement.innerText = `Score: ${score}`;

  explanationElement.innerHTML =
    `<strong>${
      selectedIndex === q.answer ? "✅ सही जवाब!" : "❌ गलत जवाब"
    }</strong><br>${q.explanation}`;
  explanationElement.style.display = "block";

  nextButton.hidden = false;
}

// ---------- Next / finish ----------
nextButton.onclick = () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    showQuestion();
  } else {
    showResult();
  }
};

// ---------- Result screen ----------
function showResult() {
  const total = quizData.length;
  const percentage = Math.round((score / total) * 100);

  let message = "";
  if (percentage === 100) message = "🏆 शानदार! Perfect score!";
  else if (percentage >= 80) message = "🌟 बहुत बढ़िया! Excellent!";
  else if (percentage >= 60) message = "👍 अच्छा किया! और अभ्यास करें।";
  else if (percentage >= 40) message = "📖 ठीक है, लेकिन और पढ़ाई करें।";
  else message = "💪 कोई बात नहीं — अभ्यास से सब आता है!";

  document.querySelector(".quiz-card").innerHTML = `
    <div style="text-align:center">
      <h2>Quiz Complete 🎉</h2>
      <h3>Score: ${score} / ${total}</h3>
      <p>Accuracy: ${percentage}%</p>
      <p>${message}</p>
      <button class="next-btn" onclick="restartQuiz()">Try Again</button>
    </div>
  `;
}

// ---------- Restart ----------
function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  answered = false;
  prepareQuiz();
  location.reload(); // simple reload — keeps your HTML structure intact
}

// ---------- Init ----------
prepareQuiz();
showQuestion();
