const sentences = [
  "블루베리 스무디 한 잔 주세요",
  "아니 사투리 안쓴다고요 완전 서울말인데",
  "울산 광역시에요 시골 아니에요",
  "답장 뭐라고 해야 될지 모르겠서용",
  "아니 진짜 저한테 왜그러세요 제가 뭘 잘못 했다고",
];

const sentence = document.getElementById("sentence");
const typingInput = document.getElementById("typing-input");
let sentenceIndex = 0;

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
typingInput.addEventListener("input", renderSentence);

typingInput.addEventListener("keydown", (event) => {
  
  if (event.key !== "Enter" || event.isComposing || event.keyCode === 229) {
    return;
  }

  if (typingInput.value !== sentences[sentenceIndex]) {
    return;
  }

  event.preventDefault();
  sentenceIndex = (sentenceIndex + 1) % sentences.length;
  typingInput.value = "";
  renderSentence();
});
