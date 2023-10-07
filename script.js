'use strict'

document.querySelector('nav .startGame').addEventListener('click', () => {
    showBoard();
    console.log(NumberOfGames.getNumberOfGames());
    createBoard();
})

document.querySelector('main .options .menuBtn').addEventListener('click', () => {
    showMenu()
})

// document.querySelector('nav .gameMode').addEventListener('click', () => {
//     let sp = document.querySelector('.sp');
//     let mp = document.querySelector('.mp');
//     if (!(sp.classList.contains('checked'))) {
//         sp.classList.add('checked')
//         mp.classList.remove('checked');
//     }
//     if (!(mp.classList.contains('checked'))) {
//         mp.classList.add('checked')
//         sp.classList.remove('checked');
//     }
// })



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

document.querySelector('.playerSymbol').addEventListener('click', (e) => {

    if (e.target.className == 'spXO') {
        e.target.textContent = 'O';
        document.querySelector
    }

})

let NumberOfGames = (() => {
    let selectedNumber = null;

    document.querySelector('.numberOfGames div').addEventListener('click', (e) => {
        let clearNumbers = (e) => {
            if (e.target.tagName == 'BUTTON') {
                for (let i = 0; i < e.target.parentElement.children.length; i++) {
                    e.target.parentElement.children[i].classList.replace('selected', 'notSelected');
                }
            }
        }

        let number = (e) => {
            e.target.classList.replace('notSelected', 'selected');
            selectedNumber = e.target.textContent;
        }

        clearNumbers(e);
        number(e);
    });

    let getNumberOfGames = () => +selectedNumber;

    return { getNumberOfGames };
})();

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
