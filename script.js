const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
let highScore = 0;
parseInt(localStorage.getItem("highScore"));
const startBtn = document.getElementById("startBtn");
const highestScore = document.getElementById("highestScore");
const foodSound = new Audio('food.mp3');
const gameOver = new Audio('gameover.mp3');
const move = new Audio('move.mp3')
const music = new Audio('music.mp3')
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#333";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";
const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;

let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
];

window.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", function() {
    if(startBtn.textContent == "Start")
    gameStart();
    else if(startBtn.textContent == "Reset"){
        startBtn.addEventListener("click", resetGame());
    }
});

function gameStart(){
    running = true;
    music.play
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
    document.getElementById("box").style.display = 'none';
};

function nextTick(){
    if(running){
        setTimeout(()=>{
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
    else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
    foodSound.play();
};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    
    snake.unshift(head);
    if(snake[0].x == foodX && snake[0].y == foodY){
        snake.push();
        score+=1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }     
};

function drawSnake(){
    ctx.fillStyle = "#f5ff00";
    ctx.fillRect(snake[0].x, snake[0].y, unitSize, unitSize);
    ctx.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize);

    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    for(let i = 1; i<snake.length; i++){
        ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize);
        ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize);

    }
};

function changeDirection(e){
    const keyPressed = e.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            move.play();
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            move.play();
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            move.play();
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            move.play();
            break;
    }
};

function checkGameOver(){
    switch(true){
        case (snake[0].x < 0):
            running = false;
            break;
        case (snake[0].x >= gameWidth):
            running = false;
            break;
        case (snake[0].y < 0):
            running = false;
            break;
        case (snake[0].y >= gameHeight):
                running = false;
                break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }

    if(score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore);
        highestScore.textContent = highScore; 
    }
};

function displayGameOver(){
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!!", gameWidth / 2, gameHeight / 2);
    gameOver.play();
    music.pause();
    running = false;
    startBtn.textContent = "Reset";
};

const muxsicBtn = document.getElementById("musicBtn");
const musicIcon = document.getElementById("musicIcon");
let musixcPlaying = 0;

muxsicBtn.addEventListener("click", function() {
    if(musixcPlaying == 0){
        music.pause();
        musixcPlaying++;
        musicIcon.classList.remove("fa-volume-up");
        musicIcon.classList.add("fa-volume-mute");
    }
    else if(musixcPlaying != 0){
        music.play();
        musixcPlaying = 0;
        musicIcon.classList.remove("fa-volume-mute");
        musicIcon.classList.add("fa-volume-up");
    }
});

window.onload = async function() {
    highScore = parseInt(localStorage.getItem("highScore")) || 0;
    highestScore.textContent = highScore; 
    try {
        await loadAudio('music.mp3');
    } catch (error) {
        console.error('Error loading audio:', error);
    }
    music.play();
};

function resetGame(){
    if(musixcPlaying == 0){
        music.play();
    }
    score = 0;
    scoreText.textContent = score;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ];
    gameStart();
};