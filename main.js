const audio = new Audio("music.mp3");
const lose = new Audio("vacaDie.mp3");
const vacaWin = new Audio("vacaWin.mp3");
const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const up = document.querySelector('#up');
const down = document.querySelector('#down');
const left = document.querySelector('#left');
const right = document.querySelector('#right');
const vidaSpan = document.querySelector('.vidas');
const tiempoSpan = document.querySelector('.tiempo');
const recordSpan = document.querySelector('.record');
let canvasSize;
let level = 0;
let bombas = [];
let vidas = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
    startX: undefined,
    startY: undefined,
}
const giftPosition = {
    x: undefined,
    y: undefined,
}
let elementSize;
// Declaramos las funciones de movimiento
up.addEventListener('click', moveUp);
down.addEventListener('click', moveDown);
left.addEventListener('click', moveLeft);
right.addEventListener('click', moveRight);
document.addEventListener('keydown', (evento) => {
    let tecla = evento.code;
    switch (tecla) {
        case 'ArrowUp':
        moveUp();
        break;
        case 'ArrowDown':
        moveDown();
        break;
        case 'ArrowLeft':
        moveLeft();
        break;
        case 'ArrowRight':
        moveRight();
        break;
    }
    
});
//

window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);
function showLives() {
    vidaSpan.innerHTML = emojis["HEART"].repeat(vidas)
}
function showTime() {
    tiempoSpan.innerHTML = Date.now() - timeStart;
}
function moveUp() {
    if (playerPosition.y > elementSize*2) {
        playerPosition.y -= elementSize;
        startGame();
        movePlayer();
    }
}
function moveDown() {
    if (playerPosition.y < (elementSize*10))
    playerPosition.y += elementSize;
    startGame();
    movePlayer();
}
function moveLeft() {
    if(playerPosition.x > elementSize) {
        playerPosition.x -= elementSize;
        startGame();
        movePlayer();
    }
}
function moveRight() {
    if (playerPosition.x < (elementSize*9)) {
        playerPosition.x += elementSize;
    startGame();
    movePlayer();
    }
}

function resizeCanvas() {
    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.8;
    } else {
        canvasSize = window.innerHeight * 0.8;
    }
    canvasSize = Number(canvasSize.toFixed(3));
    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    elementSize = (canvasSize / 10);
    startGame();
}
function clearCanvas() {
    game.clearRect(0,0, canvasSize, canvasSize);
}
function startGame() {
    recordSpan.innerHTML = localStorage.getItem('record');
    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime, 100);
    }
    audio.volume = 0.5;
    audio.play();
    let mapaMejorado = maps[level].trim().split('\n');
    let mapaFinal = mapaMejorado.map(row => row.trim().split(''));
    bombas = [];
    clearCanvas();
    game.textAlign = 'end';
    game.font = elementSize - 12 + 'px Verdana'
    mapaFinal.forEach((row, rowIndex) => {
        row.forEach((col, colIndex) => {
            let posX = elementSize * (colIndex + 1);
            let posY = elementSize * (rowIndex + 1);
            game.fillText(emojis[col], posX, posY);
            if (col == 'O') {
                playerPosition.startX = posX;
                playerPosition.startY = posY;
            }
            if (col == 'O' && playerPosition.x == undefined && playerPosition.y == undefined) {
                playerPosition.x = posX;
                playerPosition.y = posY;
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            }
                if (col == 'X'){
                    bombas.push({
                        x: posX,
                        y: posY,
                    })
                }
        })
    })
    movePlayer();
    showLives();
}
function levelWin() {
    if (level < (maps.length - 1)) {
        level++;
        vacaWin.volume = 0.7;
        vacaWin.play();
        startGame();
    } else {
        gameWin();
    }
}
function gameWin() {
    clearInterval(timeInterval)
    timePlayer = parseFloat(tiempoSpan.innerHTML);
    localRecord = localStorage.getItem('record');
    if (!localStorage.getItem('record')) {
        localStorage.setItem('record', timePlayer);
    } else {
        if (localStorage.getItem('record') > timePlayer) {
            localStorage.setItem('record', timePlayer)
        }
    }
    recordSpan.innerHTML = localStorage.getItem('record');
}
function levelFail() {
    vidas--;
    lose.volume = 0.7;
    lose.play();
    if (vidas <= 0) {
        level = 0;
        vidas = 4;
        timeStart = undefined;
        startGame();
    }
    playerPosition.x = playerPosition.startX;
    playerPosition.y = playerPosition.startY;
    startGame();
}
function movePlayer() {
    let giftPositionInX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    let giftPositionInY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    let giftEnd = giftPositionInX && giftPositionInY;

    if (giftEnd) {
        levelWin();
    }
    const enemyCollision = bombas.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
      });
      
      if (enemyCollision) {
        levelFail();
      }
        game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}