/* global dictionary, targetWords */
// @ts-nocheck

const questionModal = document.getElementById("question-modal")
const yesBtn = document.getElementById("yes-btn")
const noBtn = document.getElementById("no-btn")
const modalText = document.getElementById("modal-text")

const datumModal = document.getElementById("datum-modal")

let horseWasHungry = false;
let horseDeservesWin = false;
let horseWantsWin = false;
let youWantWin = false;

let gameOver = false;

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

const MAX_GUESSES = 9;
let guessCount = 0; 

let wrongGuesses = 0;

let qteTimer = null;

const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");

// original date ref: const offsetFromDate = new Date(2025, 5, 16, 1).getTime();
// defined like this because that's when nova first started posting her results
// and the game became playable in nonaustralian contexts
const offsetFromDate = new Date(2025, 5, 16,).getTime();
const msOffset = Date.now() - offsetFromDate;
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24);
const targetWord = targetWords[dayOffset]

const GAME_MODES = 
{
  BASIC_BRONGLE: "yes_no",
  STANDARD: "standard",
  PROP_HUNT: "propHunt",
}

let currentMode = GAME_MODES.BASIC_BRONGLE; 

let sceneId = "start";
let storySequence = {};

const STORY_REGISTRY = 
{
  274: twoSevenFourAKAhorse,
  275: ogre,
  276: eleDance,
  277: cutoutTiger,
  278: guessGame,
  279: pirateRaid,
  280: swampMonster,
  281: dream,
  282: propHunt,
  283: surviveNight,
  284: exploreBeach,
  285: oceanSunlightZone,
  286: twilightZone,
  287: midnightZoneOcean,
  288: anglerfish,
  289: abyssopelagic,
  290: preTrench,
  291: recap,
  292: highFive,
  293: easterSpecial,
  294: trenchesReborn,
  //295: funPokemonFacts,
};

/**
 * @typedef {Object} Choice
 * @property {string} text
 * @property {string} [next]
 * @property {string} [msg]
 * @property {string} [msgBtn]  // Add this line with brackets for "optional"
 * @property {function} [action]
 */

const activeSounds = {};
let tracksToResume = [];


// GAME LOGIC STARTS HERE
initGame()

function initGame() 
{
  currentMode = GAME_MODES.BASIC_BRONGLE;
  // if no game defined for that day default to 283 = survivnight (once fixed it'll be 274, original nonaustralian game) 
  storySequence = STORY_REGISTRY[dayOffset] || STORY_REGISTRY[283]; 

  // 282 = prop hunt day :3
  if (dayOffset === 282) 
  {
      currentMode = GAME_MODES.PROP_HUNT;
  }

  startInteraction();
}

function resetGameTo(dayNumber)
{
  if (STORY_REGISTRY[dayNumber])
   storySequence = STORY_REGISTRY[dayNumber]; 
  else
    showAlert("couldn't load story, sorry </3");
}

function startPreviousSequence(sequence)
{
  showAlert("aaaa");
}

function getPropHuntSharePrompt()
{
  if (wrongGuesses === 0)
    return "you played a perfect game! revel in it?";
  else if (wrongGuesses === 1)
    return "you won in just a single guess, so close to perfection! dare your friends (and enemies) to do better?";
  else if (wrongGuesses < 5)
    return "you won in " + wrongGuesses + " guesses, not bad! dare your friends (and enemies) to do better?";
  else
    return "you.. you won! and you probably tried your best and might have had fun too, yay :) do you want your friends to have fun too?";
}



/**
 * @param {HTMLElement[]} tiles
 * @param {String} alertMsg
 * @param {String} shareMsg
 */
function win(tiles, shareMsg, alertMsg = "")
{
  stopInteraction();

  gameOver = true;

  setTimeout(() => 
  {
    danceTiles(tiles);

    if (alertMsg != "")
      showAlert(alertMsg, 6000);

    setTimeout(() => 
    {
      showShareModal(shareMsg);
    }, 3000);
  }, 1000)
}

/**
 * @param {String} shareMsg
 */
function endGame(shareMsg, alertMsg = "")
{
  stopInteraction();

  gameOver = true;

  setTimeout(() => 
  {
    if (alertMsg != "")
      showAlert(alertMsg, 6000);

    setTimeout(() => 
    {
      showShareModal(shareMsg);
    }, 3000);
  }, 1000)
}



/**
 * Unflips and clears specific tiles based on their index in the grid.
 * @param {number[]} targetIndices - Array of numbers (e.g., [4, 9, 14])
 */
function unflipTiles(targetIndices) 
{
  // 1. Grab the whole board and cast it so the editor is happy
  const gridTiles = /** @type {HTMLElement[]} */ (Array.from(document.querySelectorAll(".guess-grid .tile")));

  // 2. Loop through ONLY the indices you passed in
  targetIndices.forEach((targetIndex, loopIndex) => 
  {
    const tile = gridTiles[targetIndex];

    // Safety check against the "Null Ogre" (just in case you pass an index that is too high)
    if (!tile) return;

    // 3. Stagger the animation so it flows down the board
    setTimeout(() => 
    {
      tile.classList.add("flip");

      // 4. Wait for the tile to reach the "edge" (halfway rotated)
      tile.addEventListener("transitionend", () => 
      {  
        // Remove the flip to rotate it back
        tile.classList.remove("flip");
        
        // THE WIPEOUT: Clear all data and visual text
        tile.dataset.state = "emoji";  // Removes the color state
        tile.dataset.letter = ""; // Removes the secret letter data
        tile.textContent = "";      // Empties the visual box
        
      }, { once: true });

    }, loopIndex * 150); // 150ms delay between each tile flipping
  });
}


function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() 
{
  document.removeEventListener("click", handleMouseClick)
  document.removeEventListener("keydown", handleKeyPress)
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key)
    return
  }

  if (e.target.matches("[data-enter]")) {
    submitGuess()
    return
  }

  if (e.target.matches("[data-delete]")) {
    deleteKey()
    return
  }
}

function handleKeyPress(e) {
  if (e.key === "Enter") {
    submitGuess()
    return
  }

  if (e.key === "Backspace" || e.key === "Delete") 
  {
    // so chromium fork users don't get pushed out of the website
    e.preventDefault();
    deleteKey()
    return
  }

  if (e.key.match(/^[a-z]$/)) {
    pressKey(e.key)
    return
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles() //  this should be "secret Row" aware
  // don't type more characters if u already have 5 silly
  if (activeTiles.length >= WORD_LENGTH) return 

  // determine which container to look in
  let container = guessGrid;
  if (guessCount === 9) {
    container = document.getElementById("secret-row");
  }

  // find next empty tile in specific container
  const nextTile = /** @type {HTMLElement} */ (container.querySelector(":not([data-letter])"));

  // if empty tile exists, fill it
  if (nextTile) {
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }
}

function deleteKey() {
  const activeTiles = /** @type {HTMLElement[]} */ (Array.from(getActiveTiles()));
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}


/**
 * @param {HTMLElement[]} activeTiles
 * @returns {string | null} 
 */
function getValidGuess(activeTiles) 
{
  // check if enough letters
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Not enough letters");
    shakeTiles(activeTiles);
    return null; 
  }

  // this thing is beautiful imo u should study it
  const guess = activeTiles.map(tile => tile.dataset.letter).join("").toLowerCase();

  if (!dictionary.includes(guess)) {
    showAlert("Not in word list");
    shakeTiles(activeTiles);
    return null;
  }

  return guess; 
}


function gotoSecretScene() 
{
  // check if today's story allows secret scene
  if (storySequence.hasSecretScene) 
  {
    const secretRow = document.getElementById("secret-row");

    

    setTimeout(() => 
    {     
      showAlert("!!!", 3000);  
      secretRow?.classList.remove("hidden");
    }, 1500);
  
    sceneId = storySequence.secretNode || "secretStart";
  } 
  else 
  {
    // secretScene not allowed
    endGame("the dev was sleepy and forgot that you'd reach max guesses by now, sorry! (feel free to send a bug report ^~^)");
  }
}

/**
 * @param {String} nextId
 * @param {HTMLElement[]} activeTiles
 */
function setupNextScene(nextId, activeTiles)
{
  const nextScene = storySequence[nextId];

  // make sure that player can't type especially if we reveal win condition
  stopInteraction();

  if (!nextScene.isTextOnly) 
  {
    if (nextScene.reveal) 
    {
      nextScene.reveal(activeTiles);
      if (nextScene.onReveal) nextScene.onReveal(activeTiles);
    } 
    else 
    {
      showAlert("no emoji reveal specified");
    }
  }

  if (nextScene.next && (!nextScene.choices || nextScene.choices.length === 0)) 
  {
    // 🪄 We use a Timeout so the player actually has time to READ the text
    // before it vanishes and the next scene starts!
    const readTime = nextScene.isTextOnly ? 1500 : 3000; 

    setTimeout(() => 
    {
      setupNextScene(nextScene.next, activeTiles);
    }, readTime);
  }

  if (guessCount === MAX_GUESSES)
    gotoSecretScene();
    
  if(nextScene.gg)
    {
      nextScene.gg(activeTiles);
    } 
  
}

function finishTurn(scene, choice, activeTiles)
{
  if (qteTimer) 
  {
    clearTimeout(qteTimer);
    qteTimer = null;
  }

  questionModal.classList.add("hidden");
      
  if (scene.action) scene.action(activeTiles);
  if (choice?.action) choice?.action(activeTiles);
      
  const nextId = choice?.next || scene.next; 

  if (nextId && storySequence[nextId])
  {
    sceneId = nextId;
    const nextScene = storySequence[nextId];

    // 🪄 THE TRAFFIC COP
    if (nextScene.noReveal) 
    {
      handleSeqTurn(activeTiles);
    } 
    else 
    {
      // Phase 2: Standard Game Loop. 
      // Increment guess, do tile animations, and give the keyboard back.
      guessCount++; 
      setupNextScene(nextId, activeTiles);
      setTimeout(startInteraction, 1500);
    }
  }
  else if(!gameOver)
  {
    endGame("the dev was sleepy and forgot to specify where the game goes next, sorry! feel free to send them a bug report ^~^");
  }
}

/**
 * @param {String} btnText
 */
function createContinueBtn(btnText = "next")
{
  const continueBtn = document.createElement("button");
  continueBtn.innerHTML = btnText;
  continueBtn.classList.add("key");

  return continueBtn;
}

function ResetBtnContainer(btnCont)
{
  btnCont.innerHTML = ""; 
  btnCont.style.display = "flex"; // Ensure it's visible
}

function handleWrongProp(clickedBtn)
{
  // add a CSS class to turn it red
  clickedBtn.classList.add("wrong-guess");

  playTrack("assets/sfx/wrongBuzzer.mp3", {loop: false, isBGM: true,});

  wrongGuesses++;

  // you shouldn't be able to click the wrong choice multiple times
  clickedBtn.disabled = true;
}

function showNextMessage(stepIndex, dialoSeq, btnCont, choice, scene, activeTiles, finishWrap)
{
  if (stepIndex < dialoSeq.length) 
    {
      const currentStep = dialoSeq[stepIndex];
      
      const isLastStep = stepIndex === dialoSeq.length - 1;
      
      modalText.innerHTML = currentStep.text;
      ResetBtnContainer(btnCont);

      if (isLastStep && choice.subChoices && choice.subChoices.length > 0) 
      {
        choice.subChoices.forEach(subChoice => 
        {
          const subBtn = document.createElement("button");
          subBtn.innerHTML = subChoice.text;
          subBtn.classList.add("key"); 
          
          subBtn.onclick = () => finishTurn(scene, subChoice, activeTiles);
          
          btnCont.appendChild(subBtn);
        });
      } 
      
      else 
      {
        const continueBtn = createContinueBtn(currentStep.btnLabel);
        continueBtn.onclick = () => 
        {
        showNextMessage(stepIndex, dialoSeq, btnCont, choice, scene, activeTiles, finishWrap);
        };
      
        btnCont.appendChild(continueBtn);
      }
      
      stepIndex++;
    } 
  else 
  {
    finishWrap();
  }
}

function btnOnClick(choice, scene, activeTiles, btn, btnCont)
{
  if (qteTimer) 
  {
      clearTimeout(qteTimer);
      qteTimer = null;
  }

  let correctProp = true;

  if (currentMode === GAME_MODES.PROP_HUNT && !choice.next) 
  {
    correctProp = false;
  }

  const dialoSeq = [];
  
  if (choice.msg) 
  {
    dialoSeq.push({ text: choice.msg, btnLabel: choice.msgBtn || "Next..." });
  }
  
  let i = 2;
  while (choice[`msg${i}`]) 
  {
    dialoSeq.push(
    {
      text: choice[`msg${i}`],
      btnLabel: choice[`msgBtn${i}`] || "Next..."
    });
    i++;
  }

  const finishWrap = () => finishTurn(scene, choice, activeTiles);

  if (currentMode === GAME_MODES.PROP_HUNT && correctProp) 
    {
      playTrack("assets/sfx/meow.mp3", {loop: false});
    }
    

  if (!correctProp) 
  {
    handleWrongProp(btn);
  } 
  else if (dialoSeq.length === 0) 
  {
    finishWrap(); // No messages at all, just move on
  } 
  else 
  {
    let stepIndex = 0; 

    showNextMessage(stepIndex, dialoSeq, btnCont, choice, scene, activeTiles, finishWrap);
  }
}

/**
 * @param {any} scene
 * @param {HTMLElement[]} activeTiles
 * @param {HTMLElement} btnCont
 */
function setupChoices(scene, activeTiles, btnCont) 
{
  scene.choices.forEach(choice => 
  {
    const btn = document.createElement("button");
    btn.innerHTML = choice.text;
    btn.classList.add("key"); 
    
    btn.onclick = () => btnOnClick(choice, scene, activeTiles, btn, btnCont)
  
  btnCont.appendChild(btn);
});
}



function handleSeqTurn(activeTiles) 
{
  const scene = storySequence[sceneId];
  const btnCont = document.getElementById("choice-button-container");

  // safety check
  if (!scene) return;

  ResetBtnContainer(btnCont);

  if (qteTimer) 
  {
    clearTimeout(qteTimer);
    qteTimer = null;
  }

  if (scene.timer) 
  {
    qteTimer = setTimeout(() => 
    {
      // TIME IS UP! Force them down the default/fail path.
      // We pass a fake 'choice' object to finishTurn to simulate a click.
      finishTurn(scene, { next: scene.timer.next }, activeTiles);
    }, scene.timer.ms);
  }

  const modalBox = questionModal.querySelector(".modal-content");

  // 1. Reset
  modalBox.classList.remove("is-glitching");

  // 2. Apply if glitchy
  if (scene.glitched) 
  {
    modalBox.classList.add("is-glitching");
  }

  if (scene.onQuestion)
    scene.onQuestion(activeTiles)

  // handle question text
  if (scene.question && scene.question.trim() !== "") 
  {
    modalText.innerHTML = scene.question;
  } else 
  {
    modalText.innerHTML = ""; // Keep it empty if no question
  }

  // analyse contents of current scene
  const hasChoices = scene.choices && scene.choices.length > 0;
  const hasQuestion = scene.question && scene.question.trim() !== "";

  // no question, no choices -> run action and skip
  if (!hasQuestion && !hasChoices) 
  {
    if (scene.action) scene.action(activeTiles);
    
    // Move to next turn immediately (finishTurn handles the 1.5s interaction delay)
    finishTurn(scene, null, activeTiles);
    return; 
  }

  // standard node -> show  questionModal
  if (hasChoices) 
  {
    setupChoices(scene, activeTiles, btnCont);
  } else {
    // cutscene case: question exists, no buttons
    setTimeout(() => 
    {
      finishTurn(scene, null, activeTiles);
    }, 2000);
  }

  questionModal.classList.remove("hidden");
}


function submitGuess() 
{
  const activeTiles = /** @type {HTMLElement[]} */ (Array.from(getActiveTiles()));
  const guess = getValidGuess(activeTiles);
  if (!guess) return;

  stopInteraction();

  handleSpecialGuess(guess);

  handleSeqTurn(activeTiles);
}


function handleSpecialGuess(guess) 
{
  // should be converted already 
  // but brongle is not intensive enough that we can't afford this safety measure
  const mode = guess.toLowerCase();
  
  // all currently defined body visual modes
  const validModes = ["trans", "nonbn", "puppy"]; 
  
  if (mode === "datum")
  {
    //hideUI();
    //createDatumModal();
    showAlert("datum...");
  }

  if (validModes.includes(mode)) {
    document.body.dataset.activeBg = mode;
  }
}

function createDatumModal() {
  datumModal.classList.remove("hidden");

  const grid = document.querySelector(".archive-grid");
  grid.innerHTML = "";

  // Object.keys(STORY_REGISTRY) gives an array ur keys (which r numbers 274 onward)
  Object.keys(STORY_REGISTRY).forEach(dayNumber => 
  {

    const btn = document.createElement("button");
    
    // FIX 2: You can just use the template literal for the whole string!
    btn.innerHTML = `day ${dayNumber}`;
    btn.classList.add("key");

    btn.onclick = () => 
    {
      resetGameTo(dayNumber);
      // hide/delete datumModal
    };
    
    // Note: Don't forget you'll eventually need to tell this button 
    // where to "sit" in your HTML!
  });
}

// yet to really study this one
function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter
  const key = keyboard.querySelector(`[data-key="${letter}"i]`)
  setTimeout(() => {
    tile.classList.add("flip")
  }, (index * FLIP_ANIMATION_DURATION) / 2)

  tile.addEventListener(
    "transitionend",
    () => {
      tile.classList.remove("flip")
      if (targetWord[index] === letter) {
        tile.dataset.state = "correct"
        key.classList.add("correct")
      } else if (targetWord.includes(letter)) {
        tile.dataset.state = "wrong-location"
        key.classList.add("wrong-location")
      } else {
        tile.dataset.state = "wrong"
        key.classList.add("wrong")
      }

      if (index === array.length - 1) {
        tile.addEventListener(
          "transitionend",
          () => {
            startInteraction()
            checkWinLose(guess, array)
          },
          { once: true }
        )
      }
    },
    { once: true }
  )
}

function getActiveTiles() {
  // on 10th guess, look inside the secret row
  if (guessCount === 9) {
    const secretRow = document.getElementById("secret-row");
    return secretRow.querySelectorAll('[data-state="active"]');
  }
  
  // otherwise, business as usual
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div")
  alert.innerHTML = message
  alert.classList.add("alert")
  alertContainer.prepend(alert)
  if (duration == null) return

  setTimeout(() => {
    alert.classList.add("hide")
    alert.addEventListener("transitionend", () => {
      alert.remove()
    })
  }, duration)
}

function shakeTiles(tiles) {
  tiles.forEach(tile => {
    tile.classList.add("shake")
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake")
      },
      { once: true }
    )
  })
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    showAlert("You Win", 5000)
    danceTiles(tiles)
    stopInteraction()
    return
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toUpperCase(), null)
    stopInteraction()
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance")
        },
        { once: true }
      )
    }, (index * DANCE_ANIMATION_DURATION) / 5)
  })
}

function hideUI()
{
  questionModal.classList.add("hidden");

    // 1. Grab the keyboard and grid
  const keyboard = document.querySelector(".keyboard");
  const grid = document.querySelector(".guess-grid");
  //const title = document.querySelector(".title");

    // 2. Add the hidden class to all of them
  keyboard?.classList.add("hidden");
  grid?.classList.add("hidden");
  // title?.classList.add("hidden");
}


function showShareModal(resultType) {
  const btnCont = document.getElementById("choice-button-container");
  
  if (!btnCont) {
    console.error("Ogre Error: Could not find 'choice-button-container' in HTML!");
    return;
  }

  // clear out old story buttons and show questionModal
  btnCont.innerHTML = ""; 
  btnCont.style.display = "flex"; // ensure it's using row layout
  questionModal.classList.remove("hidden");


  modalText.innerHTML = resultType;


  // create copy result button
  const shareBtn = document.createElement("button");
  shareBtn.innerHTML = "Copy Result";
  
  // gives it the standard button look
  shareBtn.classList.add("key"); 
  
  // make it wide enough for the text
  shareBtn.style.minWidth = "200px"; 

  shareBtn.onclick = () => {
    generateShareString();
    // confirmation for user
    shareBtn.innerHTML = "COPIED ^~^";
    setTimeout(() => { shareBtn.innerHTML = "Copy Result"; }, 2000);
  };

  btnCont.appendChild(shareBtn);
}

function generateShareString() 
{
  
  const secretRow = document.getElementById("secret-row");

  const isSecretActive = secretRow && !secretRow.classList.contains("hidden");


  // dynamic header

  const displayCount = isSecretActive ? 10 : guessCount;

  let shareText = `Daily Brongle #${dayOffset} ${displayCount}/9\n\n`;

  
  if (currentMode === GAME_MODES.PROP_HUNT) 
  {
    shareText += (wrongGuesses < 1 ? "perfect game⭐" : "errors: " + wrongGuesses) + "\n";
  }

  // main grid 

  const gridTiles = /** @type {HTMLElement[]} */ (Array.from(document.querySelectorAll(".guess-grid .tile")));


  for (let row = 0; row < gridTiles.length; row += 5) {

    let rowText = "";

    let rowHasData = false;


    for (let i = 0; i < 5; i++) {

      const tile = gridTiles[row + i];

      const state = tile?.dataset.state;


      if (state) {

        rowHasData = true;

       

        if (state === "emoji") {
          const char = tile.textContent.trim();

          // 2 braille characters so text doesn't get collapsed

          rowText += (char === "") ? "⠀⠀" : char;

        }

        else if (state === "purple") rowText += "🟪";

        else if (state === "red") rowText += "🟥";

        else if (state === "white") rowText += "⬜";

        else if (state === "correct") rowText += "🟩";

      } else {

        rowText += "⠀⠀";

      }

    }


    if (rowHasData) {

      shareText += rowText + "\n";

    } else {

      break;

    }

  }


  // handle secret row (has same logic i think, might be superfluous)

  if (isSecretActive) {

    const secretTiles = /** @type {HTMLElement[]} */ (Array.from(secretRow.querySelectorAll(".tile")));

    secretTiles.forEach(t => 
    {
      const state = t.dataset.state;

      if (state === "emoji") {

        const char = t.textContent.trim();

        shareText += (char === "") ? "⠀⠀" : char;

      }

      else if (state === "purple") shareText += "🟪";

      else if (state === "red") shareText += "🟥";

      else if (state === "white") shareText += "⬜";

      else if (state === "correct") shareText += "🟩";

      else shareText += "⠀⠀";

    });

    shareText += "\n";

  }

  shareText += "\nhttps://aveypeach.github.io/brongle.au/";


  // needed to bypass clipboard shenanigans
  // vibecoded but it works 
const textArea = document.createElement("textarea");
  textArea.value = shareText;

  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();
  textArea.setSelectionRange(0, 99999); 

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showAlert("Result copied to clipboard!");
    }
  } catch (err) {
    console.error("Copy failed", err);
  }

  document.body.removeChild(textArea);
} 

function killSound(fileName)
{
  if (!activeSounds[fileName]) return;

  activeSounds[fileName].pause();
  activeSounds[fileName].src = "";
  delete activeSounds[fileName];
}

// this function is here to save us against performance hogs and/or dogs
/**
 * @param {String} fileName
 * @param {Object} [options={}]
 * @param {boolean} [options.loop=true]
 * @param {number} [options.volume=1.0]
 * @param {boolean} [options.isBGM=false]
 */
function playTrack(fileName, { loop = true, volume = 1.0, isBGM = false,} = {}) 
{
  // if BGM, stop any active bgm
  if (isBGM && activeSounds["bgm"]) 
    killSound("bgm");


  // TODO: stop all tracks with same fileName before playing
  if (activeSounds[fileName])
    killSound(fileName);

  const audio = new Audio(fileName);
  audio.loop = loop;
  audio.volume = volume;

  // 3. Store it so we can manage it later
  const key = isBGM ? "bgm" : fileName;
  activeSounds[key] = audio;

  // 4. Cleanup for non-looping sounds (SFX)
  if (!loop) {
    audio.onended = () => {
      delete activeSounds[key];
    };
  }

  audio.play().catch(e => console.log("Audio blocked: click required"));
}

function playSfx(fileName, { loop = false, volume = 1.0, isBGM = false,} = {})
{
  playTrack(fileName, {loop, volume, isBGM})
}


document.addEventListener("visibilitychange", () => {
  const currentSounds = Object.values(activeSounds);

  if (document.hidden) 
  {
    tracksToResume = currentSounds.filter(sound => !sound.paused);

    
    tracksToResume.forEach(sound => sound.pause());
    console.log(`Paused ${tracksToResume.length} tracks for backgrounding.`);

  } 
  else 
  {
    tracksToResume.forEach(sound => 
    {
      sound.play().catch(e => console.log("Playback resume blocked by browser"));
    });

    tracksToResume = [];
  }
});