'use strict'

document.querySelector('nav .startGame').addEventListener('click', () => {
    if (game.getMode()) {

        showBoard();
        createBoard();
        initializeBoardData();
        result.rematch();
        document.querySelector('.nextGame').textContent = 'Next Round';
        document.querySelector('.nextGame').classList.replace('btnEnabled', 'btnDisabled');
    }
    else {
        document.querySelector('.startGameWarning').style.display = 'block';
    }
})

document.querySelector('main .options .menuBtn').addEventListener('click', () => {
    showMenu();
    clearBoard();
    clearListOfWinners();
    play.resetGameCounter();
    enableBoard();

    document.querySelector('.startGameWarning').style.display = 'none';
})

function createBoard() {
    let board = document.querySelector('main .board');
    board.style.gridTemplateColumns = 'repeat(3, 145px)';
    board.style.gridTemplateRows = 'repeat(3, 145px)';
    board.style.width = '10wv';
    for (let i = 1; i <= 9; i++) {
        let cell = document.createElement('div');
        cell.style.width = '1fr';
        cell.style.height = '1fr';
        cell.classList.add(i);
        board.appendChild(cell);
    }

}

function clearBoard() {
    document.querySelector('main .board').innerHTML = '';
    document.querySelector('header').style.display = 'flex';
    document.querySelector('footer').style.display = 'flex';
}

let game = (function () {

    let getMode = () => {
        let mode = document.querySelectorAll('.gameMode button');

        for (let item of mode) {
            if (item.style.backgroundColor == 'black') {
                return item.className;
            }
        }
        // return 'sp';
    }

    let getNamePlayer1 = () => {
        if ((document.querySelector('#nameP').value) != '') {
            return document.querySelector('#nameP').value
        } else return 'Player 1';
    }


    let getNamePlayer2 = () => {
        if (getMode() == 'sp') {
            return document.querySelector('#nameO').value
        } else if (document.querySelector('#nameO').value != '') {
            return document.querySelector('#nameO').value
        } else return 'Player 2';
    }

    let getNumberOfGames = () => {
        const buttons = document.querySelectorAll('.numberOfGames button');
        for (let item of buttons) {
            if (item.className == 'selected') {
                return +item.textContent;
            }
        }
        return 1;
    }

    let getSymbolPlayer1 = () => document.querySelector('.btnSP').textContent;
    let getSymbolPlayer2 = () => document.querySelector('.btnMP').textContent;

    let getRandomCellNumber = () => {
        let emptyCells = result.getEmptyCellsFromBoardScheme();
        let randomIndex = Math.floor(Math.random() * emptyCells.length)
        return emptyCells[randomIndex];
    }



    return { getMode, getNamePlayer1, getNamePlayer2, getNumberOfGames, getSymbolPlayer1, getSymbolPlayer2, getRandomCellNumber }
})();



let play = (function () {
    let turnCount = 0;
    let gameCount = 0;
    let makeTurnPlayer1 = (e) => e.target.textContent = game.getSymbolPlayer1();
    let makeTurnPlayer2 = (e) => e.target.textContent = game.getSymbolPlayer2();

    let makeTurnComputer = (boardCells, randomCellNumber) => {
        boardCells.forEach(item => {
            if (item.classList.contains(randomCellNumber)) {
                item.textContent = game.getSymbolPlayer2();
            }
        })
    }


    let turnCounter = () => {
        ++turnCount;
        return turnCount;
    }

    let resetTurnCounter = () => {
        turnCount = 0;
    }

    let gameCounter = () => {
        gameCount++;
        return gameCount;
    }

    let resetGameCounter = () => {
        gameCount = 0;
    }

    let generateRandomPosition = () => {
        return Math.floor(Math.random() * (9 - 1 + 1) + 1);
    }

    return { makeTurnPlayer1, makeTurnPlayer2, turnCounter, resetTurnCounter, gameCounter, resetGameCounter, generateRandomPosition, makeTurnComputer }
})()

document.querySelector('.nextGame').addEventListener('click', (e) => {
    clearBoard();
    createBoard();
    enableBoard();
    play.resetTurnCounter();
    let gameNumber = result.getCurrentGameNumber();
    document.querySelector('.currentGameNr').textContent = ++gameNumber;
    document.querySelector('.gameResultMessage').textContent = '';
    document.querySelector('.nextGame').classList.replace('btnEnabled', 'btnDisabled')
    if (e.target.textContent == 'Rematch') {
        result.rematch();
        e.target.textContent = 'Next Round'
    }
})

function boardClickListener(e) {
    let currentPlayer;
    let currentPosition;
    let finalResult;
    let gameMode = game.getMode();
    let counter;
    let boardCells = document.querySelectorAll('.board div');



    if (gameMode == 'mp') {

        if (e.target.textContent == '') {
            counter = play.turnCounter();
            currentPosition = e.target.className;
            if (counter % 2 == 1) {
                play.makeTurnPlayer1(e);

                document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer2();
                document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer2();
                currentPlayer = game.getSymbolPlayer1();
            } else {
                play.makeTurnPlayer2(e);

                document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer1();
                document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer1();
                currentPlayer = game.getSymbolPlayer2()
            };

            finalResult = result.getWinner(currentPosition, currentPlayer, counter);
        }
    }

    else if (gameMode == 'sp') {

        if (e.target.textContent == '') {

            play.makeTurnPlayer1(e); //ja kam kliknem tam da moj symbol
            counter = play.turnCounter(); //zapocita ze presiel tah mna
            currentPosition = e.target.className; //zisti policko kam som klikol
            currentPlayer = game.getSymbolPlayer1(); //zisti moj symbol
            console.log(counter);
            result.updateBoardScheme(currentPosition, currentPlayer, counter); //do boardscheme zaznaci miesto kam som klikol mojim symbolom
            finalResult = result.getWinner(currentPosition, currentPlayer, counter);
            if (!(finalResult)) {

                let makeComputerTurn = function () {
                    let randomCellNumber = game.getRandomCellNumber(); //zisti nahodne volne policko pre comp
                    play.makeTurnComputer(boardCells, randomCellNumber); //na nahodne policko zaznaci comp symbol
                    counter = play.turnCounter(); //zapocita ze presiel tah comp
                    console.log(counter);
                    result.updateBoardScheme(randomCellNumber, game.getSymbolPlayer2(), counter); //do boardscheme zaznaci miesto kam dal symbol comp
                    finalResult = result.getWinner(currentPosition, currentPlayer, counter); //zisti ci su 3 policka oznacene a ak ano tak do finalResult da meno toho, kto oznacil tie 3 policka

                    result.endTurn(finalResult, counter);
                }
                setTimeout(makeComputerTurn, 300);
            }
        }
    }

    result.endTurn(finalResult, counter);

}

document.querySelector('.board').addEventListener('click', boardClickListener);


function disableBoard() {
    document.querySelector('.board').removeEventListener('click', boardClickListener);
}

function enableBoard() {
    document.querySelector('.board').addEventListener('click', boardClickListener);
}

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
    }


    let updateBoardScheme = (position, symbol) => {

        for (let i = 0; i < boardScheme.length; i++) {
            for (let j = 0; j < boardScheme[i].length; j++) {
                boardScheme[i][j] == +position ? boardScheme[i][j] = symbol : boardScheme[i][j]
            }
        }
    }

    let getWinner = (position, symbol, counter) => {
        updateBoardScheme(position, symbol, counter)

        for (let i = 0; i < boardScheme.length; i++) {
            if (boardScheme[i].join('') == 'XXX') {

                highlightWinningPositions(i, boardSchemeCopy);
                if (game.getSymbolPlayer1() == 'X') {


                    return game.getNamePlayer1();
                } else return game.getNamePlayer2();

            } else if (boardScheme[i].join('') == 'OOO') {

                highlightWinningPositions(i, boardSchemeCopy);
                if (game.getSymbolPlayer1() == 'O') {


                    return game.getNamePlayer1();
                } else return game.getNamePlayer2();
            }
        }
    }

    let getScorePlayer = () => Number(document.querySelector('.scoreP').textContent);

    let getSoreOpponent = () => Number(document.querySelector('.scoreO').textContent);

    let getCurrentGameNumber = () => Number(document.querySelector('.currentGameNr').textContent);

    let getTotalGamesNumber = () => Number(document.querySelector('.totalGameNr').textContent);

    let updateScorePlayer = () => {
        let score = getScorePlayer();
        return ++score;
    }

    let updateScoreOpponent = () => {
        let score = getSoreOpponent();
        return ++score;
    }

    let updateScoreboard = (nameOfWinner) => {
        let scoreboard = document.querySelector('.gameScore');


        if (scoreboard.querySelector('.nameP').textContent == nameOfWinner) {
            scoreboard.querySelector('.scoreP').textContent = updateScorePlayer();
        } else {
            scoreboard.querySelector('.scoreO').textContent = updateScoreOpponent(); //x
        }
    }

    let updateListOfWinners = (finalResult, currentNumberOfGame, counter) => {
        if (finalResult) {
            document.querySelectorAll('.listData .currentGameResult').forEach(item => {
                if (item.classList.contains(currentNumberOfGame)) {
                    item.textContent = finalResult;
                }
            })
        } else if (!(finalResult) && (counter == 9)) {
            document.querySelectorAll('.listData .currentGameResult').forEach(item => {
                if (item.classList.contains(currentNumberOfGame)) {
                    item.textContent = 'Tie!';
                }
            })
        }
    }

    let getBoardScheme = () => {
        return boardScheme;
    }

    let getEmptyCellsFromBoardScheme = () => {
        let emptyCells = new Set();
        let arrayOfEmptyCells = [];
        for (let i = 0; i < boardScheme.length; i++) {
            for (let j = 0; j < boardScheme[i].length; j++) {
                emptyCells.add(boardScheme[i][j]);
            }
        }

        emptyCells.forEach(item => {
            if (typeof (item) == 'number') {
                arrayOfEmptyCells.push(item);
            }
        })
        return arrayOfEmptyCells;
    }

    let endTurn = (finalResult, counter) => {
        if (!(finalResult) && (counter == 9)) {


            document.querySelector('.gameResultMessage').textContent = 'It\'s a tie!';

            updateListOfWinners(finalResult, play.gameCounter(), counter);
            finalResult = undefined;

            disableBoard()
            resetBoardScheme()
            document.querySelector('.nextGame').classList.replace('btnDisabled', 'btnEnabled')


        } else if (finalResult) {
            updateScoreboard(finalResult)
            updateListOfWinners(finalResult, play.gameCounter(), counter);
            document.querySelector('.nextGame').classList.replace('btnDisabled', 'btnEnabled')
            if ((getCurrentGameNumber()) < (getTotalGamesNumber())) {
                document.querySelector('.gameResultMessage').textContent = `${finalResult} has won this round!`;
            } else if ((getCurrentGameNumber()) == (getTotalGamesNumber())) { //final game has just been played
                if ((getScorePlayer()) == (getSoreOpponent())) {
                    document.querySelector('.gameResultMessage').textContent = `Match has ended in a tie!`;
                } else if ((getScorePlayer()) > (getSoreOpponent())) {
                    document.querySelector('.gameResultMessage').textContent = `${game.getNamePlayer1()} is the absolute winner!`;

                } else if ((getScorePlayer()) < (getSoreOpponent())) {
                    document.querySelector('.gameResultMessage').textContent = `${game.getNamePlayer2()} is the absolute winner!`;

                }
                document.querySelector('.nextGame').textContent = 'Rematch'
            }
            finalResult = undefined;
            disableBoard()
            resetBoardScheme()
        }
    }

    let rematch = () => {
        document.querySelector('.currentGameNr').textContent = 1;
        document.querySelector('.scoreP').textContent = 0;
        document.querySelector('.scoreO').textContent = 0;
        clearListOfWinners()
        createListOfWInners()
        play.resetGameCounter()
        resetBoardScheme()
        play.resetTurnCounter()
    }

    return { getWinner, updateBoardScheme, getBoardScheme, getEmptyCellsFromBoardScheme, endTurn, getCurrentGameNumber, getTotalGamesNumber, rematch }

})();

function highlightWinningPositions(i, boardSchemeCopy) {
    let [firstWinPos, secondWinPos, thirdWinPos] = boardSchemeCopy[i];
    document.querySelectorAll('.board div').forEach(item => {
        if ((item.className == firstWinPos) || (item.className == secondWinPos) || (item.className == thirdWinPos)) {
            item.style.backgroundColor = '#303030';
            item.style.color = 'white';
        }
    })
}



function createListOfWInners() {

    let listData = document.querySelector('.rightArea .logItems .resultList .listData');
    for (let i = 1; i <= game.getNumberOfGames(); i++) {

        let currentGame = document.createElement('div');
        currentGame.classList.add('currentGame');
        let currentGameNr = document.createElement('span');
        currentGameNr.classList.add('currentGameNr')
        let currentGameResult = document.createElement('div');
        currentGameResult.classList.add('currentGameResult', i)


        currentGameNr.textContent = 'Game ' + i;
        currentGame.appendChild(currentGameNr);

        listData.appendChild(currentGame);
        listData.appendChild(currentGameResult);
    }
}

function clearListOfWinners() {
    document.querySelector('.rightArea .logItems .resultList .listData').innerHTML = '';
}

function initializeBoardData() {
    document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer1();
    document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer1();
    document.querySelector('.rightArea .totalGameNr').textContent = game.getNumberOfGames();
    document.querySelector('.score .nameP').textContent = game.getNamePlayer1();
    document.querySelector('.score .nameO').textContent = game.getNamePlayer2();
    createListOfWInners();
}

function showBoard() {
    document.querySelector('nav').style.display = 'none';
    document.querySelector('main').style.display = 'flex';
    document.querySelector('header').style.display = 'none';
    document.querySelector('footer').style.display = 'none';

    if (game.getMode() != 'sp') {
        document.querySelector('.leftArea').style.display = 'flex';
    }

    document.querySelector('.rightArea').style.display = 'flex';
}

function showMenu() {
    document.querySelector('nav').style.display = 'flex';
    document.querySelector('main').style.display = 'none';
    document.querySelector('.leftArea').style.display = 'none';
    document.querySelector('.rightArea').style.display = 'none';
}

function logResult() {

}


//select opponent
document.querySelector('.gameMode').addEventListener("click", (e) => {

    if ((e.target.className == "sp") || (e.target.className == 'spImg')) {
        highlightSp()
        document.querySelector('#nameO').value = 'Computer'
        document.querySelector('#nameO').disabled = true;

    }
    if ((e.target.className == "mp") || (e.target.className == 'mpImg')) {
        highlightMp()
        document.querySelector('#nameO').value = '';
        document.querySelector('#nameO').disabled = false;
    }
})

//change X and O
document.querySelector('.playerSymbol').addEventListener('click', (e) => {
    if (e.target.classList.contains('btnSP')) {
        if (e.target.textContent == 'X') {
            e.target.textContent = 'O';
            document.querySelector('.btnMP').textContent = 'X';
        } else {
            e.target.textContent = 'X';
            document.querySelector('.btnMP').textContent = 'O';
        }
    }

    if (e.target.classList.contains('btnMP')) {
        if (e.target.textContent == 'X') {
            e.target.textContent = 'O';
            document.querySelector('.btnSP').textContent = 'X';
        } else {
            e.target.textContent = 'X';
            document.querySelector('.btnSP').textContent = 'O';
        }
    }
})

//get selected number of games to be played

document.querySelector('.numberOfGames div').addEventListener('click', (e) => {

    if (e.target.tagName == 'BUTTON') {
        for (let i = 0; i < e.target.parentElement.children.length; i++) {
            e.target.parentElement.children[i].classList.replace('selected', 'notSelected');
        }
    }
    e.target.classList.replace('notSelected', 'selected');
});



function highlightSp() {
    document.querySelector('.sp').style.backgroundColor = 'black';
    document.querySelector('.spImg').style.filter = 'invert(100)';
    document.querySelector('.mp').style.backgroundColor = 'white';
    document.querySelector('.mpImg').style.filter = 'invert(0)';
}

function highlightMp() {
    document.querySelector('.mp').style.backgroundColor = 'black';
    document.querySelector('.mpImg').style.filter = 'invert(100)';
    document.querySelector('.sp').style.backgroundColor = 'white';
    document.querySelector('.spImg').style.filter = 'invert(0)';
}
