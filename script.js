const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const startSection = document.getElementById('start-section');

// Load sound effects
const pointSound = new Audio('assets/point.mp3');
const gameOverSound = new Audio('assets/gameover.mp3');

let snake, food, direction, score, gameInterval;

function initGame() {
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 }
    ];
    direction = 'RIGHT';
    score = 0;
    food = generateFood();
    scoreElement.textContent = score;
    
    startSection.style.display = 'none';
    canvas.style.display = 'block';
    gameOverElement.style.display = 'none';
    restartBtn.style.display = 'none';
    finalScoreElement.style.display = 'none';
    backBtn.style.display = 'block';

    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 100);
}

function generateFood() {
    return { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
}

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowUp' || e.key === 'w') && direction !== 'DOWN') direction = 'UP';
    if ((e.key === 'ArrowDown' || e.key === 's') && direction !== 'UP') direction = 'DOWN';
    if ((e.key === 'ArrowLeft' || e.key === 'a') && direction !== 'RIGHT') direction = 'LEFT';
    if ((e.key === 'ArrowRight' || e.key === 'd') && direction !== 'LEFT') direction = 'RIGHT';
});

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 10, 10));
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 10, 10);
}

function updateSnake() {
    const head = { ...snake[0] };
    if (direction === 'UP') head.y -= 10;
    if (direction === 'DOWN') head.y += 10;
    if (direction === 'LEFT') head.x -= 10;
    if (direction === 'RIGHT') head.x += 10;
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = score;
        food = generateFood();
        pointSound.play(); 
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision()) {
        gameOver();
    }
}

function checkCollision() {
    return snake.slice(1).some(segment => segment.x === snake[0].x && segment.y === snake[0].y);
}

function gameOver() {
    clearInterval(gameInterval);
    gameOverSound.play(); // Play game over sound
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = `Your Score: ${score}`;
    finalScoreElement.style.display = 'block';
    restartBtn.style.display = 'block';
}

function goToStartScreen() {
    clearInterval(gameInterval);
    startSection.style.display = 'flex'; // Show Start Screen as flex (centering works)
    canvas.style.display = 'none'; // Hide Game
    gameOverElement.style.display = 'none';
    restartBtn.style.display = 'none';
    finalScoreElement.style.display = 'none';
    backBtn.style.display = 'none'; // Hide Back Button
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    updateSnake();
}

restartBtn.addEventListener('click', initGame);
startBtn.addEventListener('click', initGame);
backBtn.addEventListener('click', goToStartScreen);
