const sentences = [
  "블루베리 스무디 한 잔 주세요",
  "아니 사투리 안쓴다고요 완전 서울말인데",
  "울산 광역시에요 시골 아니에요",
  "답장 뭐라고 해야 될지 모르겠서용",
  "아니 진짜 저한테 왜그러세요 제가 뭘 잘못 했다고",
];

const sentence = document.getElementById("sentence");
const typingInput = document.getElementById("typing-input");
const averageSpeed = document.getElementById("average-speed");
const bestSpeed = document.getElementById("best-speed");
const accuracy = document.getElementById("accuracy");
let sentenceIndex = 0;
let sessionStartedAt = null;
let sentenceStartedAt = null;
let completedTypedCount = 0;
let completedCorrectCount = 0;
let bestSpeedValue = 0;

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
  const characters = Array.from(sentences[sentenceIndex], (character, index) => {
    const span = document.createElement("span");
    span.textContent = character;
    span.className = index >= typedCharacters.length
      ? "pending"
      : typedCharacters[index] === character ? "correct" : "incorrect";
    return span;
  });
  sentence.replaceChildren(...characters);
}

renderSentence();
updateStats();

typingInput.addEventListener("input", () => {
  if (typingInput.value && !sentenceStartedAt) {
    sentenceStartedAt = Date.now();
    sessionStartedAt ??= sentenceStartedAt;
  }

  renderSentence();
  updateStats();
});

typingInput.addEventListener("keydown", (event) => {
  
  if (event.key !== "Enter" || event.isComposing || event.keyCode === 229) {
    return;
  }

  if (typingInput.value !== sentences[sentenceIndex]) {
    return;
  }

  event.preventDefault();
  completedTypedCount += Array.from(typingInput.value).length;
  completedCorrectCount += getCorrectCount(typingInput.value, sentences[sentenceIndex]);
  sentenceIndex = (sentenceIndex + 1) % sentences.length;
  typingInput.value = "";
  sentenceStartedAt = null;
  renderSentence();
  updateStats();
});

setInterval(updateStats, 250);
