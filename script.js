const gameAreaEl = document.getElementById("gameArea");
const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const popupEl = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");
const popLevelEl = document.getElementById("popLevel");
const popResetBtn = document.getElementById("popResetBtn");

const CLICK = "click",
  SOUND_IDX = "sound-idx",
  HIDE = "hide";
START = "Start";

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

const soundElArr = [];
const sounds = [];

const soundDuration = 800; // ms
const offset = 100; // ms
const soundCount = 4;

let isActive;
let isPlayerTurn;
let score;
let level;
let playerIdx;
let soundSequence;

initializeGame();

function playLevel() {
  isPlayerTurn = false;
  playerIdx = 0;
  startBtn.disabled = true;
  startBtn.innerText = "Listen";

  const n = soundSequence.length;

  for (let i = 0; i < n; i++) {
    const soundIdx = soundSequence[i];
    const soundEl = soundElArr[soundIdx];
    setTimeout(playSound, (soundDuration + offset) * i, soundEl);
  }
  setTimeout(() => {
    isPlayerTurn = true;
    startBtn.innerText = "Play";
  }, soundDuration * n);
}

function incrementLevel() {
  level++;
  score += soundSequence.length;
  soundSequence.push(getRandomSoundIdx());
  isPlayerTurn = false;

  levelEl.innerText = level;
  scoreEl.innerText = score;
  startBtn.disabled = false;
  startBtn.innerText = "Start";
}

function startGame() {
  playLevel();
}

function resetGame() {
  isActive = false;
  isPlayerTurn = false;
  score = 0;
  level = 0;
  playerIdx = 0;
  soundSequence = [];
  popupEl.classList.add(HIDE);
  startBtn.innerText = START;

  incrementLevel();
}

function initializeGame() {
  for (let i = 0; i < soundCount; i++) {
    const soundEl = createSound(i);
    soundElArr.push(soundEl);
    gameAreaEl.appendChild(soundEl);

    const sound = new Audio(`./sounds/${i * 2 + 1}.m4a`);
    sounds.push(sound);
  }

  startBtn.addEventListener(CLICK, startGame);
  resetBtn.addEventListener(CLICK, resetGame);
  popResetBtn.addEventListener(CLICK, resetGame);
  closeBtn.addEventListener(CLICK, closePopup);

  resetGame();
}

function loseGame() {
  isPlayerTurn = false;
  popLevelEl.innerText = level;
  popupEl.classList.remove(HIDE);
}

function playSound(soundEl) {
  const soundIdx = soundEl.getAttribute(SOUND_IDX);

  soundEl.style.backgroundColor = brightSoundColors[soundIdx];
  sounds[soundIdx].play();
  isActive = false;

  setTimeout(() => {
    soundEl.style.backgroundColor = soundColors[soundIdx];
    sounds[soundIdx].pause();
    sounds[soundIdx].load();
    isActive = true;
  }, soundDuration);
}

function createSound(soundIdx) {
  const soundEl = document.createElement("div");
  soundEl.className = "circle";
  soundEl.style.backgroundColor = soundColors[soundIdx];
  soundEl.setAttribute(SOUND_IDX, soundIdx);
  soundEl.addEventListener(CLICK, soundClick);

  return soundEl;
}

//////////////////
// Event Listeners
//////////////////

function soundClick(e) {
  if (!isPlayerTurn || !isActive) return;
  const soundEl = e.currentTarget;
  playSound(soundEl);

  const actualSoundIdx = soundSequence[playerIdx];
  const playerSoundIdx = parseInt(soundEl.getAttribute(SOUND_IDX));
  if (actualSoundIdx !== playerSoundIdx) {
    loseGame();
    return;
  }

  playerIdx++;
  if (playerIdx === soundSequence.length) incrementLevel();
}

function closePopup() {
  popupEl.classList.add(HIDE);
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

function getRandomSoundIdx() {
  return getRandomNumber(0, soundCount - 1);
}

function getRandomNumber(min, max) {
  return parseInt(Math.random() * (max - min + 1) + min);
}
