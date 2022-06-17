const startContainer = document.getElementById('start-container');
const btnStart = document.getElementById('start');

const gameContainer = document.getElementById('game-container');
const map = document.getElementById('map');
const blockSize = 20;

const endContainer = document.getElementById('end-container');
const btnReStart = document.getElementById('reStart');

let snakeHead;
const snakeTailBlock = document.getElementsByClassName('snakeTail');

const btnDifficulty = document.getElementsByClassName('btnDifficulty');

let difficulty = 150; 
let direction = 'right';
let score = 0;
let gameLoop;

const init = () => {
    for(let button of btnDifficulty){
        button.addEventListener('click', setDifficulty);
    }

    btnStart.addEventListener('click', start, once = true)

};

const setDifficulty = event => {
    const elmDifficulty = document.querySelectorAll('.difficulty');
    if(event.target.innerText == 'Normal'){
        difficulty = 150;
        for(let elm of elmDifficulty){
            elm.innerText = 'Normal';
        }
    } else if (event.target.innerText == 'Hardcore'){
        difficulty = 50;
        for(let elm of elmDifficulty){
            elm.innerText = 'Hardcore';
        }
    }
}

const start = () => {
    startContainer.classList.add('hide');
    endContainer.classList.add('hide');
    gameContainer.classList.remove('hide');
    
    showScore();
    initSnake();
    spawnApple();

    gameLoop = setInterval(updateGame, difficulty);
    document.addEventListener('keyup', detectDirection);
};

const updateGame = () => {
    initMoveSnake(direction);
};

const initSnake = () => {
    snakeHead = document.createElement('div');
    snakeHead.id = 'snake-head';
    map.appendChild(snakeHead);
    snakeHead.style.top = 0 + 'px';
    snakeHead.style.left = 20 + 'px';
    
    addBlock(0,0);
};

const spawnApple = () => {
    let apple = document.createElement('div');

    apple.id = 'apple';
    apple.style.top = randomPos() + 'px';
    apple.style.left = randomPos() + 'px';

    map.appendChild(apple);
};

const addBlock = (x, y) => {
    const block = document.createElement('div');
    block.classList.add('snakeTail');
    block.style.top = y + 'px';
    block.style.left = x + 'px';
    map.appendChild(block);
};

const detectDirection = event => {
    switch (event.key) {
        case 'ArrowUp':
            direction = 'up';
            break;
        case 'ArrowLeft':
            direction = 'left';
            break;
        case 'ArrowDown':
            direction = 'down';
            break;
        case 'ArrowRight':
            direction = 'right';
            break;
    }
};

const initMoveSnake = (direction) => {
    switch (direction) {
        case 'up':
            moveSnake(0, -blockSize);
            break;
        case 'left':
            moveSnake(-blockSize, 0);
            break;
        case 'down':
            moveSnake(0, blockSize);
            break;
        case 'right':
            moveSnake(blockSize, 0);
            break;
    }
};

const moveSnake = (x, y) => {
    const saveHeadPos = {
        x : parseInt(snakeHead.style.left),
        y : parseInt(snakeHead.style.top),
    };

    moveHead(saveHeadPos.x, saveHeadPos.y, x, y);
    
    if(snakeTailBlock.length > 0){
        moveTail(saveHeadPos.x, saveHeadPos.y);
    }
};

const moveHead = (saveX, saveY, x, y) => {
    const newHeadPos = {
        x : saveX + x,
        y : saveY + y,
    };

    snakeHead.style.top = newHeadPos.y + 'px';
    snakeHead.style.left = newHeadPos.x + 'px';

    checkCollision();
};

const moveTail = (saveX, saveY) => {

    for(let i = snakeTailBlock.length -1; i > 0; i--)
    {
        snakeTailBlock[i].style.top = snakeTailBlock[i -1].style.top;
        snakeTailBlock[i].style.left = snakeTailBlock[i -1].style.left;
    }
    snakeTailBlock[0].style.top = saveY + 'px';
    snakeTailBlock[0].style.left = saveX + 'px';
};

const checkCollision = () => {
    const snakePos = {
        y : parseInt(snakeHead.style.top),
        x : parseInt(snakeHead.style.left),
    }

    checkCollisionWithWall(snakePos.x, snakePos.y);
    
    if(snakeTailBlock.length > 0){
        checkCollisionWithTail();
    }

    checkCollisionWithApple(snakePos.x, snakePos.y);
};

const checkCollisionWithWall = (x, y) => {
    if(x < 0 || x > 580 || y < 0 || y > 580)
    {
        gameOver();
    } else {
        return;
    }
};

const checkCollisionWithTail = () => {
    for(let i = 0; i < snakeTailBlock.length ; i++)
    {
        if(snakeTailBlock[i].style.top === snakeHead.style.top && snakeTailBlock[i].style.left === snakeHead.style.left){
            gameOver();
        }
    }
};

const checkCollisionWithApple = (x, y) => {
    let apple = document.getElementById('apple');

    const applePosX = parseInt(apple.style.left);
    const applePosY = parseInt(apple.style.top);

    if(applePosX === x && applePosY === y){
        snakeEat();
    } else {
        return;
    }

};

const snakeEat = () => {
    addBlock(0,0);

    let apple = document.getElementById('apple');
    apple.style.top = randomPos() + 'px';
    apple.style.left = randomPos() + 'px';
    
    score++;
    showScore();
};

const showScore = () => {
    const scorecontainer = document.querySelector('#game-container .score');
    scorecontainer.innerText = score;
};

const gameOver = () => {
    gameContainer.classList.add('hide');
    endContainer.classList.remove('hide');
    const scorecontainer = document.querySelector('#end-container .score');
    scorecontainer.innerText = score;

    clearInterval(gameLoop);
    resetGame();
    btnReStart.addEventListener('click', start)
};

const resetGame = () => {
    direction = 'right'; 
    map.innerHTML = '';
    score = 0;
};

const randomPos = () => {
    let max = (580/20) + 1;
    return 20 * (Math.floor(Math.random()*max));
};

init();