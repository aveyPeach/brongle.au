
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
function standaRevealEmojis(emoji1, emoji2, emoji3, emoji4, emoji5) 
{
  return (tiles) => revealEmojis(tiles, emoji1, emoji2, emoji3, emoji4, emoji5);
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



// REMAKE (old version is in graveyard)
const twoSevenFourAKAhorse =
{
  hasSecretScene: true,

  secretNode: "heavenOrHell",

  "start":
  {
    question: "Is your favourite colour white?",

    choices:
    [
      {
        text: "YES",
        msg: "yay !",
        next: "areYouStupid",
      },
      {
        text: "NO",
        msg: "too bad",
        next: "white",
      },
    ]
  },

  "white":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["", "", "", "", ""], ["white", "white", "white", "white", "white"]),

    question: "Do you like my horse?",

    choices:
    [
      {
        text: "yes",
        msg: "me too...",
        next: "horseFast",
      },
      {
        text: "what horse?",
        msg: "oh you know",
        next: "horseFast",
      },
    ]
  },

  "horseFast":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "", "🐎"], ["emoji", "white", "white", "white", "emoji"]),

    question: "Is the horse fast?",

    choices:
    [
      {
        text: "Yes",
        msg: "ZOOM",
        next: "horseWantWin",
      },
      {
        text: "No",
        msg: "she's fast enough!!",
        next: "horseWantWin",
      },
    ]
  },

  "horseWantWin":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "🐎", ""], ["emoji", "white", "white", "emoji", "purple"]),

    question: "Does the horse want to win?",

    choices:
    [
      {
        text: "Yes",
        msg: "RAHH",
        next: "isHorseHungry",
      },
      {
        text: "No",
        msg: "that's fair",
        next: "doYouWantHorseWin",
      },
    ]
  },

  "isHorseHungry":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "🐎", "", ""], ["emoji", "white", "emoji", "purple", "purple"]),

    question: "Is the horse hungry?",

    choices:
    [
      {
        text: "YES",
        msg: "oh bet i've gotchu",
        next: "horseGoApple1",
      },
      {
        text: "NO",
        msg: "a true winner keeps her priorities straight",
        next: "fastestFinishLine",
      },
    ]
  },

  "doYouWantHorseWin":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "🐎", ""], ["emoji", "white", "white", "emoji", "purple"]),

    question: "Do you want the horse to win?",

    choices:
    [
      {
        text: "YES",
        msg: "she appreciates your support and is ready to lock in!!",
        next: "backOnTrack",
      },
      {
        text: "NO",
        msg: "see you tomorrow :3 (?)",
        next: "noOneWantsWin",
      },
    ]
  },

  "backOnTrack":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "🐎", "", ""], ["emoji", "white", "emoji", "purple", "purple"]),

    question: "Does the horse deserve to win?",

    choices:
    [
      {
        text: "Absolutely",
        msg: "no !!!! she hasn't put in the work yet! !!",
        next: "smthHappensToHorse",
      },
      {
        text: "not yet",
        msg: "that's right, she still needs to reach the finish line",
        next: "atFinishLine",
      },
    ]
  },

  "noOneWantsWin":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["❌", "❌", "❌", "❌", "❌"], ["emoji", "emoji","emoji","emoji","emoji"]),

    gg: (tiles) => win(tiles, "THE HORSE AND YOU ALIKE ARE SIMPLY CHILLING", "the horse and you alike are simply chilling", )
  },

  "fastestFinishLine":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "🐎", "", "", ""], ["emoji", "emoji", "purple", "purple", "purple"]),

    question: "Does the horse deserve to win?",

    choices:
    [
      {
        text: "Absolutely",
        msg: "oh bet i've gotchu",
        next: "fastestWin",
      },
      {
        text: "not yet",
        msg: "she admires the goalpost",
        next: "atFinishLine",
      },
    ]
  },

  "fastestWin":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["", "", "", "", ""], ["purple","purple","purple", "purple", "purple"]),

    gg: (tiles) => win(tiles, "The Horse Won! Share your glory?", "CHAMPION!!"),
  },

  "atFinishLine":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "🐎", "", "", ""], ["emoji", "emoji", "purple", "purple", "purple"]),

    question: "The crowd is cheering! One last trot?",

    choices:
    [
      {
        text: "let's go",
        msg: "lets go!",
        next: "oneLastTrotWin",
      },
      {
        text: "sleepy horsie.",
        msg: "mimimimi",
        next: "sleepyHorsie",
      },
    ]
  },


  "oneLastTrotWin":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏆", "🐎", "", "", ""], ["emoji", "emoji", "purple", "purple", "purple"]),

    gg: (tiles) => win(tiles, "The Horse Won! Share your glory?", "CHAMPION!!"),
  },


  "sleepyHorsie":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["💤", "🐎", "💤", "", ""], ["emoji", "emoji", "emoji", "purple", "purple"]),

    gg: (tiles) => win(tiles, "The horse sleeps soundly until tomorrow.\nLet the people know?", "eepy sneep"),
  },

  
  "smthHappensToHorse":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "🥫", "", ""], ["emoji", "white","emoji","purple","purple"]),

    gg: (tiles) => win(tiles, "Something happened to the horse...\nShare her legacy?", "behold the tragedy")
  },

  "horseGoApple1":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "🐎", "", "", "🍎"], ["emoji", "emoji", "purple", "purple", "emoji"]),

    question: "awagwagawa?",

    choices:
    [
      {
        text: "go my noble steed",
        msg: "she trots gallantly",
        next: "horseGoApple2",
      },
      {
        text: "go my noble steed",
        msg: "she trots gallantly",
        next: "horseGoApple2",
      },
    ]
  },

  "horseGoApple2":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "🐎", "", "🍎"], ["emoji", "red", "emoji", "purple", "emoji"]),

    question: "awigugi??",

    choices:
    [
      {
        text: "go my noble steed",
        msg: "she trots gallantly",
        next: "applePoison",
      },
      {
        text: "go my noble steed",
        msg: "she trots gallantly",
        next: "applePoison",
      },
    ]
  },

  "applePoison":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "🐎", "🍎"], ["emoji", "red", "red", "emoji", "emoji"]),

    question: "could the apple be poisoned??",

    choices:
    [
      {
        text: "probably ya",
        msg: "*sound of apple being crushed in a mare's maw*",
        next: "areYouStupid",
      },
      {
        text: "don't care, horsie hungry",
        msg: "*sound of apple being crushed in a mare's maw*",
        next: "areYouStupid",
      },
    ]
  },



  "areYouStupid":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "", "🐎"], ["emoji", "red", "red", "red", "emoji"]),

    question: "are you stupid?",

    choices:
    [
      {
        text: "i don't kno",
        msg: "please take one last good look at horsie",
        next: "heavenOrHell",
      },
      {
        text: "i don't knowe",
        msg: "please take one last good look at horsie",
        next: "heavenOrHell",
      },
    ]
  },

  "heavenOrHell":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "", "🐴"], ["emoji", "red", "red", "red", "emoji"]),

    question: "Where shall Mrs. Horsie go?",

    choices:
    [
      {
        text: "SEE YOU IN HELL.",
        msg: "what the fuck dude",
        next: "hell",
      },
      {
        text: "I DO WANT TO SEE YOU IN HEAVEN.",
        msg: "eaven...",
        next: "heaven",
      },
    ]
  },

  "heaven":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["☁️", "☁️", "🐎", "☁️", "☁️"], ["emoji", "emoji", "emoji", "emoji", "emoji"]),

    gg: (tiles) => win(tiles, "Blessed be your mared friend.\nShare if you cried?", "THE HORSE ASCENDS"),
  },

  "hell":
  {
    reveal: (tiles) => revealCustomTiles(tiles, ["🏁", "", "", "", "💥"], ["emoji", "red", "red", "red", "emoji"]),

    gg: (tiles) =>
    {
      document.body.classList.add("shake");

      setTimeout(() => 
      {       
        document.body.classList.remove("shake");

        endGame("It's hot in here...\nBUT YOU KNOW WHAT'S EVEN HOTTER THAT'S RIGHT SHARING YOUR SCORE!", "damn")
      }, 2500);
    }
  },
}

const ogreEncounter = 
[
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

const eleDance = 
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
          playTrack('assets/music/polka.mp3', { volume: 0.4, isBGM: true });
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
          playTrack('assets/music/polka.mp3', { volume: 0.4, isBGM: true });
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
          playTrack("assets/music/runningOnMetal.mp3", {isBGM: true});
          playTrack("assets/music/chainSounds.mp3");
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

const cutoutTiger = 
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

const guessGame = 
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

const pirateRaid = 
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
        text: "next",

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
        msg: "What the hell is your problem???? Alright. lightning strikes from a clear sky and you die in excruciating pain. screw you.",
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

const swampMonster =
{
  "start":
  {
    question: "have you ever wanted to be a swamp monster chasing after innocent bystanders?",

    choices:
    [
      {
        text: "of course!",
        msg: "you get me",
        next: "lunge",
        action: standaRevealEmojis("🦑", "🌲", "🌳", "🌲", "🏃‍➡️",)
      },
      {
        text: "no?",
        msg: "can't knock it til' you've tried it :)",
        next: "lunge",
        action: standaRevealEmojis("🦑", "🌲", "🌳", "🌲", "🏃‍➡️",)
      },
    ]
  },

  "lunge":
  {
    question: "what does a swamp monster do best?",

    choices:
    [
      {
        text: "lunge!",
        next: "lunge/lunch",
        action: standaRevealEmojis("🌲", "🦑", "🌳", "🌲", "🏃‍➡️",)
      },
    ]
  },

  "lunge/lunch":
  {
    question: "what does a swamp monster do best?",

    choices:
    [
      {
        text: "lunge!",
        next: "lunge/bunch",
        action: standaRevealEmojis("🌲", "🌳", "🦑", "🌲", "🏃‍➡️",)
      },
      {
        text: "lunch",
        action: (tiles) =>
        {
          revealEmojis(tiles, "🦑", "🥪", "🧺", "🥪", "🧘",);
          win(tiles, "Share your food?", "*mwmwmwmmwmwmwm*")
        }  
      },
    ]
  },

  "lunge/bunch":
  {
    question: "what does a swamp monster do best?",

    choices:
    [
      {
        text: "lunge",
        next: "lunge/hunch",
        action: standaRevealEmojis("🌲", "🌳", "🌲", "🦑", "🏃‍➡️",)
      },
      {
        text: "bunch",
        action: (tiles) =>
        {
          revealEmojis(tiles, "🦑", "🦑", "🦑", "🦑", "🦑",);
          win(tiles, "Bring more swampies into your ranks?", "hi! hi! hi! hi! hi!")
        }  
      },
    ]
  },

  "lunge/hunch":
  {
    question: "what does a swamp monster do best?",

    choices:
    [
      {
        text: "LUNGE!",
        action: (tiles) =>
        {
          revealEmojis(tiles, "🌳", "🦑", "💀", "🦴", "🌲",);
          win(tiles, "look for more victims?", "yum!")
        }  
      },
      {
        text: "hunch",
        msg: "You remember that yuri exists, then promptly spend the rest of your evening hunched over your screen watching love blossom between the peppy pink haired protagonist and her reserved yet passionate pottery class senpai.",
        msgBtn: "waow",

        action: (tiles) =>
        {
          revealEmojis(tiles, "🌳", "🌳", "💻", "🦐", "🌲",);
          win(tiles, "Sow the seeds of girl love?", "YURI!!!")
        }  
      },
    ]
  },

  "hunch":
  {
    question: "what does a swamp monster do best?",

    choices:
    [
      {

      },
      {

      },
    ]
  },

}

const altDream =
{
  "start":
  {
    question: "After a long day of work you finally get to kill the lights and go to sleep.",

    choices:
    [
      {
        text: "dream",
        next: "grandmaDream",

      },
      {
        text: "stay awake",
        next: "stayAwake",
      },
    ]
  },

  "grandmaDream":
  {
    reveal: standaRevealEmojis("💓", "💓", "👵", "💓", "💓", ),

    question: "GRANDMA SEX DREAM",

    choices:
    [
      {
        text: "DIFFERENT DREAM DIFFERENT DREAM",
        next: "diffDream",
      },
      {
        text: "wake up",
        next: "wakeUp",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",      
      },
    ]
  },

  "diffDream":
  {
    reveal: standaRevealEmojis("", "🪽", "🌇", "🪽", "", ),

    question: ("You're flying over an unfamiliar skyline." +  
      "You're somewhat of a bizarre hybrid between a pigeon and an animal you're not sure exists"),

    choices:
    [
      {
        text: "booooring",
        next: "dentist",
        action: standaRevealEmojis("⬜", "🦶", "🦷", "👩‍⚕️", "⬜", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "dentist":
  {
    question: "You're at the dentist having your toes removed." +
              "It's your aunt that you haven't seen in years. Her office smells damp.",

    choices:
    [
      {
        text: "just 5 more minutes",
        next: "5more",
        // middle one is a troll
        action: standaRevealEmojis("🌲", "🌳", "🧌", "🕳️", "🌲", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "5more":
  {
    question: "You're observing a troll emerging from a hole in the ground. The hole is left unguarded.",

    choices:
    [
      {
        text: "jump in",
        next: "jumpIn",
        action: standaRevealEmojis("", "", "🗄️", "", "", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "jumpIn":
  {
    question: "The hole leads to a room. It's empty aside from a file cabinet",

    choices:
    [
      {
        text: "open the cabinet",
        next: "openCabinet",
        action: standaRevealEmojis("💓", "💓", "👵", "💓", "💓", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        next: "wakeUp",
      },
    ]
  },

  "openCabinet":
  {
    question: "ITS YOUR GRANDMA GETTING DEMOLISHED AGAIN",

    choices:
    [
      {
        text: "WAKE UP",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles, "⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

    "stayAwake":
  {
    reveal: standaRevealEmojis("", "", "😑", "📱", "", ),

    question: "just a little scroll..",

    choices:
    [
      {
        text: "next",
        next: "noSleep",
        action: standaRevealEmojis("⏰", "😴", "🛏️", "🌇", "☕", ),
      },
    ]
  },

    "noSleep":
  {
    question: "You didn't sleep, better get to work on time.",

    choices:
    [
      {
        text: "drive to work",
        msg: "You fell asleep at the wheel on your way to work. I don't want to describe the rest. You sicken me.",
        action: (tiles) =>
        {
          revealEmojis(tiles, "😴", "🚗", "🤰", "💀", "🪦", ),
          endGame("tell a cautionary tale?", ".....")
        }
      },
    ]
  },

  "wakeUp":
  {
    reveal: standaRevealEmojis("⏰", "🥱", "🛏️", "🌅", "🥣", ),

    gg: (tiles) => win(tiles, "Have a hearty breakfast?", "it was all a dream...")
  },
}

const dream =
{
  "start":
  {
    question: "After a long day of work you finally get to kill the lights and go to sleep.",

    choices:
    [
      {
        text: "dream",
        next: "grandmaDream",

        action: standaRevealEmojis("💓", "💓", "👵", "💓", "💓", ),
      },
      {
        text: "stay awake",
        next: "stayAwake",

        action: standaRevealEmojis("", "", "😑", "📱", "", ),
      },
    ]
  },

  "grandmaDream":
  {
    question: "GRANDMA SEX DREAM",

    choices:
    [
      {
        text: "DIFFERENT DREAM DIFFERENT DREAM",
        next: "diffDream",

        action: standaRevealEmojis("", "🪽", "🌇", "🪽", "", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "diffDream":
  {
    question: ("You're flying over an unfamiliar skyline." +  
      "You're somewhat of a bizarre hybrid between a pigeon and an animal you're not sure exists"),

    choices:
    [
      {
        text: "booooring",
        next: "dentist",
        action: standaRevealEmojis("⬜", "🦶", "🦷", "👩‍⚕️", "⬜", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "dentist":
  {
    question: "You're at the dentist having your toes removed." +
              "It's your aunt that you haven't seen in years. Her office smells damp.",

    choices:
    [
      {
        text: "just 5 more minutes",
        next: "5more",
        // middle one is a troll
        action: standaRevealEmojis("🌲", "🌳", "🧌", "🕳️", "🌲", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "5more":
  {
    question: "You're observing a troll emerging from a hole in the ground. The hole is left unguarded.",

    choices:
    [
      {
        text: "jump in",
        next: "jumpIn",
        action: standaRevealEmojis("", "", "🗄️", "", "", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles,"⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

    "jumpIn":
  {
    question: "The hole leads to a room. It's empty aside from a file cabinet",

    choices:
    [
      {
        text: "open the cabinet",
        next: "openCabinet",
        action: standaRevealEmojis("💓", "💓", "👵", "💓", "💓", ),
      },
      {
        text: "wake up",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles, "⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

  "openCabinet":
  {
    question: "ITS YOUR GRANDMA GETTING DEMOLISHED AGAIN",

    choices:
    [
      {
        text: "WAKE UP",
        msg: "wake up sleepyhead..",
        msgBtn: "uwghghghhh",
        action: (tiles) => 
        {
          revealEmojis(tiles, "⏰", "🥱", "🛏️", "🌅", "🥣", ),
          win(tiles, "Have a hearty breakfast?", "it was all a dream...")
        }
      },
    ]
  },

    "stayAwake":
  {
    question: "just a little scroll..",

    choices:
    [
      {
        text: "next",
        next: "noSleep",
        action: standaRevealEmojis("⏰", "😴", "🛏️", "🌇", "☕", ),
      },
    ]
  },

    "noSleep":
  {
    question: "You didn't sleep, better get to work on time.",

    choices:
    [
      {
        text: "drive to work",
        msg: "You fell asleep at the wheel on your way to work. I don't want to describe the rest. You sicken me.",
        action: (tiles) =>
        {
          revealEmojis(tiles, "😴", "🚗", "🤰", "💀", "🪦", ),
          endGame("tell a cautionary tale?", ".....")
        }
      },
    ]
  },

}

const propHunt =
{
  "start": 
  {
    question: "welcome! today we hunt props! get ready for the first scene!",

    choices: 
    [
      {
        text: "next", next: "bedroom",
      }
    ]
  },

  "bedroom":
  {
    reveal: standaRevealEmojis("🛏️", "🪑", "🖼️", "🚜", "🖥️",),

    question: "which object doesn't belong in a *bedroom*?",

    choices:
    [
      {
        text: "bed",
      },
      {
        text: "chair",
      },
      {
        text: "painting",
      },
      {
        text: "tractor",
        msg: "It's a shape shifter!!! It quickly escapes and runs over to a farm.",
        msgBtn: "go to farm",
        next: "farm",
      },
      {
        text: "computer",
      },
    ]
  },

  "farm":
  {
    reveal: standaRevealEmojis("🌳", "🦤", "🪵", "🚜", "🐍",),

    question: "which object doesn't belong on a *farm*?",

    choices:
    [
      {
        text: "tree",
      },
      {
        text: "dodo",
        msg: "That's right! Dodos don't exist anymore! (</3). Now the shape shifter flies up to space!",
        msgBtn: "go to space",
        next: "space",
      },
      {
        text: "stump",
      },
      {
        text: "tractor",
      },
      {
        text: "snake",
      },
    ]
  },

  "space":
  {
    reveal: standaRevealEmojis("🌎", "🚀", "👩‍🚀", "🏐", "🌠",),

    question: "what shouldn't you see in *space*?",

    choices:
    [
      {
        text: "tellus",
      },
      {
        text: "rocket",
      },
      {
        text: "astronaut",
      },
      {
        text: "beachball",
        msg: "That's right! It's a beachball, not a spaceball. The shapeshifter gets a craving for sweets and promptly hurries to the nearest candy shop!",
        msgBtn: "go to candy shop",
        next: "candyShop",
      },
      {
        text: "shooting star",
      },
    ]
  },

  "candyShop":
  {
    reveal: standaRevealEmojis("🍫", "🍭", "🍬", "🍷", "🧁",),

    question: "which object doesn't belong in a *candy shop*?",

    choices:
    [
      {
        text: "chocolate",
      },
      {
        text: "lollipop",
      },
      {
        text: "candy",
      },
      {
        text: "wine",
        msg: "That's right! Wine belong in my mouth while the kids aren't home. The shapeshifter moves from the realm of sweet foods to starchy ones!",
        msgBtn: "go to potato farm",
        next: "potatoFarm",
      },
      {
        text: "cupcake",
      },
    ]
  },

  "potatoFarm":
  {
    reveal: standaRevealEmojis("🥔", "🥔", "🥔", "🍟", "🥔",),

    question: "which object doesn't belong on a *potato farm*?",

    choices:
    [
      {
        text: "nice potato",
      },
      {
        text: "mean potato",
      },
      {
        text: "furious potato",
      },
      {
        text: "french fries",
        msg: "That's right! French fries can't be on a farm because France has no farms! Also the shapeshifter went to a theme park :)",
        msgBtn: "go to theme park",
        next: "themePark",
      },
      {
        text: "non-suspicious potato",
        msg: "i guess you don't trust my judgement ;~;",
        msgBtn: "my bad"
      },
    ]
  },

  "themePark":
  {
    reveal: standaRevealEmojis("🎠", "👯", "🐎", "🎆", "🤹‍♀️",),

    question: "which object doesn't belong at a *theme park*?",

    choices:
    [
      {
        text: "merry-go-horse",
      },
      {
        text: "dancing daisy and her sister",
      },
      {
        text: "hoarsey",
        msg: "That's right! horses are dangerous and should not be let into theme parks !!",
        next: "band"
      },
      {
        text: "ferris wheel",
      },
      {
        text: "juggling janice",
      },
    ]
  },

  "band":
  {
    reveal: standaRevealEmojis("🎸", "🥁", "👩‍🎤", "💵", "🎷",),

    question: "The shapeshifter finally seems exhausted, now's your chance! Which object doesn't belong in a *band*?",

    choices:
    [
      {
        text: "guitar",
      },
      {
        text: "drums",
      },
      {
        text: "singer",
      },
      {
        text: "money",
        msg: "That's right! You won't make a dime in a band. The shapeshifter is finally in your grasp. You can't really see what it is, but it feels feline :3",
        msgBtn: "yayy :)",
        next: "gg"
      },
      {
        text: "saxophone",
      },
    ]
  },

  "gg":
  {
    reveal: standaRevealEmojis("", "", "❓", "", "",),

    gg: (tiles) => win(tiles, getPropHuntSharePrompt(), "mreo!")
  }
}


const surviveNight =
{
  "start":
  {
    next: "harshNights"
  },

  "harshNights":
  {
    reveal: standaRevealEmojis("🌲", "❄️", "🌲", "❄️", "🌲",),

    question: "The nights get especially harsh this time of year. You better figure something out.",

    choices:
    [
      {
        text: "stoke a fire",
        next: "stokeFire",
      },
      {
        text: "get naked and run around",
        next: "getNaked",
      },
    ]
  },

"stokeFire":
  {
    reveal: standaRevealEmojis("❄️", "❄️", "🪾", "❄️", "❄️",),

    question: "All of the branches are soaked, this isn't going anywhere. You see a hut on a nearby hill.",

    choices:
    [
      {
        text: "Go to the hut",
        next: "goHut",
      },
      {
        text: "Stay outside",
        next: "stayOutside",
      },
    ]
  },
  
  "goHut":
  {
    reveal: standaRevealEmojis("", "", "👹", "", "",),

    question: "Scary monster in the hut. You run out screaming. The sun's going down but you're feeling a lot warmer.",

    choices:
    [
      {
        text: "Dress down",
        next: "dressDown",
      },
      {
        text: "Keep your clothes on",
        next: "keepClothesOn",
      },
    ]
  },
  
  "keepClothesOn":
  {
    reveal: standaRevealEmojis("🥵", "🌡️", "🌶️", "♨️", "🔥",),

    question: "Heat stroke.",

    choices:
    [
      {
        text: "I deserved it",
        next: "deservedIt",
      },
      {
        text: "I'm nothing in the face of fate",
        next: "imNothing",
      },
    ]
  },
  
  "deservedIt":
  {
    reveal: standaRevealEmojis("", "", "🙂‍↕️", "", "",),

    gg: (tiles) => win(tiles, "Teach someone else a valuable lesson?", "you sure did")
  },
  
  "imNothing":
  {
    reveal: standaRevealEmojis("", "", "🎭", "", "",),
    gg: (tiles) => win(tiles, "Hope to end up at the top next time?", "the wheel of fate keeps turning!")
  },
  
  "getNaked":
  {
    reveal: standaRevealEmojis("🧦", "👚", "🏃‍➡️", "👟", "👟",),

    question: "You throw every article of clothing off your body and run around. Ahhhh... you needed this. There's a hut on the horizon.",

    choices:
    [
      {
        text: "Go to the hut",
        next: "goHut",
      },
      {
        text: "Stay outside",
        next: "stayOutside",
      },
    ]
  },
  
  "stayOutside":
  {
    reveal: standaRevealEmojis("🌲", "❄️", "🫁", "❄️", "🌲",),

    question: "The air outside is so refreshing, you immediately feel energized. Suddenly you start feeling warmer.",

    choices:
    [
      {
        text: "Dress down",
        msg: "The air feels pleasantly warm and the sun gently kisses your skin. The weather sure loves to shift around here.",
        next: "dressDown",

      },
      {
        text: "Keep your clothes on",
        next: "keepClothesOn",
      },
    ]
  },
  
  "dressDown":
  {
    reveal: standaRevealEmojis("🌊", "🌊", "🏝️", "🌊", "🌊",),

    gg: (tiles) => win(tiles, "Invite someone to your island?", "here comes the sun!")
  },

  "1":
  {
    reveal: standaRevealEmojis("", "", "", "", "",),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  

}

const exploreBeach =
{
  "start":
  {
    //question: "haiiiiii :D",

    next: "beach",
  },

"beach":
  {
    reveal: standaRevealEmojis("⛱️", "🐚", "🦀", "🪼", "🌊",),

    question: "You're at the beach!! It's a perfect day for exploring.",

    choices:
    [
      {
        text: "Talk to the hermit crab",
        next: "hermitCrab",
      },
      {
        text: "Help the beached jellyfish",
        next: "jellyfish",
      },
    ]
  },

  "hermitCrab":
  {
    reveal: standaRevealEmojis("", "🐚", "🦀", "💬", "",),

    question: "Hey, can you help me? I arrived late to the vacancy chain and I cant fit inside of this crummy thing. Could you find me a better home?",

    choices:
    [
      {
        text: "Yes",
        next: "pickShell",
      },
      {
        text: "No",
        next: "sighWhatever",
      },
    ]
  },


  "pickShell":
  {
    reveal: standaRevealEmojis("🐚", "🐚", "🐚", "🐚", "🐚",),

    question: "Which shell will suit the crab best?",

    choices:
    [
      {
        text: "Pasta shell",
        msg: "Thanks to you the crab found his true calling. He was meant to be Italian all along.",
        msgBtn: "splendido.",
        next: "pastaShell",        
      },
      {
        text: "Shotgun shell",
        msg: "The crab went on to live a long life as a lumberjack in the North American taiga. He keeps his trusty shotty on him in case the tax man come a-knockin'.",   
        msgBtn: "log bless crabmerica!",
        next: "shotgunShell",
      },
      {
        text: "Conch Shell",
        next: "conchShell",        
      },
      {
        text: "Shellac",   
        msg: "The crab got his claws done, which looks dashing, but doesn't help much with the house search. The beetle doesn't seem too happy about the whole ordeal either.",
        msgBtn: "slay",
        next: "shellac",
      },
      {
        text: "Shell Shock",
        msg: "The crab explodes. Everything goes white. Your ears are ringing. You will not sleep tonight.",
        msgBtn: "...",
        next: "shellShock",        
      },
    ]
  },


  "pastaShell":
  {
    reveal: standaRevealEmojis("", "🇮🇹", "🦀", "🍝", "🌕",),

    gg: (tiles) => win(tiles, "Fuggedaboutit?", "when the moon hits your eye!"),
  },

  "shotgunShell":
  {
    reveal: standaRevealEmojis("🌲", "🛖", "🦀", "🪓", "🪵",),

    gg: (tiles) => win(tiles, "Pepper someone else?", "good crab hunting"),
  },


  "conchShell":
  {
    reveal: standaRevealEmojis("", "🐚", "🦀", "💬", "",),

    question: "Oh gee thank you, this one fits like a glove! Now say, do you know how to breathe underwater?",

    choices:
    [
      {
        text: "Yes",
        msg: "Since you're oh so confident in your ability, you throw yourself into the gaping maw of the open ocean. Dummy.",
        msgBtn: "beast mode",
        next: "yesBreatheUnderwater",
      },
      {
        text: "No",
        msg: "Oh? I can fix that hold on",
        msgBtn: "glub glub",
        next: "noBreatheUnderwater",
      },
    ]
  },


  "shellac":
  {
    reveal: standaRevealEmojis("🪲", "", "🦀", "💅", "",),

    gg: (tiles) => win(tiles, "Harvest more bug juice?", "I try to free myself..."),
  },


  "shellShock":
  {
    reveal: standaRevealEmojis("⬜", "⬜", "⬜", "⬜", "⬜",),

    gg: () => endGame("Steal more valor?","I'm tellin' you the crab 'sploded")
  },

  "yesBreatheUnderwater":
  {
    reveal: standaRevealEmojis("🌊", "🌊", "🌊", "🌊", "🌊",),

    gg: (tiles) => win(tiles, "Drag another helpless soul down with you?", " I feel like Ben drowned the way I"),
  },

  "noBreatheUnderwater":
  {
    reveal: standaRevealEmojis("", "", "🐟", "", "",),

    gg: (tiles) => win(tiles, "To be continued...", "GLUB⁉️",)
  },
  
  "sighWhatever":
  {
    reveal: standaRevealEmojis("", "🐚", "🦀", "💨", "",),

    question: "Sighhhhhh, whatever.",

    choices:
    [
      {
        text: "talk to the jellyfish instead",
        next: "jellyfish",
      },
    ]
  },

  "jellyfish":
  {
    reveal: standaRevealEmojis("", "⛱️", "🪼", "💬", "",),

    question: "A polyp",

    choices:
    [
      {
        text: "what?",
        next: "jelly2",
      },
    ]
  },

  
  "jelly2":
  {
    reveal: standaRevealEmojis("", "⛱️", "🪼", "💬", "",),

    question: "I'm a polyp. Not a jellyfish.",

    choices:
    [
      {
        text: "Oh sorry I thought-",
        msg: "Yeah i bet you did.",
        msgBtn: "...",
        next: "jelly3",
      },
    ]
  },


  "jelly3":
  {
    reveal: standaRevealEmojis("", "⛱️", "🪼", "💬", "",),

    question: "That's like if I were to call you a primate. A jellyfish, unbelievable.",

    choices:
    [
      {
        text: "Sorry.",
        next: "jelly4",
      },
    ]
  },

  "jelly4":
  {
    reveal: standaRevealEmojis("", "⛱️", "🪼", "💬", "",),

    question: "Just leave me alone",

    choices:
    [
      {
        text: "...",
        next: "jelly5",
      },
    ]
  },
  
   "jelly5":
  {
    reveal: standaRevealEmojis("", "⛱️", "🪼", "💬", "",),

    gg: () => endGame("Be insensitive somewhere else?", "I don't see taxonomic class")
  },

}

let helpedSeal = false;

const oceanSunlightZone =
{
  "start":
  {
    question: "Welcome to the sunlight zone!",
    next: "setTheScene",
  },

  "setTheScene":
  {
    reveal: standaRevealEmojis("🐋", "🦈", "🐟", "🦭", "💦"),

    question: "You notice a troubled whale swimming past you, seemingly trying to escape a shark attack. From the corner of your eye you spot a seal in a precarious situation.",

    choices:
    [
      {
        text: "Stop the shark",
        next: "stopShark",
      },
      {
        text: "Help the seal",
        next: "helpSeal",
      },
    ]
  },

  "stopShark":
  {
    reveal: standaRevealEmojis("🐋", "🦈", "🌊", "🐟", "💨"),

    question: "You give chase after the shark.",

    next: "whyFollowShark",

    choices: 
    [
      {
        text: "next",
      },
    ]
  },

  
  "whyFollowShark":
  {
    reveal: standaRevealEmojis("🦈", "💬", "🌊", "🐟", "💬"),

    question: "Why are you following me",

    choices:
    [
      {
        text: "Can you chill on that whale?",
        msg: "-Pffft. Of course i can, who do you take me for?. (The shark chills atop the whale, so hard in fact that he promptly dozes off.)",
        msgBtn: "Goodnight little shark.",
        next: "chillOnWhale",
      },
      {
        text: "Can you eat me instead?",
        msg: "What? I wasn't planning on eating her.",
        msgBtn: "Huh?",
        next: "huh",
      },
    ]
  },

  
  "huh":
  {
    reveal: standaRevealEmojis("🦈", "💬", "🌊", "🐟", "💬"),

    question: "You see, I've always really wanted to see a whale shark with my own 2 eyes. But I can't seem to come across one. So I thought-",

    choices:
    [
      {
        text: "That's not how that works",
        next: "notHowItWorks",
      },
      {
        text: "I'm sure you did",
        msg: `Through uttering these words you channel the polyp's energy, miraculously transforming you into them. 
              The shark gives chase nonetheless, unperturbed by your gelationous form and shitty attitude.`,
        msgBtn: "If only I were a jellyfish",
        next: "polypEnding",
      },
    ]
  },

  
  "polypEnding":
  {
    reveal: standaRevealEmojis("🦈", "💨", "🌊", "🪼", "💬"),

    gg: (tiles) => endGame("Sass someone else?", "rude polyps finish last")
  },

  
  "notHowItWorks":
  {
    reveal: standaRevealEmojis("🦈", "⁉️", "🌊", "🐟", "💬"),

    question: "Huh? What do you mean that's not how it works??",

    choices:
    [
      {
        text: "Don't worry, I've got just the thing for you",
        // getter needed so that it's evaluated at run time rather than compiletime
        get msg()
        {
          if (helpedSeal)
            return "You transform into a whale shark, which happens off screen because there's no whale shark emoji";
          else
            return `You turn into an anchor and sink to the bottom of the ocean. 
                    No one would hear you scream if you could, but you can't because 
                    you're an anchor and you're at the bottom of the ocean...`; 
        },

        get msgBtn()
        {
          return helpedSeal ? "It's ok Brongle, I understand" : "I say nothing because I'm an anchor at the bottom of the ocean"
        },

        get next() 
        { 
          return helpedSeal ? "whaleShark" : "anchor";
        },
      },
    ]
  },

  
  "whaleShark":
  {
    reveal: standaRevealEmojis("", "🐋", "➕", "🦈", ""),

    gg: (tiles) =>
    {
      showAlert("you look smth like this rn", 4000)
      displayImg("assets/pics/whaleShonk.jpg", 4000)

      win(tiles, "Give someone else a biology lesson?")
    }
  },

  
  "anchor":
  {
    reveal: standaRevealEmojis("", "", "⚓", "", ""),

    gg: (tiles) => endGame("Sink your friends and loved ones?", "I have no mouth and I must anchor")
  },

  
  "chillOnWhale":
  {
    reveal: standaRevealEmojis("", "🐋", "🦈", "💤", ""),

    gg: (tiles) => win(tiles, "Bring in more chill aquafauna?", "snork mimimimi"),
  },

  
  "helpSeal":
  {
    reveal: standaRevealEmojis("", "", "🦭", "💬", ""),

    question: "I've been having some trouble breathing lately, do you mind checking it out?",

    choices:
    [
      {
        text: "I'll do it",
        msg: "Upon closer inspection you notice something wiggling in her nose",
        msgBtn: "Pull it out!",
        next: "pull",
      },
      {
        text: "I'm good",
        next: "imGood",
      },
    ]
  },

  
  "imGood":
  {
    reveal: standaRevealEmojis("", "", "🦭", "😔", ""),

    question: "Oh... okay.",

    choices:
    [
      {
        text: "Go help the troubled whale instead",
        next: "stopShark",
      },
    ]
  },

  "pull":
  {
    reveal: standaRevealEmojis("", "🐍", "🦭", "", ""),

    question: "It was an eel!!",

    choices:
    [
      {
        text: "next",
        next: "sealThanks",
      },
    ]
  },

  "sealThanks":
  {
    reveal: standaRevealEmojis("🐍", "💨", "🦭", "💬", ""),

    question: "Thank you so much for your help. Judging by your movements you seem new to this fish thing. What happened to you?",

    choices:
    [
      {
        text: "tell your story",
        msg: "Ahhh... I see. Well you're in luck because I'm a monk seal!!! Lemme just... OOoOOoOOMMMMmmmm~ There! I've tweaked your curse, now you should be able to turn into any marine animal you'd like.",
        msgBtn: "Help the whale",
        next: "stopShark",

        action: () => helpedSeal = true
      },
    ]
  },
}

const twilightZone = 
{
  "start":
  {
    question: `You venture deeper (approximately 200-1000m) into the dark, murky waters of the twilight zone.`,

    choices:
    [
      {
        text: "next",
        next: "observing",
      }
    ]
  },

  "observing":
  {
    reveal: standaRevealEmojis("🦑", "", "🐋", "💔", "🐟"),

    question: `You see the life  around you slowly thinning out until you're left in a desolate void, only broken up by streaks of bioluminescence.`,

    choices:
    [
      {
        text: "bump into a squid",
        next: "peckishSquid",
      },
      {
        text: "bump into 3 fishes",
        next: "3fishes",
      }
    ]
  },

  "peckishSquid":
  {
    reveal: standaRevealEmojis("", "", "🦑", "💬", ""),
    question: `Uouh my gosh I am so peckish, you wouldn't happen to have any snacks on you?`,

    choices:
    [
      {
        text: `I might have just the thing`,
        next: `justTheThing`,
      },
      {
        text: `What's a snack`,
        msg: "you.",
        msgBtn: "s-squid-chan what do you mean?",
        next: `whatsAsnack`,
      },
    ]
  },

  "justTheThing":
  {
    reveal: standaRevealEmojis("💎", "", "🍓", "", "🧌"),
    question: `You hold 3 snack options in your fins. To which do you give your warmest recommendation?`,

    choices:
    [
      {
        text: `diamond`,
        msg: `The moment her beak touches the diamond begins an approximately 30 second long flashy transformation sequence accompanied by sparkling orchestral swells.
              By the end of it you stand face to face with Thysanoteuthis rhombus the DIAMOND SQUID.
              You're awestruck by her geometricity. `,
        msgBtn: `waow...`,
        next: `diamond`,
      },
      {
        text: `strawbry`,
        msg: `The moment her beak touches the strawberry begins an approximately 30 second long flashy transformation sequence accompanied by sparkling orchestral swells.
              By the end of it you stand face to face with Histioteuthis heteropsis the STRAWBERRY SQUID.
              She performs her world famous diurnal vertical migration, in stunning fashion.`,
        msgBtn: `so sweet...`,
        next: `strawbry`,
      },
      {
        text: `giant (one day we won't need to show a troll emoji here)`,
        msg: `The moment her beak touches the giant begins an approximately 30 second long flashy transformation sequence accompanied by sparkling orchestral swells.
              By the end of it you stand face to face with Architeuthis dux the GIANT SQUID.
              You're awestruck by her ginormity.`,
        msgBtn: `so big...`,
        next: `giant`,
      },
    ]
  },


  "diamond":
  {
    reveal: standaRevealEmojis("", "💎", "🦑", "", ""),

    gg: (tiles) => win(tiles, "Enlighten others to the wonders of cephalopods?", "EDUCATIONAL BRONGLES"),
  },

  
  "strawbry":
  {
    reveal: standaRevealEmojis("", "🍓", "🦑", "", ""),
    gg: (tiles) => win(tiles, "Enlighten others to the wonders of cephalopods?", "EDUCATIONAL BRONGLES"),
  },


  
  "giant":
  {
    reveal: standaRevealEmojis("", "🧌", "🦑", "", ""),
    gg: (tiles) => win(tiles, "Enlighten others to the wonders of cephalopods?", "EDUCATIONAL BRONGLES"),
  },


  
  "whatsAsnack":
  {
    reveal: standaRevealEmojis("", "❤️‍🔥", "🦑", "❤️‍🔥", ""),
    gg: (tiles) => win(tiles, "Set others on the path of cephalopod romance?", "SQUID LOVE")
  },


  
  "3fishes":
  {
    reveal: standaRevealEmojis("🐟", "🧛", "🐟", "🐺", "🐟"),
    question: `Before you swims a humanfish, a vampirefish and a werewolf-fish. They seem a little perturbed`,

    choices:
    [
      {
        text: `What's up with yall?`,
        next: `whatsUp`,
      },
    ]
  },


  
  "whatsUp":
  {
    reveal: standaRevealEmojis("", "", "💔", "", ""),
    question: `The fish tell their a tale. 
               To some, it is a plain tale of lust. 
               To others it is a tale of two households both alike in dignity and the love which seeks to bridge their diametrically opposed worlds.
               To others yet it is a story detailing the tightrope between our most fishman desires and our infishman potential for harm...`,

    choices:
    [
      {
        text: `damn that's crazy, have yall ever considered polypamory?`,
        msg: "Suddenly it's fucking polyp city ova here in da twilight zone. Which invadvertedly solves the love triangle at fin.",
        next: `polypamory`,
      },
    ]
  },


  
  "polypamory":
  {
    reveal: standaRevealEmojis("🪼", "🪼", "🪼", "🪼", "🪼"),
    gg: (tiles) => win(tiles, "Approach a 3rd at the bar?", "I don't wanna be polyyyp~")
  },

}

const midnightZoneOcean =
{
  "start":
  {
    next: "midnightZone",
  },

  "midnightZone":
  {
    reveal: standaRevealEmojis("🐟", "📷", "🐟", "", "🪲", ),

    question: `After a brief stint in the mesopelagic you make your way down to the midnight zone. 
               Not even a lick of sun could make it down here and the pressure would mangle any other fish - but not you.`,

    choices: 
    [
      {
        text: "Bump into tripod fish",
        next: "tripodFish",
      },
      {
        text: "Bump into giant isopod",
        action: () => playTrack("assets/sfx/wait what (that's a bug).mp3", {loop: false, volume: 0.3, }),
        next: "giantIsopod",
      },
    ]
  },


  "tripodFish":
  {
    reveal: standaRevealEmojis("", "", "🐟", "📷", ""),

    question: `HEY ASSHOLE YOU MESSED UP MY PHOTO`,

    choices: 
    [
      {
        text: "Oh my gosh I'm so sorry",
        next: "soSorry",
      },
      {
        text: "Well screw you buddy",
        next: "screwYou",
      },
    ]
  },

  
  
  "soSorry":
  {
    reveal: standaRevealEmojis("", "📷", "🐟", "💬", ""),

    question: `Sighhhh, it's fine...
               By the way, looking closer at you, I've never seen a fish like you down here before (and seeing fish down here is rare enough).
               Mind if I snap a picture of you?`,

    choices: 
    [
      {
        text: "Sure, go ahead!",
        next: "photo",
      },
      {
        text: "I'm ok, thank you. (check out giant isopod instead)",
        action: () => playTrack("assets/sfx/wait what (that's a bug).mp3", {loop: false, volume: 0.3, }),
        next: "giantIsopod",
      },
    ]
  },

  
  
  "photo":
  {
    reveal: standaRevealEmojis("📸", "📸", "📸", "📸", "📸"),

    gg: (tiles) => 
    {
      showAlert("you look lovely :)")
      displayImg("assets/pics/Flap_Jack_Devilfish.jpg");
      win(tiles, "Capture more cryptids?");
    }
  },

  
  
  "screwYou":
  {
    reveal: standaRevealEmojis("", "📷", "🐟", "💢", ""),

    question: `The tripod fish scurries away with her camera setup. But it's not all bad, a short distance away you spot a firefly - maybe they'll be kinder.`,

    choices: 
    [
      {
        text: "Go bother the isopod",
        action: () => 
        {
          playTrack("assets/sfx/wait what (that's a bug).mp3", {loop: false, volume: 0.3, });         
        },
          
        next: "giantIsopod",
      },
      {
        text: "Say hi to the firefly",
        next: "firefly",
      },
    ]
  },

  
  
  "firefly":
  {
    reveal: standaRevealEmojis("✨", "", "", "🐟", ""),

    question: `You follow the elusive firefly, it does not seem frightful of you in the slightest. 
               (honestly, it seems like it's yet to notice you at all.)`,

    choices: 
    [
      {
        text: "shiny..",
        next: "firefly2",
      },
    ]
  },

  
  
  "firefly2":
  {
    reveal: standaRevealEmojis("✨", "", "🐟", "", ""),

    question: `Inching closer to the firefly you begin imagining the awesome times you'll have together.
               They'll definitely be nicer than that stupid tripod.`,

    choices: 
    [
      {
        text: "shiny...",
        next: "firefly3",
      },
    ]
  },

  
  
  "firefly3":
  {
    reveal: standaRevealEmojis("✨", "🐟", "", "", ""),

    question: `You feel it. The taste of budding friendship.`,

    choices: 
    [
      {
        text: "next",
        msg: "everything goes dark",
        msgBtn: "I'm a gullible fool",
        next: "ohNo",
      },
    ]
  },
  
  
  "ohNo":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    gg: () => endGame("Get more groceries, get eaten?", "STUDY FINDING NEMO")
  },

  
  "giantIsopod":
  {
    glitched: true,
    reveal: standaRevealEmojis("", "", "🪲", "💬", ""),

    onReveal: () => 
    {
      setTimeout(() => 
      {
        playTrack("assets/sfx/that's insane.mp3", {loop: false, volume: 0.3, })
      }, 1000);
    },

    onQuestion: () => playTrack("assets/sfx/that's a bug that's a bug.mp3", {loop: true, volume: 0.3, }),

    question: `error1738 "bugBoy" is null 
               attempting to read data from this object w
               wi ll result
               in uNdefined bEHAviour 
               prepAring to exit [the program] 
               exit code: ...6...a...n...7`,

    choices: 
    [
      {
        text: "THAT'S A BUG",
        next: "bugEnding",
        action: () => killSound("assets/sfx/that's a bug that's a bug.mp3")
      },
      {
        text: "THAT'S A BUG",
        next: "bugEnding",
        action: () => killSound("assets/sfx/that's a bug that's a bug.mp3")
      },
            {
        text: "THAT IS A BUG",
        next: "bugEnding",
        action: () => killSound("assets/sfx/that's a bug that's a bug.mp3")
      },
    ]
  },

  
  
  "bugEnding":
  {
    reveal: standaRevealEmojis("🪲", "⬅️", "🇧", "🇺", "🇬"),

    gg: (tiles) => win(tiles, "Bug someone else? [the sequel]", "hooooly"),
  },

  
  
  "3":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: ``,

    choices: 
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
}


let yourInt = getRandomInt(1, 9);
let theirInt = getRandomInt(1,9);

function getYourGambleDescriptor()
{
  if (yourInt === 9)
    return "PERFECT 9"
  else if (yourInt < 9 && yourInt > 4)
    return "solid " + yourInt
  else if (yourInt === 1)
    return "pathetic " + yourInt
  else 
    return "measly " + yourInt
}

function getTripodGambleDescriptor()
{
  if (theirInt === 9)
    return "PROBABLY HACKED 9"
  else if (theirInt < 9 && theirInt > 4)
    return "solid " + theirInt
  else if (theirInt === 1)
    return "laughable " + theirInt
  else
    return "pitiable " + theirInt
}

function getGambleResultMsg()
{
  if (yourInt === theirInt)
    return "The tripod fish has finally met their equal."
  else if (yourInt > theirInt)
    return "It's as shrimple as that"
  else
    return "sucks to suck..."
}

function getNumberEmoji(x) {
  switch(x) 
  { 
    case 1:
      return "1️⃣";
    case 2:
      return "2️⃣";
    case 3:
      return "3️⃣";
    case 4:
      return "4️⃣";
    case 5:
      return "5️⃣"; 
    case 6:
      return "6️⃣";
    case 7:
      return "7️⃣";
    case 8: 
      return "8️⃣";
    case 9:
      return "9️⃣";

    default:
      return "❓";
  } 
}

function getGambleEmojis()
{
  if (yourInt === theirInt)
    return standaRevealEmojis("", getNumberEmoji(yourInt), "🤝", getNumberEmoji(theirInt), "")
  else if (yourInt > theirInt)
    return standaRevealEmojis("", getNumberEmoji(yourInt), "🏆", getNumberEmoji(theirInt), "")
  else
    return standaRevealEmojis("", getNumberEmoji(yourInt), "💔", getNumberEmoji(theirInt), "")
}


function getGambleGG(tiles)
{
  if (yourInt === theirInt)
    return win(tiles, "Share your newfound comraderie?", "bet")
  else if (yourInt > theirInt)
    return win(tiles, "Let the people know you're stoated?", "EZ")
  else
    return win(tiles, "Try to live with your shame?", "i can't do anything right")
}

const anglerfish =
{
  "start":
  {
    question: "It's dark",

    choices: 
    [
      {
        text: "look for signs of life",
        msg: "upon exploration, you swim into a couple slender, bony pylons",
        msgBtn: "oop",
        next: "signsOfLife",
      },
    ]
  },


  "signsOfLife":
  {
    reveal: standaRevealEmojis("", "", "🥢", "", ""),

    question: `HEY ASSHOLE - the pylons yell with a familiar voice
               what in deep sea carnation do you think you're doing?`,

    choices:
    [
      {
        text: "Oh my gosh I'm so sorry",
        next: "ohMyGosh",
      },
      {
        text: "Well screw you buddy",
        next: "screwYou",
      },
    ]
  },

    
  "ohMyGosh":
  {
    reveal: standaRevealEmojis("", "", "🐟", "📷", ""),

    question: `Oh it's you. Fancy seeing you here. Seems like we're both 'bout to be swimming with the fishes, eh?`,

    choices:
    [
      {
        text: "Where are we?",
        next: "bestShot",
      },
    ]
  },

    
  "screwYou":
  {
    reveal: standaRevealEmojis("", "💢", "🐟", "📷", ""),

    question: `Oh it's *you*. Figures. I heard an anglerfish's favourite food is dimwit.`,

    choices:
    [
      {
        text: "WHATT",
        msg: "Yep. Sure ain't a pretty place to be, but maybe we won't need to be here for long, if we play our cards right.",
        next: "bestShotAbridged",
      },
      {
        text: "I know you are but what am I",
        next: "iKnowYouAre",
      },
    ]
  },

    
  "iKnowYouAre":
  {
    reveal: standaRevealEmojis("", "📷", "🐟", "🚬", ""),

    question: `Alright pal, I'll be frank with you for a moment.
               As much as I'd love to keep slinging salty words at you, I've got duties to attend to and don't really fancy meeting my maker today.
               How bouts we sketch a plan to get our fins someplace freer?`,

    choices:
    [
      {
        text: "It's our best shot",
        next: "bestShotAbridged",
      },
      {
        text: "What duties?",
        next: "whatDuties",
      },
    ]
  },
    
  "whatDuties":
  {
    reveal: standaRevealEmojis("🪙", "🪙", "🐟", "🪙", "🪙"),

    question: `The tripod fish chuckles: - Oh you know, winning it big. 
               I'm talking great white, no scratch that; BLUE WHALE big.
               I'm the kind of fish to enter with 100 seaweed chips to my name and refuse to leave until I've enough to buy me a king size seabed.`,

    choices:
    [
      {
        text: "Wow that's unbelievable (quit lying)",
        msg: `(Your words leave the tripod fish battered. With your guide left morose and silent, you're both as good as fried.)`,
        msgBtn: "aw man",
        next: "unbelievable",
      },
      {
        text: "Initiate a gambling duel",
        next: "gamblingDuel",
      },
    ]
  },
    
  "unbelievable":
  {
    reveal: standaRevealEmojis("😔", "😔", "🐟", "😔", "😔"),
    
    gg: () => endGame("Show your peeps the horror?", "can't win em all")
  },
    
  "gamblingDuel":
  {
    reveal: standaRevealEmojis("1️⃣", "🪙", "🪙", "🪙", "9️⃣"),

    question: `You asked for it >:3 The rules are simple: 
               one 9-sided dice roll each, whoever rolls higher becomes the empress of gamblers.
               Think you've got a shot?`,

    choices:
    [
      {
        text: "LET'S ROLL",
        msg: ("Your roll: " + getYourGambleDescriptor() 
            + "\nTripod fish roll: " + getTripodGambleDescriptor()
            + "\n"+ getGambleResultMsg()),
        
        next: "gambleEnding",
      },
    ]
  },
    
  "bestShot":
  {
    reveal: standaRevealEmojis("", "", "🔒", "", ""),

    question: `Davy Jones' Locker my friend, the stomach of an anglerfish.`,

    choices:
    [
      {
        text: "Tickle the walls",
        msg: "A stream of hot liquid splashes your face. Oh god. It burns. Didn't you know that interior tummy tickles aid digestion?",
        msgBtn: "もうだめだ",
        next: "tickleWalls",
      },
      {
        text: "Try to bite thru the walls",
        msg: "You transform into a cookie cutter shark and make quick work of the anglerfish, time to swim out into the dark depths of freedom!",
        msgBtn: "yipiiii",
        action: () => showAlert("but wait!"),
        next: "biteThru1",
      },
    ]
  },

  "bestShotAbridged":
  {
    reveal: standaRevealEmojis("", "", "❓", "", ""),

    question: `What'll it be then partner?`,

    choices:
    [
      {
        text: "Tickle the walls",
        msg: "A stream of hot liquid splashes your face. Oh god. It burns. Didn't you know that interior tummy tickles aid digestion?",
        msgBtn: "もうだめだ",
        next: "tickleWalls",
      },
      {
        text: "Try to bite thru the walls",
        msg: "You transform into a cookie cutter shark and make quick work of the anglerfish, time to swim out into the dark depths of freedom!",
        msgBtn: "yipiiii",
        action: () => showAlert("but wait!"),
        next: "biteThru1",
      },
    ]
  },
    
  "biteThru1":
  {
    reveal: standaRevealEmojis("", "", "🍪", "🦈", ""),

    question: `Just your luck. Another wall stands in your way. Oh well, your fangs were made for cuttin'`,

    choices:
    [
      {
        text: "CHOMP",
        action: () => showAlert("but wait!"),
        next: "biteThru2",
      },
    ]
  },
    
  "biteThru2":
  {
    reveal: standaRevealEmojis("", "🍪", "🍪", "🦈", ""),

    question: `Now this you didn't plan for. A third wall has appeared! After a moment's befuddlement, you get back to doing what you do best.`,

    choices:
    [
      {
        text: "CHOIMP",
        msg: `At least you see(?) it: the pitch dark of the abyssopelagic. 
              The tripod fish thanks you profusely and snaps a picture of you together, commemorating your newfound freedom.`,

        next: "biteThru3",
      },
    ]
  },
    
  "biteThru3":
  {
    reveal: standaRevealEmojis("🍪", "🍪", "🍪", "🦈", "📸"),
    gg: (tiles) =>
    {
      displayImg("assets/pics/anglerfishEnding.png", 8000);
      win(tiles, "You've lived, will you tell the tale?", "cookie cutter strategies");
    }
  },
    
  "tickleWalls":
  {
    reveal: standaRevealEmojis("🟢", "🟢", "🟢", "🟢", "🟢"),

    gg: () => endGame("Show your friends your soupified form?", "hate when this happens")
  },
    
  "gambleEnding":
  {
    reveal: getGambleEmojis(),

    gg: (tiles) => getGambleGG(tiles),
  },
    
  "1":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: ``,

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },

}

const abyssopelagic =
{
  "start":
  {
    question: "You're alone in the all consuming darkness of the abyss. Marine snow grazes your skin. There's a faint light in the distance.",

    choices:
    [
      {
        text: "Follow the light",
        next: "followLight",
      },
      {
        text: "Stay where you are",
        next: "stayPut",
      },
    ]
  },

  "followLight":
  {
    reveal: standaRevealEmojis("🐖", "🐖", "🐖", "🐖", "🐠"),

    question: "You spot a strange looking fellow tending to a little sea pig pen.",

    choices:
    [
      {
        text: "Talk to him",
        next: "talkToHim",
      },
      {
        text: "Steal one of the sea pigs",
        next: "stealPig",
      },
    ]
  },
  
  "talkToHim":
  {
    reveal: standaRevealEmojis("", "", "🐠", "💬", ""),

    question: "I don't have much to say to a greenhorn like you. Scram.",

    choices:
    [
      {
        text: "Ok rude, wasn't gonna steal one of your pigs but...",
        next: "okRude",
      },
    ]
  },

  "okRude":
  {
    reveal: standaRevealEmojis("", "💢", "🐠", "💬", ""),

    question: "huh?",

    choices:
    [
      {
        text: "My pig now :)",
        next: "stealPig",
      },
    ]
  },
  
  "stealPig":
  {
    reveal: standaRevealEmojis("🐖", "🐟", "💨", "", "🐠"),

    question: "HEY NOW",

    choices:
    [
      {
        text: "SUCK IT OLD MAN",
        next: "stealPig2",
      },
    ]
  },
  
  "stealPig2":
  {
    reveal: standaRevealEmojis("🐖", "🐟", "💨", "🔫", "🐠"),

    question: "They don't call me Barrel-Eye for nothing",

    choices:
    [
      {
        text: "ZIG ZAG",
        next: "zigZag",
      },
      {
        text: "RUN STRAIGHT AHEAD",
        msg: "Everything would go dark if it weren't already dark. Everything goes darker?",
        msgBtn: "aw man",
        next: "runStraight",
      },
    ]
  },
  
  "zigZag":
  {
    reveal: standaRevealEmojis("🐖", "🐟", "〰️", "🔫", "🐠"),

    question: `You zig zag around the Barrel-Eye's bullets.
               Eventually you lose him, and once again you're alone in the darkness. 
               Except you're not - you have a sea pig by your side.`,

    choices:
    [
      {
        text: "hi piggie :)",
        msg: "hi fishie :)",
        msgBtn: "YOU WERE SENTIENT??",
        next: "pigOut",
      },
    ]
  },
  
  "pigOut":
  {
    reveal: standaRevealEmojis("", "🐷", "💬", "🐟", ""),

    gg: (tiles) => win(tiles, "Pig out?", "an unexpected companion")
  },
  
  "runStraight":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    gg: () => endGame("Reveal your lack of plot armor?", "They don't call 'im Barrel-Eye for nuthin'...")
  },
  
  "stayPut":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "You stay in place, savoring the putrid scraps of flesh and plant matter falling from brighter waters. The light seems to be further away than it was just a few minutes ago.",

    choices:
    [
      {
        text: "Stay where you are",
        next: "stayWhereYouAre"
        /*
        msg: "you can't",
        msgBtn: "why?",
        msg2: "The current's too strong",
        msgBtn2: "oh.",
        msg3: `You close your eyes and float with the current. It might've been minutes, it might've been hours. Once you come to you're firmly attached to a decaying whale carcass.`,
        msgBtn3: "that's nice", 
        next: "floatWithCurrent",
        */
      },
      /*
      {
        text: "actually i'm hungry",
        next: "bigRedJelly",
      },
      */
    ]
  },
  
  "stayWhereYouAre":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "you can't",

    choices:
    [
      {
        text: "why?",
        msg: "The current's too strong",
        msgBtn: "oh.",
        next: "closeEyes"
      }
    ]
  },

  "closeEyes":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "You close your eyes and float with the current. It might've been minutes, it might've been hours. Once you come to you're firmly attached to a decaying whale carcass.",

    choices:
    [
      {
        text: "that's nice",
        next: "floatWithCurrent",
      },
    ]
  },
  
  "floatWithCurrent":
  {
    reveal: standaRevealEmojis("", "", "🐋", "", ""),

    gg: () => endGame("Go with the flow?", "bein a tube worm aint so bad."),

  },


  "bigRedJelly":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },


  
  "7":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "6":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "5":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "4":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "3":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "2":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "1":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "",

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },

}

const preTrench =
{
  "start":
  {
    next: "finallySafe"
  },

  "finallySafe":
  {
    reveal: standaRevealEmojis("🐷", "", "🔥", "", "🐟"),

    question: `Finally safe from danger, you and your sea piggy pal reminisce around a hydrothermal vent.`,

    choices:
    [
      {
        text: "Real talk this sea business might not be for me",
        msg: "Wait, are you from the surface?",
        
        subChoices: 
        [
          { text: "Yes", next: "surfaceYes" },
          { text: "No.", next: "surfaceNo" }
        ]
      },
    ]
  },
  
  "surfaceYes":
  {
    reveal: standaRevealEmojis("🐷", "💬", "🔥", "", "🐟"),

    question: `Holy shit, I never thought there was anyone else like us. I was heading for the Mariana Trench but I got captured by that glowy-eyed kook.`,

    choices:
    [
      {
        text: "Who's \"us\"",
        next: "whyMariana",

        msg: `I might as well tell you.
              I've been in these waters for the better part of a decade, but I wasn't always alone.
              Three years ago or so, I met a cusk eel in the same boat as us. 
              He told me the answer I seeks is hidden in the ocean's ultimate depth, the mariana trench.`,

        subChoices:
        [
          { text: "We must depart at once!", next: "mustDepart" },
          { text: "We must prepare.", next: "mustPrepare" }
        ]
              
              /*`I might as well tell you. 
              Just like you, I used to walk the surface, until some crab decided against that. 
              The light of the surface growing scarcer until eventually there was no way for me to tell whether my eyes were opened or closed. What followed was a loneliness the likes of which I wouldn't wish upon my worst friends.
              After what could have been weeks or years .
              "Finnigan" he called himself. For you see a real assfish he seemed, but with time I'd come to consider him the closest thing to a friend I've ever had down here`
              // he was a real assfish but he was my buddy...
              /*`The closets thing to a friend I've had down here told me that...
              I've been in these waters for the better part of a decade, though I wasn't always alone.
              You see, there's a cusk eel down here, whom i met by chance or possible fate 3 years ago.
              He told me told me that the ocean's ultimate depth held the answer i sought.`*/
      },
    ]
  },
  
  "surfaceNo":
  {
    reveal: standaRevealEmojis("🐷", "💢", "🔥", "", "🐟"),

    question: `I thought we were in this together, why are you lying to me now?`,

    choices:
    [
      {
        text: "I fundamentally do not respect you as an equal and think you should die",
        msg: "Hog absconds. You're all alone again.",
        next: "standoffish",
      },
    ]
  },

  "standoffish":
  {
    reveal: standaRevealEmojis("🐖", "💨", "🔥", "", "🐟"),

    gg: () => endGame("Be rude to someone else?", "Standoffish...") 
  },
  
  "mustPrepare":
  {
    reveal: standaRevealEmojis("🐷", "🍖", "🔥", "🍗", "🐟"),

    question: `You prepare a hearty Breakfast With Hog, contrary to how mama would make it, by cooking clumps of marine snow over the thermal vent. 
               It improves the taste a little.`,

    choices:
    [
      {
        text: "Let's go",
        next: "letsGoStress",
      },
      {
        text: "More prep",
        next: "morePrep",
      },
    ]
  },

  "letsGoStress":
  {
    reveal: standaRevealEmojis("❓", "🐖", "🐟", "💨", "❓"),

    question: "You depart for the Mariana Trench without any knowledge of the surrounding terrain. As soon as you departed you and your new companion get caught in a wild current.",

    choices:
    [
      {
        text: "next",
        msg: "You and Hog got separated somewhere along the way. It's dark and the water feels colder than usual. There's no way you can find your way back.",
        msgBtn: "next",
        next: "noPrepEnding",
      },
    ]
  },

  "noPrepEnding":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),
    gg: () => endGame("Eat snow for the rest of your short life?","Underprepared..."),
  },
  
  
  
  "morePrep":
  {
    reveal: standaRevealEmojis("🐷", "💬", "🧭", "🐟", "💬"),

    question: `You prepare a smarty plan Of Action With Hog. You scope out the surroundings and check the currents.`,

    choices:
    [
      {
        text: "Let's go",
        msg: "You depart for the Mariana trench with your newfound companion. Along the way you encounter many adventures, but that's a story for another day.",
        msgBtn: "A cliffhanger???",
        next: "letsGoTRUE",
      },
      {
        text: "MORE PREP",
        next: "lightsOut",
      },
    ]
  },

  "letsGoTRUE":
  {
    reveal: standaRevealEmojis("", "🐖", "🐟", "💨", "",),

    gg: (tiles) => win(tiles, "Go deeper?", "to be continued...")
  },
  
  "lightsOut":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: "There is a light that never goes out, but it's evidently not the one you were sitting around.",

    choices:
    [
      {
        text: "take me ouuut~ (light it)",
        msg: `The light reveals rows of sharp teeth ready to clamp down on you. 
              There's no time for more prep, you and Hog head straight for the Mariana trench to avoid the imminent danger`,
        msgBtn: "Swim for your life!!",
        next: "swimForLife",
      },
    ]
  },
  
  "swimForLife":
  {
    reveal: standaRevealEmojis("🐖", "🐟", "💨", "🦈", "🔥"),

    gg: (tiles) => win(tiles, "Go deeper?", "Overprepared...")
  },
  
  "mustDepart":
  {
    reveal: standaRevealEmojis("❓", "🐖", "🐟", "💨", "💢"),

    question: `You're confused and hungry. Surely this can't end well.`,

    choices:
    [
      {
        text: "next",
        msg: "You and Hog got separated somewhere along the way. It's dark and the water feels colder than usual. There's no way you can find your way back.",
        next: "outOfEnergy",
      },
    ]
  },
  
  "outOfEnergy":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    gg: () => endGame("Call for help?", "Reckless...")
  },
  
  "4":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: ``,

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "3":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: ``,

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "2":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: ``,

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
  
  "1":
  {
    reveal: standaRevealEmojis("", "", "", "", ""),

    question: ``,

    choices:
    [
      {
        text: "",
        next: "",
      },
      {
        text: "",
        next: "",
      },
    ]
  },
}