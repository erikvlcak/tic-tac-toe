"use strict";

document.querySelector("nav .nav__button--start-game").addEventListener("click", () => {
  if (game.getMode()) {
    game.showBoard();
    game.createBoard();
    game.initializeBoardData();
    result.rematch();

    document.querySelector(".main__button--next-game").textContent = "Next Round";
    document.querySelector(".main__button--next-game").classList.replace("btnEnabled", "btnDisabled");
    game.hideHeaderFooter();
  } else {
    document.querySelector(".nav__warning").style.display = "block";
  }
});

document.querySelector(".main .main__options .main__button--menu").addEventListener("click", () => {
  game.showMenu();
  game.clearBoard();
  game.clearListOfWinners();
  play.resetGameCounter();
  game.enableBoard();
  game.displayHeaderFooter();
  document.querySelector(".nav__warning").style.display = "none";
});

document.querySelector(".main__board").addEventListener("click", boardClickListener);

function boardClickListener(e) {
  let currentPlayer;
  let currentPosition;
  let finalResult;
  let gameMode = game.getMode();
  let counter;
  let boardCells = document.querySelectorAll(".main__board div");

  if (gameMode == "nav__button--mp") {
    if (e.target.textContent == "") {
      counter = play.turnCounter();
      currentPosition = e.target.className;
      if (counter % 2 == 1) {
        play.makeTurnPlayer1(e);
        document.querySelector(".left-area .left-area__turn .left-area__turn-name").textContent = game.getNamePlayer2();
        document.querySelector(".left-area .left-area__turn .left-area__turn-symbol").textContent =
          game.getSymbolPlayer2();
        currentPlayer = game.getSymbolPlayer1();
      } else {
        play.makeTurnPlayer2(e);
        document.querySelector(".left-area .left-area__turn .left-area__turn-name").textContent = game.getNamePlayer1();
        document.querySelector(".left-area .left-area__turn .left-area__turn-symbol").textContent =
          game.getSymbolPlayer1();
        currentPlayer = game.getSymbolPlayer2();
      }
      finalResult = result.getWinner(currentPosition, currentPlayer, counter);
    }
  } else if (gameMode == "nav__button--sp") {
    if (e.target.textContent == "") {
      play.makeTurnPlayer1(e);
      counter = play.turnCounter();
      currentPosition = e.target.className;
      currentPlayer = game.getSymbolPlayer1();
      result.updateBoardScheme(currentPosition, currentPlayer, counter);
      finalResult = result.getWinner(currentPosition, currentPlayer, counter);
      if (!finalResult) {
        let makeComputerTurn = function () {
          let randomCellNumber = game.getRandomCellNumber();
          play.makeTurnComputer(boardCells, randomCellNumber);
          counter = play.turnCounter();
          result.updateBoardScheme(randomCellNumber, game.getSymbolPlayer2(), counter);
          finalResult = result.getWinner(currentPosition, currentPlayer, counter);
          result.endTurn(finalResult, counter);
        };
        setTimeout(makeComputerTurn, 300);
      }
    }
  }
  result.endTurn(finalResult, counter);
}

document.querySelector(".main__button--next-game").addEventListener("click", (e) => {
  game.clearBoard();
  game.createBoard();
  game.enableBoard();
  play.resetTurnCounter();
  let gameNumber = result.getCurrentGameNumber();
  document.querySelector(".right-area__current-game-nr").textContent = ++gameNumber;
  document.querySelector(".main__result-message").textContent = "";
  document.querySelector(".main__button--next-game").classList.replace("btnEnabled", "btnDisabled");
  //reset On turn left area log
  document.querySelector(".left-area .left-area__turn .left-area__turn-name").textContent = game.getNamePlayer1();
  document.querySelector(".left-area .left-area__turn .left-area__turn-symbol").textContent = game.getSymbolPlayer1();
  if (e.target.textContent == "Rematch") {
    result.rematch();
    e.target.textContent = "Next Round";
  }
});

//select opponent
document.querySelector(".nav__game-mode").addEventListener("click", (e) => {
  if (e.target.className == "nav__button--sp" || e.target.className == "nav__icon--sp") {
    game.highlightSp();
    document.querySelector(".nav__input--opponent").value = "Computer";
    document.querySelector(".nav__input--opponent").disabled = true;
  }
  if (e.target.className == "nav__button--mp" || e.target.className == "nav__icon--mp") {
    game.highlightMp();
    document.querySelector(".nav__input--opponent").value = "";
    document.querySelector(".nav__input--opponent").disabled = false;
  }
});

//change X and O
document.querySelector(".nav__player-symbol").addEventListener("click", (e) => {
  if (e.target.classList.contains("nav__button--sp-symbol")) {
    if (e.target.textContent == "X") {
      e.target.textContent = "O";
      document.querySelector(".nav__button--mp-symbol").textContent = "X";
    } else {
      e.target.textContent = "X";
      document.querySelector(".nav__button--mp-symbol").textContent = "O";
    }
  }

  if (e.target.classList.contains("nav__button--mp-symbol")) {
    if (e.target.textContent == "X") {
      e.target.textContent = "O";
      document.querySelector(".nav__button--sp-symbol").textContent = "X";
    } else {
      e.target.textContent = "X";
      document.querySelector(".nav__button--sp-symbol").textContent = "O";
    }
  }
});

//get selected number of games to be played
document.querySelector(".nav__numbers").addEventListener("click", (e) => {
  if (e.target.tagName == "BUTTON") {
    console.log(`clicked number ${e.target.textContent}`);
    for (let i = 0; i < e.target.parentElement.children.length; i++) {
      e.target.parentElement.children[i].classList.replace("selected", "notSelected");
    }
  }
  e.target.classList.replace("notSelected", "selected");
});

let game = (function () {
  function createBoard() {
    let board = document.querySelector(".main .main__board");
    board.style.gridTemplateColumns = "repeat(3, 145px)";
    board.style.gridTemplateRows = "repeat(3, 145px)";
    board.style.width = "10wv";
    for (let i = 1; i <= 9; i++) {
      let cell = document.createElement("div");
      cell.style.width = "1fr";
      cell.style.height = "1fr";
      cell.classList.add(i);
      board.appendChild(cell);
    }
  }

  function highlightSp() {
    document.querySelector(".nav__button--sp").style.backgroundColor = "black";
    document.querySelector(".nav__icon--sp").style.filter = "invert(100)";
    document.querySelector(".nav__button--mp").style.backgroundColor = "white";
    document.querySelector(".nav__icon--mp").style.filter = "invert(0)";
  }

  function highlightMp() {
    document.querySelector(".nav__button--mp").style.backgroundColor = "black";
    document.querySelector(".nav__icon--mp").style.filter = "invert(100)";
    document.querySelector(".nav__button--sp").style.backgroundColor = "white";
    document.querySelector(".nav__icon--sp").style.filter = "invert(0)";
  }

  function highlightWinningPositions(i, boardSchemeCopy) {
    let [firstWinPos, secondWinPos, thirdWinPos] = boardSchemeCopy[i];
    document.querySelectorAll(".main__board div").forEach((item) => {
      if (item.className == firstWinPos || item.className == secondWinPos || item.className == thirdWinPos) {
        item.style.backgroundColor = "#303030";
        item.style.color = "white";
      }
    });
  }

  function createListOfWInners() {
    let listData = document.querySelector(
      ".right-area .right-area__log-items .right-area__result-list .right-area__list-data"
    );
    for (let i = 1; i <= game.getNumberOfGames(); i++) {
      let currentGame = document.createElement("div");
      currentGame.classList.add("currentGame");
      let currentGameNr = document.createElement("span");
      currentGameNr.classList.add("right-area__current-game-nr");
      let currentGameResult = document.createElement("div");
      currentGameResult.classList.add("currentGameResult", i);

      currentGameNr.textContent = "Game " + i;
      currentGame.appendChild(currentGameNr);

      listData.appendChild(currentGame);
      listData.appendChild(currentGameResult);
    }
  }

  function clearListOfWinners() {
    document.querySelector(
      ".right-area .right-area__log-items .right-area__result-list .right-area__list-data"
    ).innerHTML = "";
  }

  function initializeBoardData() {
    document.querySelector(".left-area .left-area__turn .left-area__turn-name").textContent = game.getNamePlayer1();
    document.querySelector(".left-area .left-area__turn .left-area__turn-symbol").textContent = game.getSymbolPlayer1();
    document.querySelector(".right-area .right-area__total-game-nr").textContent = game.getNumberOfGames();
    document.querySelector(".main__score .main__player-name").textContent = game.getNamePlayer1();
    document.querySelector(".main__score .main__opponent-name").textContent = game.getNamePlayer2();
    document.querySelector(".main__result-message").textContent = "";
    createListOfWInners();
  }

  function showBoard() {
    document.querySelector("nav").style.display = "none";
    document.querySelector(".main").style.display = "flex";
    hideHeaderFooter();
    if (game.getMode() != "nav__button--sp") {
      document.querySelector(".left-area").style.display = "flex";
    }
    document.querySelector(".right-area").style.display = "flex";
  }

  function showMenu() {
    document.querySelector("nav").style.display = "flex";
    document.querySelector(".main").style.display = "none";
    document.querySelector(".left-area").style.display = "none";
    document.querySelector(".right-area").style.display = "none";
  }

  function disableBoard() {
    document.querySelector(".main__board").removeEventListener("click", boardClickListener);
  }

  function enableBoard() {
    document.querySelector(".main__board").addEventListener("click", boardClickListener);
  }

  function clearBoard() {
    document.querySelector(".main .main__board").innerHTML = "";
  }

  function displayHeaderFooter() {
    document.querySelector(".header").style.display = "flex";
    document.querySelector(".footer").style.display = "flex";
  }

  function hideHeaderFooter() {
    document.querySelector(".header").style.display = "none";
    document.querySelector(".footer").style.display = "none";
  }

  let getMode = () => {
    let mode = document.querySelectorAll(".nav__game-mode button");

    for (let item of mode) {
      if (item.style.backgroundColor == "black") {
        return item.className;
      }
    }
  };

  let getNamePlayer1 = () => {
    if (document.querySelector(".nav__input--player").value != "") {
      return document.querySelector(".nav__input--player").value;
    } else return "Player 1";
  };

  let getNamePlayer2 = () => {
    if (getMode() == "nav__button--sp") {
      return document.querySelector(".nav__input--opponent").value;
    } else if (document.querySelector(".nav__input--opponent").value != "") {
      return document.querySelector(".nav__input--opponent").value;
    } else return "Player 2";
  };

  let getNumberOfGames = () => {
    const buttons = document.querySelectorAll(".nav__number-of-games button");
    for (let item of buttons) {
      if (item.classList.contains("selected")) {
        console.log(`selected je cislo ${item.textContent}`);
        return +item.textContent;
      }
    }
    return 1;
  };

  let getSymbolPlayer1 = () => document.querySelector(".nav__button--sp-symbol").textContent;

  let getSymbolPlayer2 = () => document.querySelector(".nav__button--mp-symbol").textContent;

  let getRandomCellNumber = () => {
    let emptyCells = result.getEmptyCellsFromBoardScheme();
    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  };

  return {
    displayHeaderFooter,
    createBoard,
    enableBoard,
    disableBoard,
    clearBoard,
    showBoard,
    showMenu,
    initializeBoardData,
    clearListOfWinners,
    highlightWinningPositions,
    getMode,
    getNamePlayer1,
    getNamePlayer2,
    getNumberOfGames,
    getSymbolPlayer1,
    getSymbolPlayer2,
    getRandomCellNumber,
    highlightMp,
    highlightSp,
    hideHeaderFooter,
  };
})();

let play = (function () {
  let turnCount = 0;
  let gameCount = 0;
  let makeTurnPlayer1 = (e) => {
    e.target.textContent = game.getSymbolPlayer1();
  };
  let makeTurnPlayer2 = (e) => {
    e.target.textContent = game.getSymbolPlayer2();
  };
  let makeTurnComputer = (boardCells, randomCellNumber) => {
    boardCells.forEach((item) => {
      if (item.classList.contains(randomCellNumber)) {
        item.textContent = game.getSymbolPlayer2();
      }
    });
  };

  let turnCounter = () => {
    ++turnCount;
    return turnCount;
  };

  let resetTurnCounter = () => {
    turnCount = 0;
  };

  let gameCounter = () => {
    gameCount++;
    return gameCount;
  };

  let resetGameCounter = () => {
    gameCount = 0;
  };

  let generateRandomPosition = () => {
    return Math.floor(Math.random() * (9 - 1 + 1) + 1);
  };

  return {
    makeTurnPlayer1,
    makeTurnPlayer2,
    turnCounter,
    resetTurnCounter,
    gameCounter,
    resetGameCounter,
    generateRandomPosition,
    makeTurnComputer,
  };
})();

let result = (function () {
  let boardScheme = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  let boardSchemeCopy = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];

  let resetBoardScheme = () => {
    boardScheme = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 6, 9],
      [1, 5, 9],
      [3, 5, 7],
    ];
  };

  let updateBoardScheme = (position, symbol) => {
    for (let i = 0; i < boardScheme.length; i++) {
      for (let j = 0; j < boardScheme[i].length; j++) {
        boardScheme[i][j] == +position ? (boardScheme[i][j] = symbol) : boardScheme[i][j];
      }
    }
  };

  let getWinner = (position, symbol, counter) => {
    updateBoardScheme(position, symbol, counter);
    for (let i = 0; i < boardScheme.length; ++i) {
      if (boardScheme[i].join("") == "XXX") {
        game.highlightWinningPositions(i, boardSchemeCopy);
        if (game.getSymbolPlayer1() == "X") {
          return game.getNamePlayer1();
        } else {
          return game.getNamePlayer2();
        }
      } else if (boardScheme[i].join("") == "OOO") {
        game.highlightWinningPositions(i, boardSchemeCopy);
        if (game.getSymbolPlayer1() == "O") {
          return game.getNamePlayer1();
        } else {
          return game.getNamePlayer2();
        }
      } //this was outside of the loop
    }
    if (counter == 9) {
      return "tie";
    }
  };

  let getScorePlayer = () => {
    let score = Number(document.querySelector(".main__player-score").textContent);
    return score;
  };

  let getSoreOpponent = () => {
    let score = Number(document.querySelector(".main__opponent-score").textContent);
    return score;
  };

  let getCurrentGameNumber = () => {
    let gameNumber = Number(document.querySelector(".right-area__current-game-nr").textContent);
    return gameNumber;
  };

  let getTotalGamesNumber = () => {
    let totalGames = Number(document.querySelector(".right-area__total-game-nr").textContent);
    return totalGames;
  };

  let updateScorePlayer = () => {
    let score = getScorePlayer();
    return ++score;
  };

  let updateScoreOpponent = () => {
    let score = getSoreOpponent();
    return ++score;
  };

  let updateScoreboard = (nameOfWinner) => {
    let scoreboard = document.querySelector(".main__game-score");
    if (scoreboard.querySelector(".main__player-name").textContent == nameOfWinner) {
      scoreboard.querySelector(".main__player-score").textContent = updateScorePlayer();
    } else {
      scoreboard.querySelector(".main__opponent-score").textContent = updateScoreOpponent(); //x
    }
  };

  let updateListOfWinners = (finalResult, currentNumberOfGame, counter) => {
    if (finalResult) {
      document.querySelectorAll(".right-area__list-data .currentGameResult").forEach((item) => {
        if (item.classList.contains(currentNumberOfGame)) {
          item.textContent = finalResult;
        }
      });
    } else if (!finalResult && counter == 9) {
      document.querySelectorAll(".right-area__list-data .currentGameResult").forEach((item) => {
        if (item.classList.contains(currentNumberOfGame)) {
          item.textContent = "Tie!";
        }
      });
    }
  };

  let getBoardScheme = () => {
    return boardScheme;
  };

  let getEmptyCellsFromBoardScheme = () => {
    let emptyCells = new Set();
    let arrayOfEmptyCells = [];
    for (let i = 0; i < boardScheme.length; i++) {
      for (let j = 0; j < boardScheme[i].length; j++) {
        emptyCells.add(boardScheme[i][j]);
      }
    }
    emptyCells.forEach((item) => {
      if (typeof item == "number") {
        arrayOfEmptyCells.push(item);
      }
    });

    return arrayOfEmptyCells;
  };

  let endTurn = (finalResult, counter) => {
    const currentGameNumber = getCurrentGameNumber();
    const totalGamesNumber = getTotalGamesNumber();

    if (finalResult === "tie" && counter === 9) {
      //final turn has been played and game ends in a tie
      if (currentGameNumber === totalGamesNumber) {
        //it was the last game of the tournament
        document.querySelector(".main__button--next-game").textContent = "Rematch";
        const playerScore = getScorePlayer();
        const opponentScore = getSoreOpponent();

        if (playerScore === opponentScore) {
          //evaluate winner of the tournament
          document.querySelector(".main__result-message").textContent = `Match has ended in a tie!`;
        } else if (playerScore > opponentScore) {
          document.querySelector(
            ".main__result-message"
          ).textContent = `${game.getNamePlayer1()} is the absolute winner!`;
        } else if (playerScore < opponentScore) {
          document.querySelector(
            ".main__result-message"
          ).textContent = `${game.getNamePlayer2()} is the absolute winner!`;
        }
      } else {
        // its a tie but not the final game of the tournament
        document.querySelector(".main__result-message").textContent = "It's a tie!";
      }
      updateListOfWinners(finalResult, play.gameCounter(), counter);
      game.disableBoard();
      resetBoardScheme();
      document.querySelector(".main__button--next-game").classList.replace("btnDisabled", "btnEnabled");
    } else if (finalResult !== "tie" && finalResult) {
      //final turn has been played and game DOES NOT end in a tie
      updateScoreboard(finalResult);
      updateListOfWinners(finalResult, play.gameCounter(), counter);
      document.querySelector(".main__button--next-game").classList.replace("btnDisabled", "btnEnabled");

      if (currentGameNumber < totalGamesNumber) {
        //end of game but NOT the end of tournament
        document.querySelector(".main__result-message").textContent = `${finalResult || "No one"} has won this round!`;
      } else if (currentGameNumber === totalGamesNumber) {
        //it was the last game of the tournament
        document.querySelector(".main__button--next-game").textContent = "Rematch";
        const playerScore = getScorePlayer();
        const opponentScore = getSoreOpponent();

        if (playerScore === opponentScore) {
          //evaluate winner of the tournament
          document.querySelector(".main__result-message").textContent = `Match has ended in a tie!`;
        } else if (playerScore > opponentScore) {
          document.querySelector(
            ".main__result-message"
          ).textContent = `${game.getNamePlayer1()} is the absolute winner!`;
        } else if (playerScore < opponentScore) {
          document.querySelector(
            ".main__result-message"
          ).textContent = `${game.getNamePlayer2()} is the absolute winner!`;
        }
      }
      game.disableBoard();
      resetBoardScheme();
    }
  };

  let rematch = () => {
    document.querySelector(".right-area__current-game-nr").textContent = 1;
    document.querySelector(".main__player-score").textContent = 0;
    document.querySelector(".main__opponent-score").textContent = 0;
    game.clearListOfWinners();
    game.initializeBoardData();
    play.resetGameCounter();
    resetBoardScheme();
    play.resetTurnCounter();
  };

  return {
    getWinner,
    updateBoardScheme,
    getBoardScheme,
    getEmptyCellsFromBoardScheme,
    endTurn,
    getCurrentGameNumber,
    getTotalGamesNumber,
    rematch,
  };
})();
