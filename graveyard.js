/*
function initGame() 
{
  showAlert("BRONGLE TIME :]");
  currentMode = GAME_MODES.BASIC_BRONGLE;
  // determine mode based on day number (dayOffset)


  switch (dayOffset) 
  {
    case 274:
      storySequence = twosevenfourSequence;
      break;

    case 275:
      storySequence = ogreStorySequence;
      break;

    case 276:
      storySequence = eleDanceSequence;
      break;

    case 277:
      storySequence = cutoutTigerSeq;
      break;

    case 278:
      storySequence = guessGameSeq;
      break;

    case 279:
      storySequence = pirateSeq;
      break;

    case 280:
      storySequence = swampMonsterSeq;
      break;

    case 281:
      storySequence = dreamSeq;
      break;

    case 282:
      currentMode = GAME_MODES.PROP_HUNT;
      storySequence = propHuntSeq;
      break;

    case 283:
      storySequence = surviveNightSeq;
      break;

    default:
      showAlert("DEFAULT DAY");
      storySequence = twosevenfourSequence;
      break;
  }

  startInteraction();
}
*/

/*
// TODO: fix bug which breaks game if u type too fast after answering a question sometimes

// TODO: clean up 274 sequence and ogrestorysequence
const twoSevenFourAKAhorse = 
[
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
*/