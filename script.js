'use strict'

let game = getGameData();


document.querySelector('nav .startGame').addEventListener('click', () => {
    showBoard();
    createBoard();
    initializeBoardData();
})

document.querySelector('main .options .menuBtn').addEventListener('click', () => {
    showMenu();
    clearBoard();
    clearListOfWinners();
})

function createBoard() {
    let board = document.querySelector('main .board');
    board.style.gridTemplateColumns = 'repeat(3, 10vw)';
    board.style.gridTemplateRows = 'repeat(3, 10vw)';
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
}

function getGameData() {

    let getMode = () => {
        let mode = document.querySelectorAll('.gameMode button');

        for (let item of mode) {
            if (item.style.backgroundColor == 'black') {
                return item.className;
            }
        }

        //if no mode is selected, select singleplayer
        return 'sp';
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



    return { getMode, getNamePlayer1, getNamePlayer2, getNumberOfGames, getSymbolPlayer1, getSymbolPlayer2 }
}

function playTurn() {
    let turnCount = 0;
    let makeTurnPlayer1 = (e) => e.target.textContent = game.getSymbolPlayer1();
    let makeTurnPlayer2 = (e) => e.target.textContent = game.getSymbolPlayer2();
    let turnCounter = () => {
        turnCount++;
        return turnCount;
    }

    return { makeTurnPlayer1, makeTurnPlayer2, turnCounter }
}

let play = playTurn();
let result = gameResult();

function boardClickListener(e) {
    let currentPlayer;
    let currentPosition;
    let totalNumberOfGames = game.getNumberOfGames()
    let currentNumberOfGame = 1;
    let counter = play.turnCounter()
    if (e.target.textContent == '') {
        currentPosition = e.target.className;
        console.log(counter)
        if (counter % 2 == 1) {
            play.makeTurnPlayer1(e);
            history.recordTurnPlayer1(e);
            document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer2();
            document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer2();
            currentPlayer = game.getSymbolPlayer1();
        } else {
            play.makeTurnPlayer2(e);
            history.recordTurnPlayer2(e);
            document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer1();
            document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer1();
            currentPlayer = game.getSymbolPlayer2()
        };
        let finalResult = result.getWinner(currentPosition, currentPlayer, counter)
        if (!(finalResult) && (counter == 9)) {
            document.querySelector('.gameResultMessage').textContent = 'It\'s a tie!';
            document.querySelectorAll('.listData .currentGameResult').forEach(item => {
                if (item.classList.contains(currentNumberOfGame)) {
                    item.textContent = 'Tie'
                }
            })
            document.querySelector('.board').removeEventListener('click', boardClickListener);
        } else if (finalResult) {
            document.querySelector('.gameResultMessage').textContent = `${finalResult} has won this round!`;
            result.updateScoreboard(finalResult)
            document.querySelectorAll('.listData .currentGameResult').forEach(item => {
                if (item.classList.contains(currentNumberOfGame)) {
                    item.textContent = finalResult
                }
            })
            document.querySelector('.board').removeEventListener('click', boardClickListener);
        }
    }
}

document.querySelector('.board').addEventListener('click', boardClickListener);


function gameResult() {
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

    let updateScoreboard = (nameOfWinner) => {
        let scoreboard = document.querySelector('.gameScore');
        let scorePlayer = Number(scoreboard.querySelector('.scoreP').textContent);
        let scoreOpponent = Number(scoreboard.querySelector('.scoreO').textContent);
        if (scoreboard.querySelector('.nameP').textContent == nameOfWinner) {
            scoreboard.querySelector('.scoreP').textContent = ++scorePlayer
        } else {
            scoreboard.querySelector('.scoreP').textContent = ++scoreOpponent
        }
    }

    return { getWinner, updateScoreboard }
}

function highlightWinningPositions(i, boardSchemeCopy) {
    let [firstWinPos, secondWinPos, thirdWinPos] = boardSchemeCopy[i];
    document.querySelectorAll('.board div').forEach(item => {
        if ((item.className == firstWinPos) || (item.className == secondWinPos) || (item.className == thirdWinPos)) {
            item.style.backgroundColor = '#303030';
            item.style.color = 'white';
        }
    })
}



let history = (function () {

    let arrP1 = [];
    let arrP2 = [];

    let recordTurnPlayer1 = (e) => arrP1.push(+e.target.className);
    let undoTurnPlayer1 = () => arrP1.pop();
    let historyPlayer1 = () => arrP1;

    let recordTurnPlayer2 = (e) => arrP2.push(+e.target.className);
    let undoTurnPlayer2 = () => arrP2.pop();
    let historyPlayer2 = () => arrP2;

    return { recordTurnPlayer1, recordTurnPlayer2, undoTurnPlayer1, undoTurnPlayer2, historyPlayer1, historyPlayer2 };
})();

//after each game run this function and update winnerName at current i

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
    document.querySelector('.leftArea').style.display = 'flex';
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
