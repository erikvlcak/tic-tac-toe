'use strict'

let game = getGameSetup();

document.querySelector('nav .startGame').addEventListener('click', () => {
    showBoard();
    createBoard();
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

function getGameSetup() {

    let getMode = () => {
        let mode = undefined;
        document.querySelectorAll('.gameMode button').forEach(item => {
            if (item.style.backgroundColor == 'black') {
                mode = item.className;
            }
        })
        return mode;
    }

    let getNamePlayer1 = () => document.querySelector('#nameP').value;

    let getNamePlayer2 = () => document.querySelector('#nameO').value;

    let getNumberOfGames = () => {
        let number = undefined;
        document.querySelectorAll('.numberOfGames button').forEach(item => {
            if (item.className == 'selected') {
                number = item.textContent;
            }
        })
        return number;
    }

    let getSymbolPlayer1 = () => document.querySelector('.btnSP').textContent;

    let getSymbolPlayer2 = () => document.querySelector('.btnMP').textContent;

    return { getMode, getNamePlayer1, getNamePlayer2, getNumberOfGames, getSymbolPlayer1, getSymbolPlayer2 }
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
