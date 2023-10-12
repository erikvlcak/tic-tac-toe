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
        let mode = undefined;
        document.querySelectorAll('.gameMode button').forEach(item => {
            if (item.style.backgroundColor == 'black') {
                mode = item.className;
            }
        })
        return mode;
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
        let number = undefined;
        document.querySelectorAll('.numberOfGames button').forEach(item => {
            if (item.className == 'selected') {
                number = +item.textContent;
            } else number = 1;
        })
        return number;
    }

    let getSymbolPlayer1 = () => document.querySelector('.btnSP').textContent;

    let getSymbolPlayer2 = () => document.querySelector('.btnMP').textContent;



    return { getMode, getNamePlayer1, getNamePlayer2, getNumberOfGames, getSymbolPlayer1, getSymbolPlayer2 }
}

function playTurn() {

    let turnCount = 1;

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

document.querySelector('.board').addEventListener('click', (e) => {
    let currentPlayer;
    let currentPosition;
    if (e.target.textContent == '') {
        currentPosition = e.target.className;
        if (play.turnCounter() % 2 == 0) {
            play.makeTurnPlayer1(e);
            history.recordTurnPlayer1(e);
            document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer2();
            document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer2();
            currentPlayer = game.getSymbolPlayer1();
            // console.log(history.historyPlayer1())
        } else {
            play.makeTurnPlayer2(e);
            history.recordTurnPlayer2(e);
            document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer1();
            document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer1();
            currentPlayer = game.getSymbolPlayer2()
            // console.log(history.historyPlayer2())
        }
        result.checkWinner(currentPosition, currentPlayer);
    }
})

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

    let updateBoardScheme = (position, symbol) => {
        for (let i = 0; i < boardScheme.length; i++) {
            for (let j = 0; j < boardScheme[i].length; j++) {
                boardScheme[i][j] == +position ? boardScheme[i][j] = symbol : boardScheme[i][j]
            }
        }
    }

    let checkWinner = (position, symbol) => {
        updateBoardScheme(position, symbol)
        for (let i = 0; i < boardScheme.length; i++) {
            if (boardScheme[i].join('') == 'XXX') {
                console.log('vyhral X');
            } else if (boardScheme[i].join('') == 'OOO') {
                console.log('vyhral O');
            }
        }
    }

    return { checkWinner }
}



function playHistory() {

    let arrP1 = [];
    let arrP2 = [];

    let recordTurnPlayer1 = (e) => arrP1.push(+e.target.className);
    let undoTurnPlayer1 = () => arrP1.pop();
    let historyPlayer1 = () => arrP1;

    let recordTurnPlayer2 = (e) => arrP2.push(+e.target.className);
    let undoTurnPlayer2 = () => arrP2.pop();
    let historyPlayer2 = () => arrP2;

    return { recordTurnPlayer1, recordTurnPlayer2, undoTurnPlayer1, undoTurnPlayer2, historyPlayer1, historyPlayer2 };
}

let history = playHistory();


function initializeBoardData() {
    document.querySelector('.leftArea .turn .turnName').textContent = game.getNamePlayer1();
    document.querySelector('.leftArea .turn .turnSymbol').textContent = game.getSymbolPlayer1();
    document.querySelector('.rightArea .totalGameNr').textContent = game.getNumberOfGames();
    document.querySelector('.score .nameP').textContent = game.getNamePlayer1();
    document.querySelector('.score .nameO').textContent = game.getNamePlayer2();
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
