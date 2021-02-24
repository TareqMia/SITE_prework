/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

//global constants
const clueHoldTime = 800; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 800; //how long to wait before starting playback of the clue sequence

//global variables

let pattern;
let progress = 0;
let gamePlaying = false;
let tonePlaying = false;
let volume = 0.3;
let guessCounter = 0;
let strikes;

const getPattern = length => {
  while (pattern.length < length) {
    let randomNum = Math.floor(Math.random() * 6);
    pattern.push(randomNum);
  }
};

const startGame = () => {
  //initialize game variables
  pattern = [];
  getPattern(8);
  console.log(pattern);
  progress = 0;
  strikes = 3;
  gamePlaying = true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
};

const stopGame = () => {
  gamePlaying = false;
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
};

// Sound Synthesis Functions
const freqMap = {
  0: 210,
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500
};
const playTone = (btn, len) => {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  tonePlaying = true;
  setTimeout(function() {
    stopTone();
  }, len);
};
const startTone = btn => {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
};
const stopTone = () => {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
};

//Page Initialization
// Init Sound Synthesizer
const context = new AudioContext();
let o = context.createOscillator();
let g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);

const lightButton = btn => {
  document.getElementById("button" + btn).classList.add("lit");
};

const clearButton = btn => {
  document.getElementById("button" + btn).classList.remove("lit");
};

const playSingleClue = btn => {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
};

const playClueSequence = () => {
  guessCounter = 0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
};

const loseGame = () => {
  stopGame();
  alert("Game Over. You lost.");
};

const winGame = () => {
  stopGame();
  alert("Game Over. You win!");
};

const guess = btn => {
  console.log("user guessed: " + btn);

  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    if (guessCounter == progress) {
      if (progress == pattern.length - 1) {
        winGame();
      } else {
        progress++;
        playClueSequence();
      }
    } else {
      guessCounter++;
    }
  } else {
    strikes--;
    if (strikes > 0) {
      playClueSequence();
    } else {
      loseGame();
    }
  }
};
