'use strict'

document.querySelector('nav .startGame').addEventListener('click', () => {
    showBoard();

})

document.querySelector('main .options .menuBtn').addEventListener('click', () => {
    showMenu()

})

function createPlayer() {

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

function 