const canvas = document.getElementById("gameBoard")
const ctx = canvas.getContext("2d")
const scoreText = document.getElementById("scoreText")
const resetBtn = document.getElementById("resetBtn")
const unitSize = 25
const snakeColor = "lightgreen"
const foodColor = "red"
let xVelocity = unitSize
let yVelocity = 0
const gameWidth = 500
const gameHeight = 500
const boardBackground = "white"
const gameSpeedInMs = 50

// buttons:--------------------------------------------------------
const movementBtns = document.querySelectorAll(".movementBtns")
let arrowRight = new KeyboardEvent('keydown');
Object.defineProperty(arrowRight, 'keyCode', {
    get: () => 39
});
let arrowLeft = new KeyboardEvent('keydown');
Object.defineProperty(arrowLeft, 'keyCode', {
    get: () => 37
});
let arrowUp = new KeyboardEvent('keydown');
Object.defineProperty(arrowUp, 'keyCode', {
    get: () => 38
});
let arrowDown = new KeyboardEvent('keydown');
Object.defineProperty(arrowDown, 'keyCode', {
    get: () => 40
});
//------------------------------------------------------------------

let score = 0
let foodX;
let foodY;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
]
let gameRunning = false


window.addEventListener("keydown", changeDirection)
resetBtn.addEventListener("click", resetGame)

movementBtns.forEach(button => {
    switch (button.getAttribute("id")) {
        case "btnUp":
            button.addEventListener("click", () => {
                changeDirection(arrowUp)
            })
            break
        case "btnDown":
            button.addEventListener("click", () => {
                changeDirection(arrowDown)
            })
            break
        case "btnLeft":
            button.addEventListener("click", () => {
                changeDirection(arrowLeft)
            })
            break
        case "btnRight":
            button.addEventListener("click", () => {
                changeDirection(arrowRight)
            })
            break
    }
})


changeDirection(arrowRight)

startGame()


function startGame() {
    gameRunning = true
    scoreText.textContent = score
    createFood()
    drawFood()
    nextTick()
}
function nextTick() {
    if (gameRunning) {
        setTimeout(() => {
            clearBoard()
            drawFood()
            moveSnake()
            drawSnake()
            checkGameOver()
            nextTick()
        }, gameSpeedInMs)
    }
    else {
        displayGameOver()
    }
}
function clearBoard() {
    ctx.fillStyle = boardBackground
    ctx.fillRect(0, 0, gameWidth, gameHeight)
}
function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
        return randNum
    }
    foodX = randomFood(0, gameWidth - unitSize)
    foodY = randomFood(0, gameWidth - unitSize)
}
function drawFood() {
    ctx.fillStyle = foodColor
    ctx.fillRect(foodX, foodY, unitSize, unitSize)
}
function changeDirection(event) {
    const keyPressed = event.keyCode
    const LEFT = 37
    const UP = 38
    const RIGHT = 39
    const DOWN = 40
    console.log(keyPressed);
    const goingUp = (yVelocity == -unitSize)
    const goingDown = (yVelocity == unitSize)
    const goingRight = (xVelocity == unitSize)
    const goingLeft = (xVelocity == -unitSize)
    switch (true) {
        case (keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize
            yVelocity = 0
            break
        case (keyPressed == UP && !goingDown):
            yVelocity = -unitSize
            xVelocity = 0
            break
        case (keyPressed == DOWN && !goingUp):
            yVelocity = unitSize
            xVelocity = 0
            break
        case (keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize
            yVelocity = 0
            break
    }
}
function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = snakeColor
        ctx.fillRect(snake[i].x, snake[i].y, unitSize, unitSize)
        ctx.strokeStyle = "black"
        ctx.strokeRect(snake[i].x, snake[i].y, unitSize, unitSize)
    }
}
function moveSnake() {
    const head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity }
    snake.unshift(head)
    // if food eaten
    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 1
        scoreText.textContent = score
        createFood()
    }
    else {
        snake.pop()
    }
}
function checkGameOver() {
    switch (true) {
        case (snake[0].x < 0):
            gameRunning = false
            break
        case (snake[0].x >= gameWidth):
            gameRunning = false
            break
        case (snake[0].y < 0):
            gameRunning = false
            break
        case (snake[0].y >= gameHeight):
            gameRunning = false
            break
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            gameRunning = false
        }
    }
}
function displayGameOver() {
    ctx.font = "50px MV Boli"
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2)
    gameRunning = false
}
function resetGame() {
    score = 0
    xVelocity = unitSize
    yVelocity = 0
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ]
    startGame()
}
