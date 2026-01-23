const wordsContainer = document.getElementById('wordsContainer');
const typingInput = document.getElementById('typingInput');

/* ---------- Utility ---------- */
const pickRandom = (array, n) => {
  const pool = [...array], out = [];
  while (out.length < n && pool.length)
    out.push(...pool.splice(Math.floor(Math.random() * pool.length), 1));
  return out;
};

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/* ---------- Generate kata/quote ---------- */
function generateWords() {
  if (!WORD_DATA) return [];
  const { mode, language } = STATE;
  const isTimer = mode === "timer", count = isTimer ? 999 : STATE.activeWordCount;

  if (mode === "words" || isTimer) {
    const list = WORD_DATA.words?.[language === "en" ? "english_words" : "indonesia_words"] ?? [];
    const result = [];
    while (result.length < count) result.push(...pickRandom(list, Math.min(list.length, count - result.length)));
    return result.slice(0, count);
  }

  const quotes = WORD_DATA.quotes?.[language === "en" ? "quotes_en" : "quotes_id"] ?? [];
  const valid = quotes.filter(q => {
    const length = q.split(/\s+/).length;
    return length >= CONFIG.quoteMinWords && length <= CONFIG.quoteMaxWords;
  }) || quotes;

  const chosen = valid[Math.floor(Math.random() * valid.length)].trim().split(/\s+/);
  const length = chosen.length > CONFIG.quoteMaxWords ? CONFIG.quoteMaxWords : chosen.length;
  return chosen.slice(0, length);
}

/* ---------- Rendering ---------- */
function renderWords(timerMode = STATE.mode === "timer") {
  wordsContainer.innerHTML = "";
  const start = timerMode ? STATE.currentIndex : 0;
  const end = timerMode ? Math.min(STATE.wordsList.length, start + CONFIG.wordsCount) : STATE.wordsList.length;

  STATE.wordsList.slice(start, end).forEach((word, i) => {
    const span = document.createElement("span");
    span.className = "word";
    span.dataset.index = start + i;
    span.innerHTML = [...word].map(c => `<span>${c}</span>`).join("");
    if (start + i === STATE.currentIndex) span.classList.add("current");
    wordsContainer.append(span, " ");
  });
  updateCaret(); updateFooter();
}

/* ---------- Caret ---------- */
function updateCaret() {
  const container = document.querySelector(".words-container");
  let caret = document.querySelector(".caret");

  if (!caret) {
    caret = Object.assign(document.createElement("span"), {
      className: "caret",
      ariaHidden: "true",
    });
    container.appendChild(caret);
  }

  const word = document.querySelector(".word.current");
  if (!word) return;

  const pos = typingInput.value.length;
  const chars = [...word.children].filter(el => !el.classList.contains("caret"));
  const target = chars[pos] || chars[chars.length - 1] || word;
  const { left, top, width } = target.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const offset = 2;
  
  caret.style.left = `${left - cRect.left + (pos >= chars.length ? width - offset : -offset)}px`;
  caret.style.top = `${top - cRect.top}px`;

  clearTimeout(caret.blinkTimeout);
  caret.style.animation = "none";
  caret.blinkTimeout = setTimeout(() => {
    caret.style.animation = "blink 1s infinite";
  }, 100);
}

/* ---------- Input Handling ---------- */
function updateDisplay(typed) {
  const current = document.querySelector(`.word[data-index="${STATE.currentIndex}"]`);
  if (!current) return;
  const target = STATE.wordsList[STATE.currentIndex] || '';
  const charSpans = [...current.children].filter(n => n.tagName === 'SPAN' && !n.classList.contains('caret'));

  for (let i = 0; i < charSpans.length; i++) {
    const char = charSpans[i];
    if (i < typed.length) {
      char.style.color = typed[i] === target[i] ? 'var(--success)' : 'var(--danger)';
    } else {
      char.style.color = '';
    }
  }
  if (!typed.length) {
    current.classList.remove('wrong');
    typingInput.classList.remove('input-wrong');
  }
  updateCaret(); updateAccuracy(); updateWPM();
}

function onType(e) {
  const value = typingInput.value;
  
  if (!STATE.started && value.length) startTimer();
  if (e.isTrusted) STATE.totalKeystrokes++;

  updateDisplay(value);

  const target = STATE.wordsList[STATE.currentIndex] || "";
  const isWrong = [...value].some((c, i) => c !== target[i]);
  typingInput.classList.toggle("input-wrong", isWrong);
  const curEl = document.querySelector(`.word[data-index="${STATE.currentIndex}"]`);
  
  if (curEl && value.length === 0) curEl.classList.remove("wrong");
}

function onKeyDown(e) {
  const key = e.key, target = STATE.wordsList[STATE.currentIndex] || '', typed = typingInput.value;
  if (key === " ") { e.preventDefault(); handleSpace(); return; }
  if (key.length === 1) {
    const correct = key === target[typed.length];
    
    if (correct) { STATE.correctKeystrokes++; playTypeSound(); }
    else { typingInput.classList.add("input-wrong"); playErrorSound(); }
  } else if (key === "Backspace" && typed.length) {
    if (typed.at(-1) === target[typed.length - 1]) STATE.correctKeystrokes--;
    playTypeSound();
  }
}

function handleSpace() {
  const typed = typingInput.value.trim();
  const target = STATE.wordsList[STATE.currentIndex] || " ";
  const curEl = document.querySelector(`.word[data-index="${STATE.currentIndex}"]`);
  
  if (!typed.length) return typingInput.classList.remove("input-wrong");
  const isCorrect = typed === target;

  if (isCorrect) {
    STATE.correctKeystrokes++;
    if (curEl) {
      curEl.classList.remove("current", "wrong");
      curEl.classList.add("correct");
      curEl.querySelectorAll("span").forEach(span => {
        if (!span.classList.contains('caret')) span.style.color = "var(--success)";
      });
    }
    STATE.currentIndex++;
    typingInput.value = "";

    if (STATE.mode === "timer") {
      renderWords(true);
    } else {
      document.querySelectorAll(".word").forEach(word => word.classList.toggle("current", +word.dataset.index === STATE.currentIndex));
    }
    updateCaret();
    typingInput.classList.remove("input-wrong");

    if (STATE.mode !== "timer" && STATE.currentIndex >= STATE.wordsList.length) {
      stopTimer();
      typingInput.blur();
      typingInput.disabled = true;
    }
  } else {
    playErrorSound();

    if (curEl) curEl.classList.add("wrong");
    typingInput.value += " ";
    typingInput.classList.add("input-wrong");
    STATE.totalKeystrokes++;
  }
  updateAccuracy(); updateWPM(); updateFooter();
  typingInput.focus();
}

typingInput.addEventListener('input', onType);
typingInput.addEventListener('keydown', onKeyDown);