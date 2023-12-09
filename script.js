const gameAreaEl = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const CLICK = "click",
  COLOR_IDX = "color-idx";

// RGB Values
const PINK = [228, 101, 122],
  RED = [204, 46, 46],
  ORANGE = [255, 166, 0],
  YELLOW = [214, 214, 57],
  GREEN = [79, 145, 79],
  BLUE = [60, 60, 192],
  PURPLE = [161, 68, 173],
  DARK_BLUE = [0, 191, 255];

const brightenRatio = 0.7;

const soundColors = [
  getRgbString(BLUE),
  getRgbString(YELLOW),
  getRgbString(PURPLE),
  getRgbString(RED),
  getRgbString(GREEN),
  getRgbString(DARK_BLUE),
];

const brightSoundColors = [
  getBrightRgbString(BLUE),
  getBrightRgbString(YELLOW),
  getBrightRgbString(PURPLE),
  getBrightRgbString(RED),
  getBrightRgbString(GREEN),
  getBrightRgbString(DARK_BLUE),
];

const sounds = [];

const brightenDuration = 800; // ms
const soundCount = 4;

let isActive;
let level;
let score;

initializeGame();

function startGame() {
  console.log("started");
}

function resetGame() {
  console.log("reset");
  score = 0;
  level = 1;
  scoreEl.innerText = score;
  levelEl.innerText = level;
}

function initializeGame() {
  for (let i = 0; i < soundCount; i++) {
    const soundEl = createSound(i);
    gameAreaEl.appendChild(soundEl);

    const sound = new Audio(`./sounds/${i * 2 + 1}.m4a`);
    sounds.push(sound);
  }

  startBtn.addEventListener(CLICK, startGame);
  resetBtn.addEventListener(CLICK, resetGame);

  resetGame();
}

function createSound(colorIdx) {
  const soundEl = document.createElement("div");
  soundEl.className = "circle";
  soundEl.style.backgroundColor = soundColors[colorIdx];
  soundEl.setAttribute(COLOR_IDX, colorIdx);
  soundEl.addEventListener(CLICK, soundClick);

  return soundEl;
}

//////////////////
// Event Listeners
//////////////////

function soundClick(e) {
  const soundEl = e.currentTarget;
  const colorIdx = soundEl.getAttribute(COLOR_IDX);

  soundEl.style.backgroundColor = brightSoundColors[colorIdx];
  sounds[colorIdx].play();
  setTimeout(
    () => (soundEl.style.backgroundColor = soundColors[colorIdx]),
    brightenDuration
  );
}

function getRgbString(rgbValues) {
  return `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;
}

function getBrightRgbString(rgbValues) {
  return `rgb(${brighten(rgbValues[0])}, ${brighten(rgbValues[1])}, ${brighten(
    rgbValues[2]
  )})`;
}

function brighten(colorValue) {
  return Math.min(255, colorValue / brightenRatio);
}
