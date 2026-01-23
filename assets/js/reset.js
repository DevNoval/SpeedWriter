const restartBtn = document.getElementById('restartBtn');
const wpmId = document.getElementById('wpm');
const timeId = document.getElementById('time');
const accuracyId = document.getElementById('accuracy');
const scoreboard = document.querySelectorAll('.score-item');

/* ---------- Timer & Stats ---------- */
function startTimer() {
  if (STATE.started) return;
  STATE.started = true;
  STATE.startTime = Date.now();
  if (STATE.mode === 'timer') STATE.timeLimit = STATE.activeTimerSeconds;
  STATE.timerInterval = setInterval(() => {
    STATE.elapsed = Math.floor((Date.now() - STATE.startTime) / 1000);

    if (STATE.mode === "timer") {
      const remaining = Math.max(0, STATE.timeLimit - STATE.elapsed);
      timeId.textContent = formatTime(remaining);
      updateFooter();

      if (remaining <= 0) {
        stopTimer();
        typingInput.blur();
      }
    } else {
      timeId.textContent = formatTime(STATE.elapsed);
      updateFooter();
    }
    updateWPM();
  }, 250);
}

function stopTimer() {
  if (!STATE.started && !STATE.timerInterval) return;
  cleanUpTest();
  scoreboard?.forEach(el => el.classList.add("score-flash", "score-highlight"));

  const caret = document.querySelector(".caret");
  if (caret) {
    caret.style.opacity = "0";
    caret.style.animation = "none";
  }

  if(typingInput && wordsContainer) {
    typingInput.classList.add("input-flash");
    wordsContainer.classList.add("display-flash");
  }

  typingInput.disabled = true; typingInput.blur();
  playWinningSound();
  setTimeout(showScorePopup, 300);
}

function cleanUpTest() {
  STATE.started = false; 
  clearInterval(STATE.timerInterval);
  scoreboard?.forEach(el => el.classList.remove("score-flash", "score-highlight"));
  typingInput.classList.remove("input-wrong", "input-flash");
  wordsContainer.classList.remove("display-flash");
}

/* ---------- Score Popup ---------- */
function showScorePopup() {
  const popup = document.getElementById("scorePopup");
  if (!popup) return;
  popup.classList.remove("hidden");
}

function closeScorePopup() {
  const popup = document.getElementById("scorePopup");
  if (!popup) return;
  popup.classList.remove("show");
  setTimeout(() => popup.classList.add("hidden"), 400);
}

/* ---------- Restart ---------- */
function restartTest() {
  cleanUpTest(); Object.assign(STATE, {
    started: false, startTime: 0, elapsed: 0, currentIndex: 0,
    correctKeystrokes: 0, totalKeystrokes: 0, wordsList: generateWords()
  });

  if (STATE.mode === 'timer') {
    renderWords(true);
    timeId.textContent = formatTime(STATE.activeTimerSeconds); // 🔹 ubah ke formatTime
  } else {
    renderWords();
    timeId.textContent = formatTime(0); // 🔹 mulai dari 0:00
  }
  timeId.textContent = STATE.mode === "timer" ? STATE.activeTimerSeconds : 0;
  wpmId.textContent = 0; 
  accuracyId.textContent = 100;
  typingInput.value = ""; 
  typingInput.disabled = false; 
  typingInput.focus();
  updateFooter(); updateCaret();
}

function init() {
  Object.assign(STATE, {
    started: false,
    startTime: 0,
    elapsed: 0,
    currentIndex: 0,
    correctKeystrokes: 0,
    totalKeystrokes: 0,
    wordsList: generateWords() // Mengambil kata/quote baru
  });

  if (STATE.mode === 'timer') {
    renderWords(true);
  } else {
    renderWords();
  }

  wpmId.textContent = 0;
  accuracyId.textContent = 100;
  typingInput.value = "";
  typingInput.disabled = false;  
  typingInput.focus();
}

function updateWPM() {
  const wpm = Math.max(STATE.elapsed / 60, 1 / 60);
  wpmId.textContent = Math.round((STATE.correctKeystrokes / CONFIG.lettersPerWPM) / wpm) || 0;
};

function updateAccuracy() {
  const accuracy = Math.round((STATE.correctKeystrokes / (STATE.totalKeystrokes || 1)) * 100);
  accuracyId.textContent = Math.max(1, Math.min(100, accuracy));
};

function updateFooter() {
  if (STATE.mode === "timer") {
    const remaining = Math.max(0, (STATE.timeLimit || STATE.activeTimerSeconds) - (STATE.elapsed || 0));
    wordsLeftId.textContent = formatTime(remaining);
  } else {
    wordsLeftId.textContent = `${STATE.currentIndex}/${STATE.wordsList.length}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const restartBtnScore = document.getElementById('restartBtnScore');

  if (restartBtnScore) {
    restartBtnScore.onclick = () => {
      if (typeof closeScorePopup === 'function') {
        closeScorePopup();
      } else {
        const scorePopup = document.getElementById('scorePopup');
        scorePopup.classList.add('hidden');
        scorePopup.classList.remove('show');
        }
        if (typeof init === 'function') {
         init();
        }
    };
  }
});

restartBtn.addEventListener('click', restartTest);