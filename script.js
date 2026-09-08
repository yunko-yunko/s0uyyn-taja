const sentences = [
  "블루베리 스무디 한 잔 주세요",
  "아니 사투리 안쓴다고요 완전 서울말인데",
  "울산은 광역시에요 시골 아니에요",
  "답장 뭐라고 해야 될지 모르겠서용",
  "아니 진짜 저한테 왜그러세요 제가 뭘 잘못 했다고",
  "e의 2승 2의 e승",
  "블루베리 스무디.. 착한친구야..",
  "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ넹",
  "당당해지세요.",
  "니 그ㅡ만 하라고..",
  "타자연습에 제 목소리가 왜 필요하죠..",
  "개싫어",
  "아진짜ㅏ요?",
  "내가 그럼 울산에서 고래 타고 등교했겠냐",
  "선배짘자왜그러세요",
  "재밌냐",
  "따라하지말라고.. 떄래해재맬래개~",
  "아니 이걸 진짜 만들었어요?",
  "이거 진자 왜 하느ㅡㄴ데요",
  "근데진짜ㅝ라고 답장 해애더ㅏㅏ요?",
  "블루베리 원액 10ml, 우유 400ml, 얼음 10개",
  "웃ㅅ지 마새요..",
  "오늘부터 조용히 살 꺼애요ㅛ",
  "끝나고 나 스무디 사 줘",
  "내 옆에서 떨어져",
  "안히 하 왜그래오",
  "오?",
  "오쫄팁이요",
  "왜 길가에서 노숙하세요ㅠㅜㅜㅜ",
  "왜 노숟해요오ㅠㅡㅜㅜ",
  "여기사람 너므많아ㅏㅏㅅ",
  "진짜 미친거라냐ㅕ 왜그랴오진자",
  "저희 자리 내럾음 부럽죠",
  "사람 개많아료",
  "이우진 : 아니 어떻게 타자가 저렇게 쳐지지 ㅈㄴ 신기하다",
  "저더가능대",
];

function pickSentenceIndex(previousIndex = -1) {
  if (previousIndex === -1) {
    return Math.floor(Math.random() * sentences.length);
  }

  const offset = 1 + Math.floor(Math.random() * (sentences.length - 1));
  return (previousIndex + offset) % sentences.length;
}

const sentence = document.getElementById("sentence");
const typingInput = document.getElementById("typing-input");
const mismatchSound = new Audio("assets/audio.wav");
mismatchSound.preload = "auto";
const averageSpeed = document.getElementById("average-speed");
const bestSpeed = document.getElementById("best-speed");
const accuracy = document.getElementById("accuracy");
const sendButton = document.querySelector(".send-button");
const typingField = document.querySelector(".typing-field");
const chatHistory = document.getElementById("chat-history");
const themeToggle = document.getElementById("theme-toggle");
const textMeasureContext = document.createElement("canvas").getContext("2d");
const keyboardRows = [...document.querySelectorAll(".keyboard .typing-zone")];
const keyCodesByRow = [
  ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0"],
  ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP"],
  ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL"],
  ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM"],
  ["Shift", "Space", "Enter"],
];
const koreanLayout = {
  KeyQ: "ㅂ", KeyW: "ㅈ", KeyE: "ㄷ", KeyR: "ㄱ", KeyT: "ㅅ",
  KeyY: "ㅛ", KeyU: "ㅕ", KeyI: "ㅑ", KeyO: "ㅐ", KeyP: "ㅔ",
  KeyA: "ㅁ", KeyS: "ㄴ", KeyD: "ㅇ", KeyF: "ㄹ", KeyG: "ㅎ",
  KeyH: "ㅗ", KeyJ: "ㅓ", KeyK: "ㅏ", KeyL: "ㅣ",
  KeyZ: "ㅋ", KeyX: "ㅌ", KeyC: "ㅊ", KeyV: "ㅍ", KeyB: "ㅠ", KeyN: "ㅜ", KeyM: "ㅡ",
};
const shiftedKoreanLayout = {
  ...koreanLayout,
  KeyQ: "ㅃ", KeyW: "ㅉ", KeyE: "ㄸ", KeyR: "ㄲ", KeyT: "ㅆ", KeyO: "ㅒ", KeyP: "ㅖ",
};
const englishLayout = {
  Digit1: "1", Digit2: "2", Digit3: "3", Digit4: "4", Digit5: "5",
  Digit6: "6", Digit7: "7", Digit8: "8", Digit9: "9", Digit0: "0",
  ...Object.fromEntries("QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((letter) => ["Key" + letter, letter.toLowerCase()])),
};
const shiftedEnglishLayout = {
  ...Object.fromEntries(Object.entries(englishLayout).map(([code, value]) => [code, /^[a-z]$/.test(value) ? value.toUpperCase() : value])),
  Digit1: "!", Digit2: "@", Digit3: "#", Digit4: "$", Digit5: "%",
  Digit6: "^", Digit7: "&", Digit8: "*", Digit9: "(", Digit0: ")",
};
const initialIndex = { "ㄱ": 0, "ㄲ": 1, "ㄴ": 2, "ㄷ": 3, "ㄸ": 4, "ㄹ": 5, "ㅁ": 6, "ㅂ": 7, "ㅃ": 8, "ㅅ": 9, "ㅆ": 10, "ㅇ": 11, "ㅈ": 12, "ㅉ": 13, "ㅊ": 14, "ㅋ": 15, "ㅌ": 16, "ㅍ": 17, "ㅎ": 18 };
const medialIndex = { "ㅏ": 0, "ㅐ": 1, "ㅑ": 2, "ㅒ": 3, "ㅓ": 4, "ㅔ": 5, "ㅕ": 6, "ㅖ": 7, "ㅗ": 8, "ㅘ": 9, "ㅙ": 10, "ㅚ": 11, "ㅛ": 12, "ㅜ": 13, "ㅝ": 14, "ㅞ": 15, "ㅟ": 16, "ㅠ": 17, "ㅡ": 18, "ㅢ": 19, "ㅣ": 20 };
const finalIndex = { "": 0, "ㄱ": 1, "ㄲ": 2, "ㄳ": 3, "ㄴ": 4, "ㄵ": 5, "ㄶ": 6, "ㄷ": 7, "ㄹ": 8, "ㄺ": 9, "ㄻ": 10, "ㄼ": 11, "ㄽ": 12, "ㄾ": 13, "ㄿ": 14, "ㅀ": 15, "ㅁ": 16, "ㅂ": 17, "ㅄ": 18, "ㅅ": 19, "ㅆ": 20, "ㅇ": 21, "ㅈ": 22, "ㅊ": 23, "ㅋ": 24, "ㅌ": 25, "ㅍ": 26, "ㅎ": 27 };
const finalJamo = Object.keys(finalIndex);
const medialJamo = Object.keys(medialIndex);
const combineMedial = { "ㅗㅏ": "ㅘ", "ㅗㅐ": "ㅙ", "ㅗㅣ": "ㅚ", "ㅜㅓ": "ㅝ", "ㅜㅔ": "ㅞ", "ㅜㅣ": "ㅟ", "ㅡㅣ": "ㅢ" };
const splitFinal = { "ㄳ": ["ㄱ", "ㅅ"], "ㄵ": ["ㄴ", "ㅈ"], "ㄶ": ["ㄴ", "ㅎ"], "ㄺ": ["ㄹ", "ㄱ"], "ㄻ": ["ㄹ", "ㅁ"], "ㄼ": ["ㄹ", "ㅂ"], "ㄽ": ["ㄹ", "ㅅ"], "ㄾ": ["ㄹ", "ㅌ"], "ㄿ": ["ㄹ", "ㅍ"], "ㅄ": ["ㅂ", "ㅅ"] };
const virtualKeys = new Map();
let keyboardLanguage = "ko";
let virtualShift = false;
let languageKey;
const replies = [
  "놀리지 마세요..",
  "이제 그냥 읽씹할게요",
  "안ㄴ히 하지 마새요ㅠ",
  "저는 몰라ㅏ오",
  "아ㅏ 망햇네그냥",
];
let sentenceIndex = pickSentenceIndex();
let sessionStartedAt = null;
let sentenceStartedAt = null;
let completedTypedCount = 0;
let completedCorrectCount = 0;
let bestSpeedValue = 0;
let audioContext;
let committedInputValue = "";
let inputIsComposing = false;
let compositionText = "";
let compositionStart = 0;
let feedbackFrame = 0;
const pendingFeedbackIndices = new Set();
const feedbackCharacters = new Map();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const typingEffects = document.createElement("div");
typingEffects.className = "typing-effects";
typingEffects.setAttribute("aria-hidden", "true");
document.body.append(typingEffects);

function queueTypingFeedback(index, character) {
  if (!/\S/u.test(character) || feedbackCharacters.get(index) === character) return;
  feedbackCharacters.set(index, character);
  pendingFeedbackIndices.add(index);
}

function pruneTypingFeedback() {
  const current = Array.from(typingInput.value);
  feedbackCharacters.forEach((character, index) => {
    if (current[index] !== character) feedbackCharacters.delete(index);
  });
}

function trackCommittedCharacters(value, shouldAnimate = true) {
  const previous = Array.from(committedInputValue);
  const current = Array.from(value);
  committedInputValue = value;

  if (!shouldAnimate || reducedMotion.matches) return;

  let start = 0;
  while (start < previous.length && previous[start] === current[start]) start += 1;
  let oldEnd = previous.length;
  let newEnd = current.length;
  while (oldEnd > start && newEnd > start && previous[oldEnd - 1] === current[newEnd - 1]) {
    oldEnd -= 1;
    newEnd -= 1;
  }

  for (let index = start; index < newEnd; index += 1) {
    queueTypingFeedback(index, current[index]);
  }

  if (pendingFeedbackIndices.size && !feedbackFrame) {
    feedbackFrame = requestAnimationFrame(() => {
      feedbackFrame = 0;
      syncTypingScroll();
      typingField.classList.remove("is-typing-bounce");
      void typingField.offsetWidth;
      typingField.classList.add("is-typing-bounce");
      pendingFeedbackIndices.forEach(emitTypingParticles);
      pendingFeedbackIndices.clear();
    });
  }
}

function trackInputFeedback(event) {
  pruneTypingFeedback();
  // 일부 브라우저는 compositionend 뒤에 같은 값의 input을 한 번 더 보냅니다.
  if (!inputIsComposing && typingInput.value === committedInputValue) return;

  const isComposition = inputIsComposing || event.isComposing
    || event.inputType === "insertCompositionText";
  const isTyping = !/^(delete|history|insertFromPaste|insertFromDrop)/.test(event.inputType ?? "");

  if (!isTyping) {
    cancelAnimationFrame(feedbackFrame);
    feedbackFrame = 0;
    pendingFeedbackIndices.clear();
  }

  if (isComposition) {
    const data = event.data ?? compositionText ?? "";
    const end = typingInput.selectionEnd;
    const start = Math.max(0, end - data.length);
    compositionStart = start;
    if (isTyping && data.length > 0 && !reducedMotion.matches) {
      const current = Array.from(typingInput.value);
      const target = Array.from(sentences[sentenceIndex]);
      const startIndex = Array.from(typingInput.value.slice(0, start)).length;
      const endIndex = Array.from(typingInput.value.slice(0, end)).length;
      for (let index = startIndex; index < endIndex; index += 1) {
        // 예시가 '과'라면 '고'를 거쳐 '과'가 되는 입력에서 바로 반응합니다.
        if (current[index] === target[index]) queueTypingFeedback(index, current[index]);
      }
    }
    // 다음 글자 조합이 시작되면 앞서 확정된 글자만 효과를 냅니다.
    const committed = typingInput.value.slice(0, start) + typingInput.value.slice(end);
    trackCommittedCharacters(committed, isTyping && data.length > 0);
  } else {
    trackCommittedCharacters(typingInput.value, isTyping);
  }
}

function emitTypingParticles(index) {
  const character = sentence.children[index];
  if (!character || reducedMotion.matches) return;

  const bounds = sentence.getBoundingClientRect();
  const rect = character.getBoundingClientRect();
  if (rect.right <= bounds.left || rect.left >= bounds.right) return;
  const x = Math.max(bounds.left + 4, Math.min(rect.left + rect.width / 2, bounds.right - 4));
  const y = rect.top + rect.height * 0.65;
  const colors = ["#7c3aed", "#9333ea", "#a855f7", "#c084fc"];

  for (let index = 0; index < 7; index += 1) {
    // 빠르게 입력해도 파편이 무한히 쌓이지 않게 제한합니다.
    if (typingEffects.childElementCount >= 84) {
      const oldest = typingEffects.firstElementChild;
      oldest.getAnimations().forEach((animation) => animation.cancel());
      oldest.remove();
    }

    const particle = document.createElement("span");
    particle.className = "typing-particle";
    const size = 4 + Math.random() * 4;
    Object.assign(particle.style, {
      left: `${x}px`, top: `${y}px`, width: `${size}px`, height: `${size * 1.4}px`,
      background: colors[Math.floor(Math.random() * colors.length)],
    });
    typingEffects.append(particle);

    const duration = 620 + Math.random() * 180;
    const velocityX = (Math.random() - 0.5) * 220;
    const velocityY = -110 - Math.random() * 120;
    const rotation = (Math.random() - 0.5) * 720;
    const frames = Array.from({ length: 17 }, (_, frame) => {
      const progress = frame / 16;
      const seconds = progress * duration / 1000;
      const dx = velocityX * seconds;
      const dy = velocityY * seconds + 600 * seconds * seconds;
      return {
        offset: progress,
        transform: `translate(${dx}px, ${dy}px) rotate(${rotation * progress}deg) scale(${1 - progress * 0.4})`,
        opacity: progress < 0.6 ? 1 : (1 - progress) / 0.4,
      };
    });
    const animation = particle.animate(frames, { duration, easing: "linear" });
    animation.onfinish = () => particle.remove();
    animation.oncancel = () => particle.remove();
  }
}

function resetTypingFeedback() {
  committedInputValue = "";
  inputIsComposing = false;
  compositionText = "";
  compositionStart = 0;
  cancelAnimationFrame(feedbackFrame);
  feedbackFrame = 0;
  pendingFeedbackIndices.clear();
  feedbackCharacters.clear();
}

typingField.addEventListener("animationend", (event) => {
  if (event.target === typingField) typingField.classList.remove("is-typing-bounce");
});

function setDarkMode(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "다크 모드 끄기" : "다크 모드 켜기");
  try {
    localStorage.setItem("typing-practice-theme", isDark ? "dark" : "light");
  } catch {
  }
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("typing-practice-theme") ?? "light";
} catch {
}
setDarkMode(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  setDarkMode(!document.body.classList.contains("dark-mode"));
});

function playTypingSound() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  audioContext ??= new AudioContextClass();
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const duration = 0.035;
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
  }

  const sound = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  sound.buffer = buffer;
  gain.gain.setValueAtTime(0.32, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  sound.connect(gain).connect(audioContext.destination);
  sound.start();
}

function composeSyllable(initial, medial, final = "") {
  return String.fromCharCode(0xac00 + ((initialIndex[initial] * 21) + medialIndex[medial]) * 28 + finalIndex[final]);
}

function splitSyllable(character) {
  const code = character?.codePointAt(0);
  if (!code || code < 0xac00 || code > 0xd7a3) return null;

  const offset = code - 0xac00;
  return {
    initial: Object.keys(initialIndex)[Math.floor(offset / 588)],
    medial: medialJamo[Math.floor((offset % 588) / 28)],
    final: finalJamo[offset % 28],
  };
}

function updateVirtualInput(value, caret, data) {
  typingInput.value = value;
  typingInput.setSelectionRange(caret, caret);
  const inputEvent = typeof InputEvent === "function"
    ? new InputEvent("input", { bubbles: true, inputType: "insertText", data })
    : new Event("input", { bubbles: true });
  typingInput.dispatchEvent(inputEvent);
  typingInput.focus({ preventScroll: true });
}

function insertKoreanJamo(jamo) {
  const start = typingInput.selectionStart;
  const end = typingInput.selectionEnd;
  const before = typingInput.value.slice(0, start);
  const after = typingInput.value.slice(end);
  const characters = Array.from(before);
  const previous = characters.pop();
  const base = characters.join("");
  const syllable = splitSyllable(previous);

  if (medialJamo.includes(jamo)) {
    if (initialIndex[previous] !== undefined) {
      const nextBefore = base + composeSyllable(previous, jamo);
      updateVirtualInput(nextBefore + after, nextBefore.length, jamo);
      return;
    }

    if (syllable && !syllable.final) {
      const combined = combineMedial[syllable.medial + jamo];
      if (combined) {
        const nextBefore = base + composeSyllable(syllable.initial, combined);
        updateVirtualInput(nextBefore + after, nextBefore.length, jamo);
        return;
      }
    }

    if (syllable?.final) {
      const [remainingFinal, nextInitial] = splitFinal[syllable.final] ?? ["", syllable.final];
      const nextBefore = base
        + composeSyllable(syllable.initial, syllable.medial, remainingFinal)
        + composeSyllable(nextInitial, jamo);
      updateVirtualInput(nextBefore + after, nextBefore.length, jamo);
      return;
    }

    const nextBefore = before + jamo;
    updateVirtualInput(nextBefore + after, nextBefore.length, jamo);
    return;
  }

  if (syllable && !syllable.final && finalIndex[jamo] !== undefined) {
    const nextBefore = base + composeSyllable(syllable.initial, syllable.medial, jamo);
    updateVirtualInput(nextBefore + after, nextBefore.length, jamo);
    return;
  }

  const nextBefore = before + jamo;
  updateVirtualInput(nextBefore + after, nextBefore.length, jamo);
}

function insertVirtualText(text) {
  const start = typingInput.selectionStart;
  const end = typingInput.selectionEnd;
  const value = typingInput.value;
  const nextValue = value.slice(0, start) + text + value.slice(end);
  updateVirtualInput(nextValue, start + text.length, text);
}

function activeVirtualLayout() {
  const latin = virtualShift ? shiftedEnglishLayout : englishLayout;
  if (keyboardLanguage === "en") return latin;
  return { ...latin, ...(virtualShift ? shiftedKoreanLayout : koreanLayout) };
}

function setKeyboardLanguage(language, resetShift = true) {
  keyboardLanguage = language;
  if (resetShift) virtualShift = false;
  const layout = activeVirtualLayout();

  virtualKeys.forEach((button, code) => {
    if (code === "Shift") {
      button.textContent = "Shift";
      return;
    }
    if (code === "Enter") {
      button.textContent = "enter";
      return;
    }
    if (code === "Space") {
      button.textContent = "space";
      return;
    }
    button.textContent = layout[code] ?? "";
  });

  const shiftKey = virtualKeys.get("Shift");
  shiftKey?.classList.toggle("is-pressed", virtualShift);
  shiftKey?.classList.toggle("is-shifted", virtualShift);
  shiftKey?.setAttribute("aria-pressed", String(virtualShift));
  languageKey?.setAttribute("aria-pressed", String(keyboardLanguage === "ko"));
  languageKey?.setAttribute("aria-label", keyboardLanguage === "ko" ? "한글 키보드, 영어로 전환" : "영어 키보드, 한글로 전환");
  if (languageKey) languageKey.textContent = "한/영";
}

function toggleKeyboardLanguage() {
  setKeyboardLanguage(keyboardLanguage === "ko" ? "en" : "ko");
}

function isLanguageToggleKey(event) {
  return event.code === "Lang1"
    || event.key === "HangulMode"
    || event.key === "Hangul";
}

function flashVirtualKey(button) {
  button.classList.add("is-pressed");
  window.setTimeout(() => button.classList.remove("is-pressed"), 110);
}

function handleVirtualKey(code, button) {
  playTypingSound();
  flashVirtualKey(button);

  if (code === "Shift") {
    virtualShift = !virtualShift;
    setKeyboardLanguage(keyboardLanguage, false);
    return;
  }

  if (code === "Enter") {
    sendMessage();
    typingInput.focus({ preventScroll: true });
    return;
  }

  if (code === "Space") {
    insertVirtualText(" ");
    return;
  }

  const character = activeVirtualLayout()[code];
  if (!character) return;

  if (keyboardLanguage === "ko" && koreanLayout[code]) {
    insertKoreanJamo(character);
  } else {
    insertVirtualText(character);
  }

  if (virtualShift) {
    virtualShift = false;
    setKeyboardLanguage(keyboardLanguage);
  }
}

function initializeVirtualKeyboard() {
  keyboardRows.forEach((row, rowIndex) => {
    const codes = keyCodesByRow[rowIndex];
    [...row.children].forEach((element, index) => {
      const code = codes[index];
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key " + code;
      button.dataset.keyCode = code;
      button.addEventListener("click", () => handleVirtualKey(code, button));
      element.replaceWith(button);
      virtualKeys.set(code, button);
    });
  });

  languageKey = document.createElement("button");
  languageKey.type = "button";
  languageKey.className = "key language-key";
  languageKey.addEventListener("click", () => {
    playTypingSound();
    flashVirtualKey(languageKey);
    toggleKeyboardLanguage();
    typingInput.focus({ preventScroll: true });
  });

  const shiftKey = virtualKeys.get("Shift");
  shiftKey?.after(languageKey);
  setKeyboardLanguage("ko");
}

function animateSendButton() {
  sendButton.classList.remove("is-bouncing");
  void sendButton.offsetWidth;
  sendButton.classList.add("is-bouncing");
}

function addMessage(text, type) {
  const message = document.createElement("p");
  message.className = `message ${type}`;
  message.textContent = text;
  chatHistory.append(message);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function getCorrectCount(value, target) {
  return Array.from(value).reduce(
    (count, character, index) => count + (character === Array.from(target)[index] ? 1 : 0),
    0,
  );
}

function getSpeed(characters, startedAt) {
  if (!startedAt || characters === 0) return 0;

  const elapsedMinutes = Math.max((Date.now() - startedAt) / 60000, 1 / 60);
  return Math.round(characters / elapsedMinutes);
}

function updateStats() {
  const typedValue = typingInput.value;
  const typedCount = Array.from(typedValue).length;
  const currentCorrectCount = getCorrectCount(typedValue, sentences[sentenceIndex]);
  const currentSpeed = getSpeed(typedCount, sentenceStartedAt);
  const totalTypedCount = completedTypedCount + typedCount;
  const totalCorrectCount = completedCorrectCount + currentCorrectCount;
  const average = getSpeed(totalTypedCount, sessionStartedAt);

  bestSpeedValue = Math.max(bestSpeedValue, currentSpeed);
  averageSpeed.textContent = average;
  bestSpeed.textContent = bestSpeedValue;
  accuracy.textContent = totalTypedCount
    ? Math.round((totalCorrectCount / totalTypedCount) * 100)
    : 0;
}

function renderSentence() {
  const typedCharacters = Array.from(typingInput.value);
  const targetCharacters = Array.from(sentences[sentenceIndex]);
  const length = Math.max(targetCharacters.length, typedCharacters.length);
  const characters = Array.from({ length }, (_, index) => {
    const span = document.createElement("span");
    const typedCharacter = typedCharacters[index];
    const targetCharacter = targetCharacters[index];

    span.textContent = typedCharacter ?? targetCharacter;
    span.className = typedCharacter === undefined
      ? "pending"
      : typedCharacter === targetCharacter ? "correct" : "incorrect";
    return span;
  });
  sentence.replaceChildren(...characters);
  updateTypingFieldWidth();
  requestAnimationFrame(syncTypingScroll);
}

function updateTypingFieldWidth() {
  const sentenceStyle = getComputedStyle(sentence);
  textMeasureContext.font = sentenceStyle.font;
  const sentenceWidth = textMeasureContext.measureText(sentence.textContent).width;
  const horizontalPadding = parseFloat(sentenceStyle.paddingLeft)
    + parseFloat(sentenceStyle.paddingRight);
  const sendSpace = parseFloat(getComputedStyle(typingField).getPropertyValue("--send-space")) || 56;

  typingField.style.setProperty("--sentence-width", `${Math.ceil(Math.max(480, sentenceWidth + horizontalPadding + sendSpace + 2))}px`);
}

function syncTypingScroll() {
  // 실제 입력창과 예시 문장이 같은 가로 위치를 보여 주도록 맞춥니다.
  sentence.scrollLeft = typingInput.scrollLeft;
}

function updateViewport() {
  const viewport = window.visualViewport;
  // 화면 확대 시에는 글자를 다시 축소하지 않습니다.
  if (viewport && viewport.scale !== 1) return;

  const height = viewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
  const keyboardOpen = window.matchMedia("(pointer: coarse)").matches
    && document.activeElement === typingInput
    && window.innerHeight - height > 120;
  document.body.classList.toggle("software-keyboard-open", keyboardOpen);
  updateTypingFieldWidth();
  requestAnimationFrame(syncTypingScroll);
}

initializeVirtualKeyboard();
sendButton.addEventListener("click", () => {
  sendMessage();
  typingInput.focus({ preventScroll: true });
});

renderSentence();
updateStats();
updateViewport();

window.addEventListener("resize", updateViewport);
window.visualViewport?.addEventListener("resize", updateViewport);
typingInput.addEventListener("scroll", syncTypingScroll);
typingInput.addEventListener("focus", updateViewport);
typingInput.addEventListener("blur", updateViewport);
for (const eventName of ["select", "keyup", "click", "compositionend"]) {
  typingInput.addEventListener(eventName, () => requestAnimationFrame(syncTypingScroll));
}
document.fonts.ready.then(() => {
  updateTypingFieldWidth();
  syncTypingScroll();
});

// 모바일에서는 페이지를 열자마자 시스템 키보드가 나타나지 않게 합니다.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  typingInput.focus({ preventScroll: true });
}

typingInput.addEventListener("compositionstart", () => {
  inputIsComposing = true;
  compositionText = "";
  compositionStart = typingInput.selectionStart;
  committedInputValue = typingInput.value.slice(0, compositionStart)
    + typingInput.value.slice(typingInput.selectionEnd);
});

typingInput.addEventListener("compositionupdate", (event) => {
  compositionText = event.data;
});

typingInput.addEventListener("compositionend", (event) => {
  inputIsComposing = false;
  compositionText = "";
  renderSentence();
  pruneTypingFeedback();
  trackCommittedCharacters(typingInput.value, Boolean(event.data));
});

typingInput.addEventListener("input", (event) => {
  if (typingInput.value && !sentenceStartedAt) {
    sentenceStartedAt = Date.now();
    sessionStartedAt ??= sentenceStartedAt;
  }

  renderSentence();
  updateStats();
  trackInputFeedback(event);
});

typingInput.addEventListener("keydown", (event) => {
  
  if (event.key !== "Enter" || event.isComposing || event.keyCode === 229) {
    return;
  }

  event.preventDefault();
  if (!event.repeat) sendMessage();
});

// 가상 키보드가 keydown 없이 줄바꿈을 요청하는 경우도 전송으로 처리합니다.
typingInput.addEventListener("beforeinput", (event) => {
  if (event.inputType === "insertLineBreak" && !event.isComposing) {
    event.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const typedValue = typingInput.value;
  if (!typedValue.trim()) {
    return;
  }

  if (typedValue !== sentences[sentenceIndex]) {
    mismatchSound.currentTime = 0;
    mismatchSound.play().catch((error) => {
      console.warn("오답 효과음을 재생하지 못했습니다.", error);
    });
  }

  animateSendButton();
  addMessage(typedValue, "sent");
  completedTypedCount += Array.from(typedValue).length;
  completedCorrectCount += getCorrectCount(typedValue, sentences[sentenceIndex]);
  sentenceIndex = pickSentenceIndex(sentenceIndex);
  typingInput.value = "";
  resetTypingFeedback();
  typingInput.scrollLeft = 0;
  sentence.scrollLeft = 0;
  sentenceStartedAt = null;
  renderSentence();
  updateStats();

  window.setTimeout(() => {
    const reply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(reply, "received");
  }, 500);
}

function getKeyboardKey(event) {
  if (isLanguageToggleKey(event)) {
    return languageKey;
  }

  if (event.key === "Shift") {
    return document.querySelector(".Shift");
  }

  return event.code ? document.getElementsByClassName(event.code)[0] : null;
}

document.addEventListener("keydown", (event) => {
  if (!event.repeat) {
    playTypingSound();
  }

  if (isLanguageToggleKey(event) && !event.repeat) {
    toggleKeyboardLanguage();
  }

  const k = getKeyboardKey(event);
  if (k) {
    k.classList.add("is-pressed");
  }
});

document.addEventListener("keyup", (event) => {
  const k = getKeyboardKey(event);
  if (k) {
    k.classList.remove("is-pressed");
  }
});

window.addEventListener("blur", () => {
  document.querySelectorAll(".key.is-pressed").forEach((key) => {
    key.classList.remove("is-pressed");
  });
});

setInterval(updateStats, 250);
