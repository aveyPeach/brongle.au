/* global dictionary, targetWords */
// @ts-check

const modal = document.getElementById("question-modal")
const yesBtn = document.getElementById("yes-btn")
const noBtn = document.getElementById("no-btn")
const modalText = document.getElementById("modal-text")

let horseWasHungry = false;
let horseDeservesWin = false;
let horseWantsWin = false;
let youWantWin = false;

let gameOver = false;

const WORD_LENGTH = 5;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

let guessCount = 0; 

const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");

// set at hour 12 to account for daylight savings apparently that works
const offsetFromDate = new Date(2025, 5, 16).getTime();
const msOffset = Date.now() - offsetFromDate;
const dayOffset = Math.floor(msOffset / 1000 / 60 / 60 / 24);
const targetWord = targetWords[dayOffset]

let currentMode; 
const GAME_MODES = {
  STANDARD: "standard",
  YES_NO: "yes_no"
}

let currentSceneId = "start";
let storySequence = {};

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


// TODO: fix bug which breaks game if u type too fast after answering a question sometimes

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

    choices: 
    [
      { 
        text: "Yeah!", 
        next: "hit it", 
        action: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
      },
      { 
        text: "Yeah...", 
        next: "hit it", 
        action: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
      },
      { 
        text: "hehe", 
        next: "hit it", 
        msg: "i'm a witch and i'm evil",
        action: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
      },
    ]
  },

  "hit it":
  {
    question: "the elephant stands by idly",
    choices:
    [
      {
        text: "HIT IT",
        next: "i said hit it",
        action: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
      },
      {
        text: "HIT IT",
        next: "i said hit it",
        action: (tiles) => revealCustomTiles(tiles, ["", "", "🐘", "", ""], ["white", "white", "emoji", "white", "white"]),
      }
    ]
  },

  "i said hit it":
  {
    question: "the elephant stands by idly",

    choices:
    [
      {
         text: "I SAID",
         next: "tango or metal",
         msg: "Dance music fills the room. It's an elephant party.", 
         action: (tiles) => 
        {
          playTrack('polka.mp3', { volume: 0.4, isBGM: true });
          // IMPORTANT do this b4 elephant starts to dance, otherwise mobile breaks -w-
          revealCustomTiles(tiles, ["🟥", "🟩", "🐘", "🟦", "🟨"], ["emoji","emoji","emoji","emoji","emoji"]);

          setTimeout(() => {
              tiles[2].classList.add("elephant-dance"); 
            }, 500);
        },
      },
      {
         text: "HIT IT",
         next: "tango or metal",
         msg: "Dance music fills the room. It's an elephant party.", 
         action: (tiles) => 
        {
          playTrack('polka.mp3', { volume: 0.4, isBGM: true });
          // IMPORTANT do this b4 elephant starts to dance, otherwise mobile breaks -w-
          revealCustomTiles(tiles, ["🟥", "🟩", "🐘", "🟦", "🟨"], ["emoji","emoji","emoji","emoji","emoji"]);

          setTimeout(() => {
              tiles[2].classList.add("elephant-dance"); 
            }, 500);
        },
      },
    ]
  },

  "tango or metal":
  {
    question: "do you wish to tango?",

    choices:
    [
      {
        text: "i thought you'd never ask!",
        msg: "you dance into the night, what a delight!",
        action: (tiles) => 
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
      },
      {
        text: "actually, i prefer metal",
        msg: "say no more.",
        action: (tiles) => 
        {
          playTrack("runningOnMetal.mp3", {isBGM: true});
          playTrack("chainSounds.mp3");
          revealCustomTiles(tiles, ["🛢️", "⛓️", "🐘", "⛓️", "🛢️"], ["emoji","emoji","emoji","emoji","emoji",]);

          stopInteraction();

          setTimeout(() => 
          {
            showAlert("it's... \n beautiful", 5000);
            // danceTiles(tiles);
            setTimeout(() => 
            {
              showShareModal("invite the rest of the metal community?");
            }, 2000);
          }, 1500);
        }
      }
    ]
  },
}

const cutoutTigerSeq = 
{
  "start":
  {
    question: "WATCH OUT! \n a ferocious tiger sleeps in your path",

    action: (tiles) => revealCustomTiles(tiles, ["🧍", "", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
    next: "sneak?",

    choices:
    [
      {
        text: "oh! thanks for letting me know!",
      },
      {
        text: "ok??? \n did i ask?",
      }
    ],
  },

  // branching path
  "sneak?":
  {
    question: "your only path forward is sneaking past the tiger.\n what will you do?",

    choices:
    [
      {
        text: "carefully move closer",

        next: "sneak1",

        action: (tiles) => revealCustomTiles(tiles, ["", "🚶‍➡️", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "SCREAM LOUD AS FUCK",

        next: "loud1",

        action: (tiles) => revealCustomTiles(tiles, ["🧍", "📣", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      }
    ]
  },

  "sneak1":
  {
    question: "the tiger is fast asleep",

    choices:
    [
      {
        text: "keep moving",
        next: "sneak2",
        action: (tiles) => revealCustomTiles(tiles, ["", "", "🚶‍➡️", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      }
    ]
  },

  "sneak2":
  {
    question: "the tiger is fast asleep",

    choices:
    [
      {
        text: "keep moving",
        next: "sneak3",
        action: (tiles) => revealCustomTiles(tiles, ["", "", "", "🧍", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      }
    ]
  },

    "sneak3":
  {
    question: "wait, it's a trap! the tiger is a cardboard cutout !!",

    msg: "you went where the grass is greener",
    action: (tiles) => 
    {
      revealCustomTiles(tiles, ["", "", "", "🕳️", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]);
      stopInteraction();
      
      setTimeout(() => 
      {
        if (tiles[4]) {
          tiles[4].classList.add("falling-cutout");
        }
      }, 1000);

      setTimeout(() => 
      {
        showAlert(".....", 5000);
        // danceTiles(tiles);
        setTimeout(() => 
        {
          showShareModal("try to bring others down with you?");
        }, 2000);
      }, 1500);
    },

    choices:
    [
      {
        text: "OH NO",
      },
      {
        text: "OH noOOOOO",  
      }
    ],
  },


  "loud1":
  {
    question: "The Tiger remains fast asleep, better not test your luck again.",

    choices:
    [
      {
        text: "Start sneaking, while you still can.",
        // TODO: make sure that the game ends in a satisfying way if you decide to sneak late
        next: "sneak1",
        action: (tiles) => revealCustomTiles(tiles, ["", "🚶‍➡️", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "bang pots and pans",
        next: "loud2",
        action: (tiles) => revealCustomTiles(tiles, ["🧍", "🍳", "🥘", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
    ]
  },

  "loud2":
  {
    question: "The tiger is fast asleep, which might not be the case for much longer.",

    choices:
    [
      {
        text: "Start sneaking, before it's too late.",
        // TODO: make sure that the game ends in a satisfying way if you decide to sneak late
        next: "sneak1",
        action: (tiles) => revealCustomTiles(tiles, ["", "🚶‍➡️", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "practice your new guitar solo",
        next: "loud3",
        action: (tiles) => revealCustomTiles(tiles, ["🧍", "🎸", "🎶", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
    ]
  },

  "loud3":
  {
    question: "The Tiger is fast asleep. Not sure how.",

    choices:
    [
      {
        text: "Quit your charades immediately and start sneaking.",
        // TODO: make sure that the game ends in a satisfying way if you decide to sneak late
        next: "sneak1",
        action: (tiles) => revealCustomTiles(tiles, ["", "🚶‍➡️", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "do some minor construction",
        next: "loud4",
        action: (tiles) => revealCustomTiles(tiles, ["🧍", "🏗️", "🏠", "🚧", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
    ]
  },

  "loud4":
  {
    question: "The tiger is asleep, but perhaps hard of hearing.",

    choices:
    [
      {
        text: "Start sneaking or you will DIE",
        // LAST CHANCE TO SNEAK ! can probably do smth with that
        // probably activate a flag here :3
        next: "sneak1",
        action: (tiles) => revealCustomTiles(tiles, ["", "🚶‍➡️", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "fire up a jet engine",
        next: "loud5",
        action: (tiles) => revealCustomTiles(tiles, ["🧍", "✈️", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
    ]
  },

  "loud5":
  {
    question:"HOW",

    choices:
    [
      {
        text: "if you can't beat em, join em",
        msg: "*creaking noise*",

        action: (tiles) => 
        { 
          revealCustomTiles(tiles, ["🐅", "💤", "", "", "🐅"], ["emoji","emoji","emoji","emoji","emoji"]);
          
          stopInteraction();

          showAlert("?", 5000);

          setTimeout(() => 
          {
            if (tiles[4]) {
              tiles[4].classList.add("falling-cutout");
            }
          }, 1000);
          
          setTimeout(() => {
            setTimeout(() => {
              showShareModal("make it a sleepover?");
            }, 2000);
          }, 1500);
        }, 
      },
    {
        text: "smash 10^23 deuterium nuclei together (epilepsy warning)",
        next: "futureOrPast",
        action: (tiles) => 
        {
          // 1. Reveal the radioactive tiles
          revealCustomTiles(tiles, ["", "☢️", "💥", "☢️", ""], ["emoji","emoji","emoji","emoji","emoji"]);

          // 2. Start the violent earthquake immediately
          document.body.classList.add("nuke-shake");

          // 3. Spawn the "Flashbang" overlay
          const flash = document.createElement("div");
          flash.style.position = "fixed";
          flash.style.top = "0";
          flash.style.left = "0";
          flash.style.width = "100vw";
          flash.style.height = "100vh";
          flash.style.backgroundColor = "white";
          flash.style.opacity = "0"; // Starts invisible
          flash.style.zIndex = "9999"; // Ensures it covers EVERYTHING
          flash.style.pointerEvents = "none"; // Lets clicks pass through if needed
          
          // The magic line: tells CSS to smoothly animate the opacity over 2.5 seconds
          flash.style.transition = "opacity 2.5s ease-in"; 
          
          document.body.appendChild(flash);

          // 4. Trigger the blinding light a split second later (so the browser registers the CSS)
          setTimeout(() => {
            flash.style.opacity = "1";
          }, 50);

          // 5. The Aftermath (Clean up)
          setTimeout(() => {
            // Stop the earthquake
            document.body.classList.remove("nuke-shake");
            
            // Fade the white screen back out over 2 seconds so they can read the next prompt
            flash.style.transition = "opacity 2s ease-out";
            flash.style.opacity = "0";
            
            // Delete the flashbang element entirely once it's invisible
            setTimeout(() => flash.remove(), 2000);
          }, 3000); // 3 seconds of total chaos before fading out
        }
      }
     ]
  },

  "futureOrPast":
  {
    question: "perhaps the land will become hospitable again someday",

    choices:
    [
      {
        text: "see into the future",
        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["🌳", "🐒", "🌳", "🐅", "🌲"], ["emoji","emoji","emoji","emoji","emoji"]);

          setTimeout(() => 
          {
            showAlert(".....", 5000);
            danceTiles(tiles);
            setTimeout(() => 
            {
              showShareModal("fig 1. a tiger waiting to pounce on its prey");
            }, 2000);
          }, 2500);
        },
      },
      {
        text: "see into the past",
        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["", "", "🧌", "🕳️", "🐅"], ["emoji","emoji","emoji","emoji","emoji"]);

          setTimeout(() => 
          {
            danceTiles(tiles);
            setTimeout(() => 
            {
              showShareModal("fig 2. a troll sets a clever trap");
            }, 2000);
          }, 2500);
        }
      }
    ]
  },
}

const guessGameSeq = 
{
  "start":
  {
    question: "hello! :)",

    next: "wannaGuess",

    action: (tiles) => revealCustomTiles(tiles, ["✋", "", "🙂", "", "✋"], ["emoji","emoji","emoji","emoji","emoji",]),

    choices:
    [
    ]
  },

  "wannaGuess":
  {
    question: "would you like to play a guessing game?",

    choices:
    [
      {
        text: "yes",
        next: "yesGuess",
        action: (tiles) => revealCustomTiles(tiles, ["✊", "", "🙂", "", "✊"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "no",

        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["✊", "", "☹️", "", "✊"], ["emoji","emoji","emoji","emoji","emoji",]),

          endGame("share your distrust of gamers?");
        }
      }
    ]
  },

  "yesGuess":
  {
    question: "one of my hands holds a precious gift, guess which one!",

    choices:
    [
      {
        text: "left",
        next: "leftHand",
        action: (tiles) => revealCustomTiles(tiles, ["✋", "🧬", "🙂", "", "✊"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "right",
        msg: "You receive a respectable sum of 7 dollars and 53 cents. The bills are crumpled.",
        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["✊", "🪙", "🙂", "💵", "✋"], ["emoji","emoji","emoji","emoji","emoji",]),

          win(tiles, "laugh all the way to the bank?", "i mean i'll take it");
        }  
      },
    ]
  },

  "leftHand":
  {
    question: "It's the gift of life. Will you accept?",
    
    choices:
    [
      {
        text: "yes",
        next: "yesLife",

        action: (tiles) => revealCustomTiles(tiles, ["🧬", "🧬", "🧬", "🧬", "🧬"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "no",
        msg: "not a fan of life huh?",
        msgBtn: "i guess?",

        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["✋", "🧬", "🫤", "", "✊"], ["emoji","emoji","emoji","emoji","emoji",]),
          endGame("propagate your biophobia?")
        }
      },
      {
        text: "hey what's in your right hand?",
        next: "hideLeft1",
        
        msg: "i don't know what you're talking about",
        msgBtn: "whag",

        action: (tiles) => revealCustomTiles(tiles, ["✋", "🧬", "🙂", "", ""], ["emoji","emoji","emoji","emoji","emoji",]),
      },
    ]
  },

  "yesLife":
  {
    question: "what form of life will you bring into this world?",

    choices:
    [
      {
        text: "a bug",

        msg: "BEHOLD",

        action: (tiles) =>
        {
          revealCustomTiles(tiles, ["", "", "🐛", "", ""], ["emoji","emoji","emoji","emoji","emoji",]),
          
          win(tiles, "Bug someone else?", "seems kind of smug.")
        },
      },
      {
        text: "a plant",

        msg: "behold. a beautiful baby boy. \n both of his parents will go on to have blue names on wikipedia",

        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["", "", "👶", "", ""], ["emoji","emoji","emoji","emoji","emoji",]),

          win(tiles, "drop mid and fall off?", "gugugaga on my jeans~");
        }
        
      },
      {
        text: "a friend",

        msg: "they promise to always be with you :)",

        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["", "", "🦠", "", ""], ["emoji","emoji","emoji","emoji","emoji",]),

          win(tiles, "Infect your friends and loved ones?", "i'm here 4 u <3")
        }
      },
    ]
  },

  "hideLeft1":
  {
    question: "It's the gift of life. Will you accept?",

    choices:
    [
      {
        text: "yes",
        next: "yesLife",

        action: (tiles) => revealCustomTiles(tiles, ["🧬", "🧬", "🧬", "🧬", "🧬"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "no",
        msg: "not a fan of life huh?",
        msgBtn: "i guess?",

        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["✊", "🧬", "🫤", "", ""], ["emoji","emoji","emoji","emoji","emoji",]),
          endGame("propagate your biophobia?")
        }
      },
      {
        text: "your right hand, what's in it?",
        next: "hideLeft2",

        msg: "i'm sorry, you must be misremembering, i've never had a right hand",
        
        msgBtn: "???",
        
        action: (tiles) => 
        {
          //unflip rightmost tiles
          unflipTiles([4,9,14]);
          revealCustomTiles(tiles, ["✋", "🧬", "🙂", "", ""], ["emoji","emoji","emoji","emoji","emoji",]);
        }
      },
    ]
  },

  "hideLeft2":
  {
    question: "It's the gift of life. Will you accept?",

    choices:
    [
      {
        text: "yes",
        next: "yesLife",

        action: (tiles) => revealCustomTiles(tiles, ["🧬", "🧬", "🧬", "🧬", "🧬"], ["emoji","emoji","emoji","emoji","emoji",]),
      },
      {
        text: "no",

        msg: "not a fan of life huh?",
        msgBtn: "i guess?",

        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["✊", "🧬", "🫤", "", ""], ["emoji","emoji","emoji","emoji","emoji",]),
          endGame("propagate your biophobia?")
        }
      },
      {
        text: "i don't want to play this game anymore",
        
        msg: "o-oh okay",
        
        msgBtn: "...",
        
        action: (tiles) => 
        {
          revealCustomTiles(tiles, ["✋", "🧬", "🥺", "", ""], ["emoji","emoji","emoji","emoji","emoji",]);

          endGame("share your bafflement?");
        }
      },
    ]
  },
}

const pirateSeq = 
{
  // TODO: give option to trigger first tiles automatically
  "start":
  {
    question: "Arr ye awake, captain?",
    next: "boardOrTail",
    
    action: standaRevealEmojis("🚢", "🏴‍☠️", "🌊", "🏴‍☠️", "🚢")
  },

  "boardOrTail":
  {
    question: "Your barrelman spots an unfamiliar flagship. Who dare lay claim to these waters?",
    choices:
    [
      {
        text: "board it!",
        next: "board",
        msg: "aye aye captain!",
        msgBtn: "aye!",

        action: standaRevealEmojis("🌊", "🚢", "🌉", "🚢", "🌊")
      },
      {
        text: "turn tail",
        msg: "arf arf captain!",
        next: "tailTurned",

        action: standaRevealEmojis("🐕", "🏴‍☠️", "🌊", "🏴‍☠️", "🚢")
      },
    ]
  },

  "board":
  {
    question: "The deck squeaks under the feet of hundreds of men engaged in combat",
    choices:
    [
      {
        text: "Find their captain",
        next: "findCaptain",

        action: standaRevealEmojis("","","🧔🏻‍♀️","🦜","")
      },
      {
        text: "Loot the treasury",
        next: "treasuryNoKey",

        action: standaRevealEmojis("🟫", "🟫", "🚪", "🟫", "🟫")
      },
    ]
  },

  "tailTurned":
  {
    question: "Aye captain, we're out scot free, what now?",
    choices:
    [
      {
        text: "Turn whale",
        msg: "The ship buckles under your weight. You let out a commemorative spout in honor of your fallen mates, then swim out into the great beyond",
        msgBtn: "next",

        action: (tiles) =>
        {
          revealEmojis(tiles, "", "", "🐳", "", "");
          win(tiles, "Search for your pod?", "*WUUUUOAAA~*");
        }

      },
      {
        text: "Turn male",
        next: "male",
        msg: "Aye we did find a box of steroids on our last voyage, why do ye ask?", 
        // CHECK B4 SHIP
        msgBtn: "Been thinking of getting into doping",

        action: standaRevealEmojis("", "", "🐕", "♂️", ""),
      },
    ]
  },

  "male":
  {
    // CHECK B4 SHIP
    question: "You admire your masculinisation. What's next?",
    choices:
    [
      {
        text: "pay bail",
        msg: "You hear cries of joy over the horizon, as though an imprisoned captain was just set free",
        msgBtn: "my karma must be soaring",

        action: (tiles) =>
        {
          revealEmojis(tiles, "", "🏴‍☠️", "🧝", "❣️", "");
          win(tiles, "Casually let the world know you're a REALLY GOOD PERSON?", "*THANKS FOR THE BAIL KIND STRANGER*");
        }
      },
      {
        text: "attempt to make butter",
        msg: "You repeatedly agitate a bowl of cream to no avail, as it dawns on you that the ranch you raided last week only raised half-and-half cows.",
        msgBtn: "churn failed </3",

        action: (tiles) =>
        {
          revealEmojis(tiles, "", "🧈", "❌", "💔", "");
          endGame("Share your tales of butter fails?", "i can't do anything right...",);
        }
      },
    ]
  },

  "findCaptain":
  {
    question: "You spot a man donning a bedazzled robe with a parrot on his shoulder",
    choices:
    [
      {
        text:"attack him",
        next: "attackCaptain1",
        action: standaRevealEmojis("", "", "⚔️", "", ""),
      },
      {
        text:"murk the fuckinf bird",
        next:"murkBird",
        action: standaRevealEmojis("", "🦴", "💀", "🦴", "",)
      },
    ]
  },

  "treasuryNoKey":
  {
    question: "You try to push the door open but it's locked. You hear the thud of footsteps behind you.",
    choices:
    [
      {
        text: "next",
        next: "ruffianCombat",
        msg: "You are suddenly engaged in combat with a dozen ruffians, the odds don't seem stacked in your favor",
        msgBtn: "oh bother",

        action: standaRevealEmojis("🟫", "🟫", "⚔️", "🟫", "🟫")
      },
    ]
  },

  "ruffianCombat":
  {
    question: "What will you do?",
    choices:
    [
      {
        text: "Hail mary",
        next: "hailMary",
        msg: "You throw your entire body against the door and collapse along with it. You reach for your pistol and begin firing at the choke point, hoping to take down as many as possible.",
        msgBtn: "Next",

        action: standaRevealEmojis("💥", "💥", "🔫", "💥", "💥"),
      },
      {
        text: "Surrender",
        msg: "You live locked under enemy deck. The darkness slowly dulls your senses. Hunger and thirst tear at you. Death can't come soon enough.",
        msgBtn: "ohno",

        action: (tiles) =>
        {
          revealEmojis(tiles, "", "", "", "", "",);
          endGame("Scream for help?", "AAAAAA");
        }
      },
    ]
  },

  "hailMary":
  {
    question: "The goons begin to thin out. Soon enough you spot the familiar faces of your crew. The mission was a success.",
    
    choices: 
    [
      {
        text: "rawr,, i mean yarr!",
        next: "hiCrew",
        action: standaRevealEmojis("🧔🏻‍♀️", "🧔🏽", "👨🏼", "🧔🏿", "👩🏾", )
      }
    ]

  },

  "hiCrew":
  {
    question: "Treasure time!",
    next: "treasureTime",

    action: standaRevealEmojis("💰", "🏅", "💛", "🏆", "🪙",)
  },

  "treasureTime":
  {
    question: "Enough to feed the crew for a whole year!",
    choices:
    [
      {
        text: "Haul it to the ship",
        msg: "You sail away, your crew mates take to song and drink in celebration. This will be a good year for the Yelling At Retail Workers Pirates",
        msgBtn: "aye",
        action: (tiles) => 
        {
          revealEmojis(tiles, "🌊", "🎶", "⛴️", "🥂", "🌊");
          win(tiles, "Show a retail worker who's boss?", "yohohoho~ yohohohoooo~");
        }
      },
      {
        text: "Leave it, stealing is bad",
        msg: "You sail away not having achieved anything, it was a slaughter for the sake of slaughter. Your crew will have their way with you.",
        msgBtn: "😟",
        action: (tiles) => 
        {
          revealEmojis(tiles, "🌊", "🌊", "🚢", "🌊", "🌊", );
          endGame("Find a better captain?", "coward's way out");
        }
      },
    ]
  },

  "attackCaptain1":
  {
    question: "Your cutlasses cross. You try to make eye contact but his gaze lays elsewhere. He looks gangly and sick.",
    choices:
    [
      {
        text: "cut low",
        next: "attackCaptain2",
        action: standaRevealEmojis("", "", "🩻", "", "", ),
      },
      {
        text: "cut high",
        next: "attackCaptain2",
        action: standaRevealEmojis("", "", "🩻", "", "", ),
      },
      {
        text: "KILL THAT PARROT",
        // note the backtick (just to the left of '1' key, which lets you make multiline strings ^~^)
        msg: `You swing at the parrot. Just as your blade is about to make contact a searing pain pierces through your ribcage. 
        You got careless. Everything goes dark.`,
        msgBtn: "i should've known...",

        action: (tiles) => 
        {
          revealEmojis(tiles, "", "", "", "", "",),
          endGame("Pray that someone else murks that fuckinf bird?", "*squawk*")
        }
      },
    ]
  },

  "attackCaptain2":
  {
    question: "You cut his robe. It falls to the ground with a loud thud, revealing deep gashes in his torso. No one could've survived that.",
    choices:
    [
      {
        msg: "You should've killed me when you had the chance",
        msgBtn: "you..",
        action: (tiles) =>
        {
          revealEmojis(tiles, "", "", "🦜", "", "", ),
          endGame("Pray that someone else murks that fuckinf bird?", "*squawk*")
        }
      },
    ]
  },

  "murkBird":
  {
    question: "The captain collapses. Before you lay a man with sunken eyes and a skeletal frame. Long dead, even before you boarded his ship.",
    choices:
    [
      {
        text: "next",
        next: "stareAtCadaver",

        action: standaRevealEmojis("", "🦴", "🗝️", "🦴", "", )
      },
    ]
  },

  "stareAtCadaver":
  {
    question: "You stare at the cadaver. A key dangles from one his ribs. You reach for it",
    choices:
    [
      {
        text: "Head to the treasury",
        next: "treasuryYesKey",

        action: standaRevealEmojis("🟫", "🟫", "🚪", "🟫", "🟫")
      },
      {
        text: "Kick the corpse",
        msg: "What the hell is your problem???? Alright. lightning strikes a clear sky and you die in excruciating pain. screw you.",
        msgBtn: "funny :)",
        action: (tiles) =>
        {
          revealEmojis(tiles, "⚡", "⚡", "⚡", "⚡", "⚡"),
          endGame("You're hopeless.", "*MAY YOU NEVER STEP PAW IN THIS LAND AGAIN*");
        }
      },
    ]
  },
  
 "treasuryYesKey":
  {
    question: "You unlock the door and enter",
    choices:
    [
      {
        text: "treasure time!",
        next: "treasureTime",

        action: standaRevealEmojis("💰", "🏅", "💛", "🏆", "🪙",)
      },
    ]
  },
  "1":
  {
    question: "",
    choices:
    [
      {

      },
      {
        
      },
    ]
  },
}

/**
 * 
 * @param {HTMLElement[]} tiles 
 * @param {String} emoji1 
 * @param {String} emoji2 
 * @param {String} emoji3 
 * @param {String} emoji4 
 * @param {String} emoji5 
 */
function revealEmojis(tiles, emoji1, emoji2, emoji3, emoji4, emoji5)
{
  revealCustomTiles(tiles, [emoji1, emoji2, emoji3, emoji4, emoji5], ["emoji","emoji","emoji","emoji","emoji"]);
}

/**
 * Factory function to create emoji reveal actions for cleaner sequence definitions
 * @param {String} emoji1 
 * @param {String} emoji2 
 * @param {String} emoji3 
 * @param {String} emoji4 
 * @param {String} emoji5 
 * @returns {Function} Action function ready to use in sequence definitions
 */
// short for standaloneRevealEmojis
function standaRevealEmojis(emoji1, emoji2, emoji3, emoji4, emoji5) {
  return (tiles) => revealEmojis(tiles, emoji1, emoji2, emoji3, emoji4, emoji5);
}

// GAME LOGIC STARTS HERE
initGame()

function initGame() 
{
  showAlert("BRONGLE TIME :]");
  currentMode = GAME_MODES.YES_NO;
  // determine mode based on day number (dayOffset)
  if (dayOffset === 274) 
  { 
    storySequence = twosevenfourSequence; 
  } 
  else if (dayOffset === 275) 
  { 
    storySequence = ogreStorySequence;
  } 
  else if (dayOffset === 276) 
  { 
    storySequence = eleDanceSequence;
  }
  else if (dayOffset === 277) 
  { 
    storySequence = cutoutTigerSeq;
  }
  else if (dayOffset === 278)
  {
    storySequence = guessGameSeq;
  }
  else if (dayOffset === 279)
  {
    storySequence = pirateSeq;
  }

  else 
  {
    // standard wordle, failsafe although we never want this to trigger ofc
    currentMode = GAME_MODES.NORMAL; 
  }

  startInteraction();
}


/**
 * @param {HTMLElement[]} tiles
 * @param {String} alertMsg
 * @param {String} shareMsg
 */
function win(tiles, shareMsg, alertMsg = "")
{
  gameOver = true;

  setTimeout(() => 
  {
    danceTiles(tiles);

    if (alertMsg != "")
      showAlert(alertMsg);

    setTimeout(() => 
    {
      showShareModal(shareMsg);
    }, 2000);
  }, 1500)
}

/**
 * @param {String} shareMsg
 */
function endGame(shareMsg, alertMsg = "")
{
  gameOver = true;

  setTimeout(() => 
  {
    if (alertMsg != "")
      showAlert(alertMsg);

    setTimeout(() => 
    {
      showShareModal(shareMsg);
    }, 2000);
  }, 1500)
}

// generic helper to animate custom tile setups
function revealCustomTiles(tiles, contents, states) 
{
  tiles.forEach((tile, index) => 
  {
    setTimeout(() => 
    {
      tile.classList.add("flip");
      tile.addEventListener("transitionend", () => 
      {
        tile.classList.remove("flip");
        tile.textContent = contents[index];
        tile.dataset.state = states[index]; 
      }, { once: true });
    }, index * 100); // 250ms stagger?
  });
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


function finishTurn(currentStory, choice, activeTiles)
{
  modal.classList.add("hidden");
      
  if (currentStory.action) currentStory.action(activeTiles);

  // questionmarks implement optional chaining ensure that we only do this if 'choice' exists :3
  if (choice?.action) choice?.action(activeTiles);
      
  guessCount++;

  // optional chaining '?' for safety
  const nextId = choice?.next || currentStory.next; 

  if (nextId && storySequence[nextId])
  {
    currentSceneId = nextId;
    setTimeout(startInteraction, 1500);
  }
  else if(!gameOver)
  {
    endGame("the dev was sleepy and forgot to specify where the game goes next, sorry! feel free to send a bug report to them^~^");
  }
}

/**
 * @param {String} btnText
 */
function createContinueBtn(btnText = "next")
{
  const continueBtn = document.createElement("button");
  continueBtn.textContent = btnText;
  continueBtn.classList.add("key");

  return continueBtn;
}

function ResetBtnContainer(buttonContainer)
{
  buttonContainer.innerHTML = ""; 
  buttonContainer.style.display = "flex"; // Ensure it's visible
}


/**
 * @param {any} currentStory
 * @param {HTMLElement[]} activeTiles
 * @param {HTMLElement} buttonContainer
 */
function setupChoices(currentStory, activeTiles, buttonContainer)
{
  currentStory.choices.forEach(choice => 
  {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.classList.add("key"); 

    btn.onclick = () => 
    {
      const message = choice.msg || "";

      // this wraps the function call so you don't have to keep track of args in multiple places
      const finishWrap = () => finishTurn(currentStory, choice, activeTiles);

      if (!message || message.trim() === "") 
      {
        finishWrap();
      } 
      else 
      {
        modalText.textContent = message;
        
        ResetBtnContainer(buttonContainer);

        const continueBtn = createContinueBtn(choice.msgBtn);
        continueBtn.onclick = finishWrap; 
        buttonContainer.appendChild(continueBtn);
      }
    };

    buttonContainer.appendChild(btn);
  });
}

function handleSeqTurn(guess, activeTiles) {
  const currentStory = storySequence[currentSceneId];
  const buttonContainer = document.getElementById("choice-button-container");

  // safety check
  if (!currentStory) return;

  ResetBtnContainer(buttonContainer);

  // handle question text
  if (currentStory.question && currentStory.question.trim() !== "") 
  {
    modalText.textContent = currentStory.question;
  } else 
  {
    modalText.textContent = ""; // Keep it empty if no question
  }

  // analyse contents of current scene
  const hasChoices = currentStory.choices && currentStory.choices.length > 0;
  const hasQuestion = currentStory.question && currentStory.question.trim() !== "";

  // no question, no choices -> run action and skip
  if (!hasQuestion && !hasChoices) 
  {
    if (currentStory.action) currentStory.action(activeTiles);
    
    // Move to next turn immediately (finishTurn handles the 1.5s interaction delay)
    finishTurn(currentStory, null, activeTiles);
    return; 
  }

  // standard node -> show  modal
  if (hasChoices) 
  {
    setupChoices(currentStory, activeTiles, buttonContainer);
  } else {
    // cutscene case: question exists, no buttons
    setTimeout(() => 
    {
      finishTurn(currentStory, null, activeTiles);
    }, 2000);
  }

  modal.classList.remove("hidden");
}

function submitGuess() 
{
  const activeTiles = /** @type {HTMLElement[]} */ (Array.from(getActiveTiles()));
  const guess = getValidGuess(activeTiles);
  if (!guess) return;

  stopInteraction();

  if (currentMode === GAME_MODES.YES_NO) 
  {
    handleSeqTurn(guess, activeTiles);
  }
  else 
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
  const buttonContainer = document.getElementById("choice-button-container");
  
  // 1. Safety Check: If this container doesn't exist, we can't show buttons!
  if (!buttonContainer) {
    console.error("Ogre Error: Could not find 'choice-button-container' in your HTML!");
    return;
  }

  // 2. Clear out old story buttons and show the modal
  buttonContainer.innerHTML = ""; 
  buttonContainer.style.display = "flex"; // Ensure it's using your row layout
  modal.classList.remove("hidden");

  // 3. Set the text based on the result
  if (resultType === "win") {
    modalText.textContent = "The Horse Won! Share your glory?";
  } else if (resultType === "glue time") {
    modalText.textContent = "Something happened to the horse...\nShare her legacy?";
  } else if (resultType === "sleepy horsie") {
    modalText.textContent = "The horse sleeps soundly until tomorrow.\nLet the people know?";
  } else if (resultType === "hell") {
    modalText.textContent = "It's hot in here...\nBUT SHARING YOUR SCORE IS HOTTER!";
  } else if (resultType === "eaven") {
    modalText.textContent = "Blessed be your mared friend.\nShare if you cried?";
  } else {
    // Falls back to whatever string you passed (like "invite others to the party?")
    modalText.textContent = resultType;
  }

  // 4. Create the "Copy Result" button from scratch
  const shareBtn = document.createElement("button");
  shareBtn.textContent = "Copy Result";
  
  // VITAL: This gives it the Wordle key look from your CSS
  shareBtn.classList.add("key"); 
  
  // Make it wide enough for the text
  shareBtn.style.minWidth = "200px"; 

  shareBtn.onclick = () => {
    generateShareString();
    // Optional: add a little juice so the user knows it worked
    shareBtn.textContent = "COPIED ^~^";
    setTimeout(() => { shareBtn.textContent = "Copy Result"; }, 2000);
  };

  // 5. Actually put the button on the screen
  buttonContainer.appendChild(shareBtn);
}

function generateShareString() 
{
  
  const secretRow = document.getElementById("secret-row");

  const isSecretActive = secretRow && !secretRow.classList.contains("hidden");


  // dynamic header

  const displayCount = isSecretActive ? 10 : guessCount;

  let shareText = `Daily Brongle #${dayOffset} ${displayCount}/9\n\n`;


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