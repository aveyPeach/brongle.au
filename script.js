const modal = document.getElementById("question-modal")
const yesBtn = document.getElementById("yes-btn")
const noBtn = document.getElementById("no-btn")
const modalText = document.getElementById("modal-text")

let horseWasHungry = false;
let horseDeservesWin = false;
let horseWantsWin = false;
let youWantWin = false;

let youWon = false;

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

let guessCount = 0; 

const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");

const offsetFromDate = new Date(2025, 5, 16).getTime();
const msOffset = Date.now() - offsetFromDate;
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24);
const targetWord = targetWords[dayOffset]

let currentMode; 
const GAME_MODES = {
  STANDARD: "standard",
  YES_NO: "yes_no"
}

// fix this to be pretty l8r, this is an artifact from a stranger time
let currentQuestionIndex = 0;
const jokeQuestions = [
  "Welcome to Brongle everypony\n do you want to guess your first word?",
];

let currentSceneId = "start";
let storySequence = {};

const activeSounds = {};
let tracksToResume = [];


// state machine data hence4th
const ogreStorySequence = [
  {
    // Guess 1
    question: "The nefarious ogre appears.",
    btnYes: "oh?", btnNo: "oh!",
    msgYes: "*grawr*", 
    msgNo: "*grawr*",
    actionYes: (tiles) => revealCustomTiles(tiles, ["🌳", "🌲", "🧌", "🌲", "🌳"], ["emoji","emoji","emoji","emoji","emoji",]),
    actionNo:  (tiles) => revealCustomTiles(tiles, ["🌳", "🌲", "🧌", "🌲", "🌳"], ["emoji","emoji","emoji","emoji","emoji",])
  },
  {
    // Guess 2
    question: "Talk to him?",
    btnYes: "Yes", btnNo: "No",
    msgYes: "it's important to trust strangers", 
    msgNo: "GRAWRRR R!!",
    actionYes: (tiles) => revealCustomTiles(tiles, ["🌳", "🌲", "🧌", "💬", "🌳"], ["emoji", "emoji", "emoji", "emoji", "emoji"]),
    actionNo: (tiles) => {
      revealCustomTiles(tiles, ["☠️", "🩸", "🪦", "🩸", "☠️"], ["emoji", "emoji", "emoji", "emoji", "emoji"]);
      setTimeout(() => {
        //danceTiles(tiles);
        setTimeout(() => {
          stopInteraction();
          showShareModal("The ogre killed you in cold blood. Tell the tale?");
        }, 2000);
      }, 1500);
    }
  },
    {
    // Guess 3
    question: "WILL YOU ANSWER MY RIDDLE?",
    btnYes: "Yes", btnNo: "No",
    msgYes: "yayyy ^~^", 
    msgNo: "GRAWRRR R!!",
    actionYes: (tiles) => revealCustomTiles(tiles, ["🏚️", "", "", "", "🚗"], ["emoji", "emoji", "emoji", "emoji", "emoji"]),
    actionNo: (tiles) => {
      revealCustomTiles(tiles, ["☠️", "🩸", "🪦", "🩸", "☠️"], ["emoji", "emoji", "emoji", "emoji", "emoji"]);
      setTimeout(() => {
        //danceTiles(tiles);
        setTimeout(() => {
          stopInteraction();
          showShareModal("The ogre killed you in cold blood. Tell the tale?");
        }, 2000);
      }, 1500);
    }
  },
  {
    // Guess 4
    question: "Can car go home?",
    btnYes: "Yes", btnNo: "No",
    msgYes: "WRONG. NO ROAD. OGRE SMASH.", 
    msgNo: "CORRECT. NO ROAD! OGRE THINK HE LOVE YOU",
    actionYes: (tiles) => {
      revealCustomTiles(tiles, ["☠️", "🩸", "🪦", "🩸", "☠️"], ["emoji", "emoji", "emoji", "emoji", "emoji"]);
      setTimeout(() => {
        //danceTiles(tiles);
        setTimeout(() => {
          stopInteraction();
          showShareModal("The ogre killed you in cold blood. Tell the tale?");
        }, 2000);
      }, 1500);
    },
    actionNo: (tiles) => revealCustomTiles(tiles, ["💕", "💕", "🧌", "💕", "💕"], ["emoji","emoji","emoji","emoji","emoji"])
  },
  {
    // Guess 5
    question: "marriage?",
    btnYes: "yeah sure", btnNo: "nuh uhhhh",
    msgYes: "*church bells ring*!", 
    msgNo: "OGRE CAN'T TAKE IT ANYMORE",
    actionYes: (tiles) => {
      revealCustomTiles(tiles, ["👨", "📸", "🧌", "👰‍♀️", "💐"], ["emoji", "emoji", "emoji", "emoji", "emoji"]);
      setTimeout(() => {
        //danceTiles(tiles);
        setTimeout(() => {
          stopInteraction();
          showShareModal("You two live happily ever after. Share your wedding photos?");
        }, 2000); 
      }, 1500);
    },
    actionNo: (tiles) => revealCustomTiles(tiles, ["💔", "💔", "🧌", "🔫", "💔"], ["emoji", "emoji","emoji", "emoji","emoji"])
  },
  {
    // Guess 6
    question: "OGRE CANT TAKE IT ANYMORE",
    btnYes: "WAIT", btnNo: "PLEASE",
    msgYes: "It's too late...", 
    msgNo: "He doesn't listen...",
    actionYes: (tiles) => playOgreEnd(tiles),
    actionNo: (tiles) => playOgreEnd(tiles)
  }
];

// helper function for guess 5 so as to adhere to DRY
function playOgreEnd(tiles) {
  revealCustomTiles(tiles, ["", "", "🕳️", "", ""], ["emoji", "emoji", "emoji", "emoji", "emoji"]);
  document.body.classList.add("shake");
  
  setTimeout(() => {
    document.body.classList.remove("shake");
    stopInteraction();
    showShareModal("What have you done? can you ever let people know?");
  }, 1500);
}


// TODO: clean up 274 sequence and ogrestorysequence
const twosevenfourSequence = [
  {
    // Guess 1
    question: "Is your favourite colour white?",
    btnYes: "YES", btnNo: "NO",
    msgYes: "yay !", msgNo: "too bad",
    actionYes: (tiles) => revealCustomTiles(tiles, ["", "", "", "", ""], ["white", "white", "white", "white", "white"]),
    actionNo: (tiles) => revealCustomTiles(tiles, ["", "", "", "", ""], ["white", "white", "white", "white", "white"])
  },
  {
    // Guess 2
    question: "Do you like my horse?",
    btnYes: "yes", btnNo: "what horse?",
    msgYes: "me too...", msgNo: "oh you know",
    actionYes: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "", "🐎"], ["emoji", "white", "white", "white", "emoji"]),
    actionNo:  (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "", "🐎"], ["emoji", "white", "white", "white", "emoji"])
  },
  {
    // Guess 3
    question: "Is the horse fast?",
    btnYes: "Yes", btnNo: "No",
    msgYes: "ZOOM !", msgNo: "she's fast enough!!",
    actionYes: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "🐎", ""], ["emoji", "white", "white", "emoji", "purple"]),
    actionNo:  (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "🐎", ""], ["emoji", "white", "white", "emoji", "purple"])
  },
  {
    // Guess 4 (BRANCH)
    question: "Does the horse want to win?",
    btnYes: "Yes", btnNo: "No",
    msgYes: "RAHH !", msgNo: "that's fair",
    actionYes: (tiles) => {
      horseWantsWin = true;
      revealCustomTiles(tiles, ["🏁", "", "🐎", "", ""], ["emoji", "white", "emoji", "purple", "purple"]);
    },
    actionNo:  (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "🐎", ""], ["emoji", "white", "white", "emoji", "purple"])
  },
  {
    // Guess 5 (BRANCH)
    get question() 
    { 
      return horseWantsWin 
        ? "Is the horse hungry?" 
        : "Do you want the horse to win?"; 
    },

    get msgYes() 
    {
        return horseWantsWin 
          ? "oh bet i've gotchu" 
          : "she appreciates your support and is ready to lock in!!";
    },
    get msgNo() 
    {
        return horseWantsWin 
          ? "a true winner keeps her priorities straight" 
          : "see you tomorrow :3 (?)";
    },

    get btnYes() { return horseWantsWin ? "YES" : "YES"; },
    get btnNo() { return horseWantsWin ? "NO" : "NO"; },

    actionYes: (tiles) => 
    {
      if (horseWantsWin) 
      {
        horseWasHungry = true; 
        revealCustomTiles(tiles, ["🏁", "🐎", "", "", "🍎"], ["emoji", "emoji", "purple", "purple", "emoji"]);
      }
      else
      {
        youWantWin = true;
        revealCustomTiles(tiles, ["🏁", "", "🐎", "", ""], ["emoji", "white", "emoji", "purple", "purple"]);
      }
    },

    actionNo: (tiles) => 
    {
      if (horseWantsWin) 
      {
        horseWasHungry = false; 
        revealCustomTiles(tiles, ["🏁", "🐎", "", "", ""], ["emoji", "emoji", "purple", "purple", "purple"]);
      }
      else
      {
        revealCustomTiles(tiles, ["❌", "❌", "❌", "❌", "❌"], ["emoji", "emoji","emoji","emoji","emoji"]);
        setTimeout(() => 
        {
          danceTiles(tiles);
          
            showAlert("the horse and you alike are simply chilling", 5000);

          // wait 2 seconds 4 dance to play out 
          // before the share modal covers the screen
          setTimeout(() => {
              stopInteraction(); // Kill inputs
              showShareModal("THE HORSE AND YOU ALIKE ARE SIMPLY CHILLING");
          }, 2000); 
        }, 1500);
      }
    }
  },
  {

    // Guess 6 (BRANCH)
    get question() { 
      return horseWasHungry 
        ? "awagwagawa?" 
        : "Does the horse deserve to win?"; 
    },
    get btnYes() { return horseWasHungry ? "go my noble steed" : "Absolutely"; },
    get btnNo() { return horseWasHungry ? "go my noble steed" : "not yet"; },
    
    get msgYes() 
    {
        if (youWantWin)
          return "no !!!! she hasn't put in the work yet! !!"
        else if (horseWasHungry)
          return "she trots gallantly"
        else
        return horseWantsWin 
          ? "oh bet i've gotchu" 
          : "she appreciates your support and is ready to lock in!!";
    },
    get msgNo() 
    {
        if (youWantWin)
          return "that's right, she still needs to reach the finish line"

        if (horseWasHungry)
          return "she trots gallantly"
        else
         return "she admires the goalpost";
    },

    actionYes: (tiles) => {
      if (horseWasHungry) {
        revealCustomTiles(tiles, ["🏁", "", "🐎", "", "🍎"], ["emoji", "red", "emoji", "purple", "emoji"]);
      } else {
        // HORSE DIDN'T WANT WIN BUT YOU DO, NOW YOU SAY "ABSOLUTELY" TO "DOES THE HORSE DESERVE TO WIN"
        if (youWantWin)
        {
          revealCustomTiles(tiles, ["🏁", "", "🥫", "", ""], ["emoji", "white","emoji","purple","purple"]);
          setTimeout(() => 
          {
            danceTiles(tiles);
            
           showAlert("behold the tragedy", 5000);

            // wait 2 seconds 4 dance to play out 
            // before the share modal covers the screen
            setTimeout(() => {
                stopInteraction(); // Kill inputs
                showShareModal("glue time");
            }, 2000); 
          }, 1500);
        }
        else 
        {
        youWon = true;
        revealCustomTiles(tiles, ["", "", "", "", ""], ["purple","purple","purple", "purple", "purple"]);
          setTimeout(() => 
          {
            danceTiles(tiles);
            
           showAlert("CHAMPION!!", 5000);

            // wait 2 seconds 4 dance to play out 
            // before the share modal covers the screen
            setTimeout(() => {
                stopInteraction(); // Kill inputs
                showShareModal("win");
            }, 2000); 
          }, 1500);
        }
      }
    },
    actionNo: (tiles) => {
      if (youWantWin)
        revealCustomTiles(tiles, ["🏁", "🐎", "", "", ""], ["emoji", "emoji", "purple", "purple", "purple"]);

      if (horseWasHungry)
             revealCustomTiles(tiles, ["🏁", "", "🐎", "", "🍎"], ["emoji", "red", "emoji", "purple", "emoji"]);
      else
        {
         horseDeservesWin = false;
         revealCustomTiles(tiles, ["🏁", "🐎", "", "", ""], ["emoji", "emoji", "purple","purple","purple",]);
        }
    }
  },
  {
    // Guess 7 
    get question() {
      if (horseWasHungry) return "awigugi??";
      else return "The crowd is cheering! One last trot?";
    },
    get btnYes() 
    {
       return horseWasHungry ? "go my noble steed" : "lets go"; 
    },
    get btnNo() 
    {
       return horseWasHungry ? "go my noble steed" : "sleepy horsie."; 
    },

    get msgYes() 
    {
        if (horseWasHungry)
          return "she trots gallantly"

        return "lets go!"
    },
    get msgNo() 
    {
        if (horseWasHungry)
          return "she trots gallantly"
        
        return "mimimimi";
    },

    actionYes: (tiles) => {
        if (horseWasHungry)
          revealCustomTiles(tiles, ["🏁", "", "", "🐎", "🍎"], ["emoji", "red", "red", "emoji", "emoji"]);
        else
        {
          revealCustomTiles(tiles, ["🏆", "🐎", "", "", ""], ["emoji", "emoji", "purple", "purple", "purple"]);
          
           setTimeout(() => 
          {
            danceTiles(tiles);
            
           showAlert("CHAMPION!!", 5000);

            // wait 2 seconds 4 dance to play out 
            // before the share modal covers the screen
            setTimeout(() => {
                stopInteraction(); // Kill inputs
                showShareModal("win");
            }, 2000); 
          }, 1500);
        }
    },
    actionNo: (tiles) => {
      if (horseWasHungry)
        revealCustomTiles(tiles, ["🏁", "", "", "🐎", "🍎"], ["emoji", "red", "red", "emoji", "emoji"]);
      else
      {
        revealCustomTiles(tiles, ["💤", "🐎", "💤", "", ""], ["emoji", "emoji", "emoji", "purple", "purple"]);

        
          setTimeout(() => 
          {
            danceTiles(tiles);
            
           showAlert("eepy sneep", 5000);

            // wait 2 seconds 4 dance to play out 
            // before the share modal covers the screen
            setTimeout(() => {
                stopInteraction(); // Kill inputs
                showShareModal("sleepy horsie");
            }, 2000); 
          }, 1500);
      }
    },
  },
  {
    // Guess 8 
    get question() {
      return "could the apple be poisoned??";
    },
    get btnYes() 
    {
       return "probably ya"
    },
    get btnNo() 
    {
       return "don't care, horsie hungry"
    },

        get msgYes() 
    {
      return "*sound of apple being crushed in a mare's maw*"
    },
    get msgNo() 
    {
      return "*sound of apple being crushed in a mare's maw*"
    },

    actionYes: (tiles) => {
      revealCustomTiles(tiles, ["🏁", "", "", "", "🐎"], ["emoji", "red", "red", "red", "emoji"]);
    },
    actionNo: (tiles) => {
      revealCustomTiles(tiles, ["🏁", "", "", "", "🐎"], ["emoji", "red", "red", "red", "emoji"]);
    }
  },
{
    // Guess 9 unlocks secret row
    get question() { return "are you stupid?"; },
    btnYes: "i don't kno", btnNo: "i don't knowe",
    
    get msgYes() 
    {
      return "please take one last good look at horsie"
    },
    get msgNo() 
    {
      return "please take one last good look at horsie"
    },

    // these actions ONLY flip the 9th row tiles. 
    // secret row is revealed by submitGuess.
    actionYes: (tiles) => { revealCustomTiles(tiles, ["🏁", "", "", "", "🐴"], ["emoji", "red", "red", "red", "emoji"]); },
    actionNo: (tiles) => { revealCustomTiles(tiles, ["🏁", "", "", "", "🐴"], ["emoji", "red", "red", "red", "emoji"]); }
  },
  {
    // Guess 10 (secret!)
    get question() { return "Where shall Mrs. Horsie go?"; },
    btnYes: "SEE YOU IN HELL.", btnNo: "I WANT TO SEE YOU IN HEAVEN.",

    get msgYes() 
    {
      return "what the fuck dude"
    },
    get msgNo() 
    {
      return "eaven..."
    },

    actionYes: (tiles) => { 
      revealCustomTiles(tiles, ["🏁", "", "", "", "💥"], ["emoji", "red", "red", "red", "emoji"]);
      document.body.classList.add("shake");

          setTimeout(() => 
          {
            danceTiles(tiles);
            
          document.body.classList.remove("shake");

           showAlert("THE HORSE DESCENDS", 5000);

            // wait 2 seconds 4 dance to play out 
            // before the share modal covers the screen
            setTimeout(() => {
                stopInteraction(); // Kill inputs
                showShareModal("hell");
            }, 2000); 
          }, 1500);
    },
    actionNo: (tiles) => { // 'tiles' is now the secret row!
      revealCustomTiles(tiles, ["☁️", "☁️", "🐎", "☁️", "☁️"], ["emoji", "emoji", "emoji", "emoji", "emoji"]);
          setTimeout(() => 
          {
            danceTiles(tiles);
            
           showAlert("THE HORSE ASCENDS", 5000);

            // wait 2 seconds 4 dance to play out 
            // before the share modal covers the screen
            setTimeout(() => {
                stopInteraction(); // Kill inputs
                showShareModal("eaven");
            }, 2000); 
          }, 1500);
    }
  }
];

const eleDanceSequence = 
{
  "start":
  {
    question: "welcome, will you take good care of my elephant?",
    btnYes: "yeah!", btnNo: "yeah...",

    nextYes: "hit it",
    nextNo: "hit it",

    actionYes: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
    actionNo: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
  },

  "hit it":
  {
    question: "the elephant stands by idly",
    btnYes: "HIT IT", btnNo: "HIT IT",

    nextYes: "i said hit it",
    nextNo: "i said hit it",

    actionYes: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
    actionNo: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
  },

  "i said hit it":
  {
    question: "the elephant stands by idly",
    btnYes: "I SAID", btnNo: "HIT IT",

    msgYes: "Dance music fills the room. It's an elephant party.", 
    msgNo:  "Dance music fills the room. It's an elephant party.",

    nextYes: "tango or metal",
    nextNo:  "tango or metal",


    actionYes: (tiles) => 
    {
      playTrack('polka.mp3', { volume: 0.4, isBGM: true });
      // IMPORTANT do this b4 elephant starts to dance, otherwise mobile breaks -w-
      revealCustomTiles(tiles, ["🟥", "🟩", "🐘", "🟦", "🟨"], ["emoji","emoji","emoji","emoji","emoji"]);

      setTimeout(() => {
          tiles[2].classList.add("elephant-dance"); 
        }, 500);
    },
    actionNo: (tiles) => 
    {
      playTrack('polka.mp3', { volume: 0.4, isBGM: true });
      
      revealCustomTiles(tiles, ["🟥", "🟩", "🐘", "🟦", "🟨"], ["emoji","emoji","emoji","emoji","emoji"]);
      
      setTimeout(() => {
        tiles[2].classList.add("elephant-dance"); 
      }, 500);
    },
  },

  "tango or metal":
  {
    question: "do you wish to tango?",
    btnYes: "i thought you'd never ask!", 
    btnNo: "actually, i prefer metal",

    msgYes: "you dance into the night, what a delight!",
    msgNo: "say no more.",

        actionYes: (tiles) => 
    {
      revealCustomTiles(tiles, ["💃", "🟥", "🐘", "🟨", "🕺"], ["emoji", "emoji","emoji","emoji","emoji",])

      setTimeout(() => 
      {
        [0, 2, 4].forEach(i => tiles[i].classList.add("elephant-dance"));
      }, 500);
      stopInteraction();

      setTimeout(() => {
        showAlert("woo !!", 5000);
        danceTiles(tiles);
        setTimeout(() => {
          showShareModal("invite others to the party?");
        }, 2000);
      }, 1500);
    },

    actionNo: (tiles) => 
    {
      playTrack("runningOnMetal.mp3", {isBGM: true})
      playTrack("chainSounds.mp3")
      revealCustomTiles(tiles, ["🛢️", "⛓️", "🐘", "⛓️", "🛢️"], ["emoji","emoji","emoji","emoji","emoji",])

      stopInteraction();

      setTimeout(() => {
        showAlert("it's... \n beautiful", 5000);
        // danceTiles(tiles);
        setTimeout(() => {
          showShareModal("invite the rest of the metal community?");
        }, 2000);
      }, 1500);
    }
  },
}


// generic helper to animate custom tile setups
function revealCustomTiles(tiles, contents, states) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");
        tile.textContent = contents[index];
        tile.dataset.state = states[index]; 
      }, { once: true });
    }, index * 100); // 250ms stagger?
  });
}

// GAME LOGIC STARTS HERE
initGame()

function initGame() {
  showNextQuestion()
  // determine mode based on day number (dayOffset)
  if (dayOffset === 274) { 
    // horse Story 
    currentMode = GAME_MODES.YES_NO;
    storySequence = twosevenfourSequence; 
  } else if (dayOffset === 275) { 
    // ogre Story 
    currentMode = GAME_MODES.YES_NO;
    storySequence = ogreStorySequence;
  } else if (dayOffset === 276) { 
    // elephant dance party
    currentMode = GAME_MODES.YES_NO;
    storySequence = eleDanceSequence;
  } else {
    // standard wordle, failsafe although we never want this to trigger ofc
    currentMode = GAME_MODES.NORMAL; 
  }

  // for story days, wait for user to type their first word
  if (currentMode === GAME_MODES.YES_NO) {
    startInteraction(); 
    // basic wordle day day, just start the game
  } else {
    startInteraction();
  }
}

function showNextQuestion() {
  if (currentQuestionIndex < jokeQuestions.length) {
    stopInteraction();
    modalText.textContent = jokeQuestions[currentQuestionIndex];
    modal.classList.remove("hidden");

    // logic for BOTH buttons is the same for now
    const handleChoice = () => {
      modal.classList.add("hidden");
      revealEmptyBoxes(); 
      currentQuestionIndex++;
      
      // small delay before next question pops up
      setTimeout(showNextQuestion, 300); 
    };

    yesBtn.onclick = handleChoice;
    noBtn.onclick = handleChoice;
  } else {
    // start the actual game.
    startInteraction();
    showAlert("go!!", 300);
  }
}

// probably not needed anymore ?
function revealEmptyBoxes() {
  const activeTiles = getActiveTiles();
  activeTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      
      // listen for the flip to finish, then turn it white
      tile.addEventListener("transitionend", () => {
        tile.classList.remove("flip");
        tile.dataset.state = "white"; 
        tile.textContent = ""; // empty just to make sure
      }, { once: true });
      
    }, index * 100); // staggered reveal like the real Wordle
  });
}

function startInteraction() {
  document.addEventListener("click", handleMouseClick)
  document.addEventListener("keydown", handleKeyPress)
}

function stopInteraction() {
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

  if (e.key === "Backspace" || e.key === "Delete") {
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
  const nextTile = container.querySelector(":not([data-letter])")

  // if empty tile exists, fill it
  if (nextTile) {
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }
}

function deleteKey() {
  const activeTiles = getActiveTiles()
  const lastTile = activeTiles[activeTiles.length - 1]
  if (lastTile == null) return
  lastTile.textContent = ""
  delete lastTile.dataset.state
  delete lastTile.dataset.letter
}

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

function submitGuess() {
  const activeTiles = [...getActiveTiles()];
  const guess = getValidGuess(activeTiles);
  if (!guess) return;

  stopInteraction();

  if (currentMode === GAME_MODES.YES_NO) 
  {
    const currentStory = storySequence[currentSceneId];

    const handleChoice = (isYes) => 
    {
      const message = isYes ? currentStory.msgYes : currentStory.msgNo;

      const finishTurn = () => 
      {
        modal.classList.add("hidden");
        yesBtn.style.display = 'inline-block';
        noBtn.style.display = 'inline-block';

        if (isYes) currentStory.actionYes(activeTiles);
        else currentStory.actionNo(activeTiles);

        guessCount++;

        const nextId = isYes ? currentStory.nextYes : currentStory.nextNo;

        if (nextId && storySequence[nextId]) 
        {
          currentSceneId = nextId; 
          setTimeout(startInteraction, 1500);
        } else 
        {
          console.log("Brongle Story Finalized.");
        }
      };
      if (!message || message.trim() === "") 
      {
        finishTurn();
      } else 
      {
        modalText.textContent = message;
        yesBtn.style.display = 'none';
        noBtn.style.display = 'none';
        setTimeout(finishTurn, 1500);
      }
    };

    modalText.textContent = currentStory.question;
    yesBtn.textContent = currentStory.btnYes;
    noBtn.textContent = currentStory.btnNo;
    modal.classList.remove("hidden");

    yesBtn.onclick = () => handleChoice(true);
    noBtn.onclick = () => handleChoice(false);

  } else 
  {
    // standard wordle logic
    activeTiles.forEach((...params) => flipTile(...params, guess));
  }
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
  alert.textContent = message
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


function showShareModal(resultType) {
  modal.classList.remove("hidden");
  yesBtn.style.display = "inline-block";
  noBtn.style.display = "none"; // hide the No button

  if (resultType === "win") 
  {
    modalText.textContent = "The Horse Won! Share your glory?";
  } 
  else if (resultType === "glue time")
  {
     modalText.textContent = "something happened to the horse.\n do you wish to share her legacy?";
  }
    else if (resultType === "sleepy horsie")
  {
     modalText.textContent = "the horse sleeps soundly until tomorrow \n\n let the people know?";
  }
      else if (resultType === "hell")
  {
     modalText.textContent = "it's hot in here\n BUT YOU KNOW WHAT'S EVEN HOTTER THAT'S RIGHT SHARING YOUR SCORE";
  }
      else if (resultType === "eaven")
  {
     modalText.textContent = "blessed be your mared friend \n share if you cried?";
  }
  else
  {
    modalText.textContent = resultType;
  }

  yesBtn.textContent = "Copy Result";
  yesBtn.onclick = () => {
    generateShareString();
    //showAlert("Result copied to clipboard!", 2000);
  };
}

 function generateShareString() {

  const secretRow = document.getElementById("secret-row");

  const isSecretActive = secretRow && !secretRow.classList.contains("hidden");


  // dynamic header

  const displayCount = isSecretActive ? 10 : guessCount;

  let shareText = `Daily Brongle #${dayOffset} ${displayCount}/9\n\n`;


  // main grid 

  const gridTiles = [...document.querySelectorAll(".guess-grid .tile")];


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

    const secretTiles = secretRow.querySelectorAll(".tile");

    secretTiles.forEach(t => {

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

// this function is here to save us against performance hogs and/or dogs
// will need to update in case you use different files than mp3
function playTrack(fileName, { loop = true, volume = 1.0, isBGM = false,} = {}) {
  // if BGM, stop any active bgm
  if (isBGM && activeSounds["bgm"]) {
    activeSounds["bgm"].pause();
    activeSounds["bgm"].src = "";
    delete activeSounds["bgm"];
  }

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