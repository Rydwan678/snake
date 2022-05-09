// enter game screen z guzikiem play na srodku

// statystyki (score, level, czas)

// levele
// - 1-10 Levelow
// - co level zmiana speeda
// - co level dodanie sie cegly
// - celem kazdego Levelu jest 10 jablek
// game over i play again / win i play again
// 10 level 80 speeda
// wymaz bricki ktorych nie powinno byc
// kiedy jest win nie dodaja sie bricki

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

const gameScreen = document.querySelector("#main-screen");
const gameInfo = document.querySelector("#game-info");
const startScreen = document.querySelector("#start-screen");
const startButton = document.querySelector("#start-button");
const popup = document.querySelector("#popup");
const popupText = document.querySelector("#popup-text");
const popupButton = document.querySelector("#popup-button");
const popupButtonText = document.querySelector("#button-text");

const countDownNumber = document.querySelector("#number");
const scoreCounter = document.querySelector("#score");
const levelCounter = document.querySelector("#level");

const eatSound = new Audio("eatsound.mp3");
const loseSound = new Audio("losesound.mp3");

const appleIcon = new Image();
appleIcon.src = "apple.png";
const snakeTxt = new Image();
snakeTxt.src = "snakegraphics.png";
const brickIcon = new Image();
brickIcon.src = "brick.png";

// [positionX, positionY,
// diffToPreviousElementX, diffToPreviousElementY,
// diffToNextElementX, diffToNextElementY]
const IMAGES = {
  headTop: [192, 0, 0, 64, null, null],
  headDown: [256, 64, 0, -64, null, null],
  headRight: [256, 0, -64, 0, null, null],
  headLeft: [192, 64, 64, 0, null, null],
  tailTop: [192, 128, null, null, 0, -64],
  tailDown: [256, 192, null, null, 0, 64],
  tailRight: [256, 128, null, null, 64, 0],
  tailLeft: [192, 192, null, null, -64, 0],
  torsoHorizontal: [64, 0, -64, 0, 64, 0],
  torsoVertical: [128, 64, 0, -64, 0, 64],
  cornerTop: [0, 64, 64, 0, 0, -64],
  cornerDown: [128, 0, -64, 0, 0, 64],
  cornerLeft: [128, 128, 0, -64, -64, 0],
  cornerRight: [0, 0, 0, 64, 64, 0],
};

let direction = "right";
let snake = [
  [192, 0],
  [128, 0],
  [64, 0],
  [0, 0],
];
// gameStatus - win, lose, nextLevel
let gameStatus;
let autoMove;
let snakeSpeed = 250;
let apple = [];
let score = 0;

let currentLevel = 1;
let bricks = [];

canvas.width = "1024";
canvas.height = "1024";

levelCounter.textContent = currentLevel;
scoreCounter.textContent = score;

const changeWay = (e) => {
  if (e.key == "w") {
    if (direction !== "down") {
      direction = "up";
    }
  } else if (e.key == "s") {
    if (direction !== "up") {
      direction = "down";
    }
  } else if (e.key == "a") {
    if (direction !== "right") {
      direction = "left";
    }
  } else if (e.key == "d") {
    if (direction !== "left") {
      direction = "right";
    }
  }
};

const checkGameLevel = () => {
  if (score == 10 && currentLevel == 10) {
    showPopup("win");
  } else if (score == 10) {
    currentLevel += 1;
    snakeSpeed -= 12;
    showPopup("nextLevel");
    return true;
  }
};

const moveSnake = () => {
  // delete last part of snake and add new with updated position
  let previousElementX = snake[0][0];
  let previousElementY = snake[0][1];
  if (direction == "right") {
    snake.pop();
    snake.unshift([previousElementX, previousElementY]);
    snake[0][0] += 64;
  } else if (direction == "left") {
    snake.pop();
    snake.unshift([previousElementX, previousElementY]);
    snake[0][0] -= 64;
  } else if (direction == "up") {
    snake.pop();
    snake.unshift([previousElementX, previousElementY]);
    snake[0][1] -= 64;
  } else if (direction == "down") {
    snake.pop();
    snake.unshift([previousElementX, previousElementY]);
    snake[0][1] += 64;
  }
  if (checkGameLevel() == true) {
    console.log("nowylevel");
    levelCounter.textContent = `Level: ${currentLevel}`;
    scoreCounter.textContent = `Points: ${score}`;
  } else if (checkCollision() == true) {
    console.log("collision true");
    showPopup("lose");
  } else {
    chooseSnakeElement();
    drawBricks();
  }
  checkScore();
};

const checkScore = () => {
  if (snake[0][0] == apple[0] && snake[0][1] == apple[1]) {
    score += 1;
    scoreCounter.textContent = `Points: ${score}`;
    eatSound.play();
    if (score == 10) {
      setBricks();
      setApple();
    } else {
      setApple();
    }

    let lastElementX = snake[snake.length - 1][0];
    let lastElementY = snake[snake.length - 1][1];
    snake.push([lastElementX, lastElementY]);
  }
};

const checkCollision = () => {
  let snakeHeadPositionX = snake[0][0];
  let snakeHeadPositionY = snake[0][1];
  // check if snake collided with brick
  for (let i = 0; i < bricks.length; i++) {
    let brickPositionX = bricks[i][0];
    let brickPositionY = bricks[i][1];

    if (
      snakeHeadPositionX == brickPositionX &&
      snakeHeadPositionY == brickPositionY
    ) {
      return true;
    }
  }
  // check if snake collided with himself
  for (let i = 1; i < snake.length; i++) {
    let snakePartPositionX = snake[i][0];
    let snakePartPositionY = snake[i][1];
    if (
      snakePartPositionX == snakeHeadPositionX &&
      snakePartPositionY == snakeHeadPositionY
    ) {
      return true;
    }
  }
  // check if snake collided with game field border
  if (
    snakeHeadPositionX < 0 ||
    snakeHeadPositionX > 960 ||
    snakeHeadPositionY < 0 ||
    snakeHeadPositionY > 960
  ) {
    return true;
  }
};

const showPopup = (status) => {
  if (status == "lose") {
    clearInterval(autoMove);
    popup.classList.remove("hide");
    popupText.textContent = "YOU LOST";
    popupText.classList.remove("win");
    popupText.classList.remove("next-level");
    popupText.classList.add("lose");
  } else if (status == "win") {
    clearInterval(autoMove);
    popup.classList.remove("hide");
    popupText.textContent = "YOU WON";
    popupText.classList.remove("lose");
    popupText.classList.remove("next-level");
    popupText.classList.add("win");
  } else if (status == "nextLevel") {
    clearInterval(autoMove);
    popup.classList.remove("hide");
    popupText.textContent = "LEVEL COMPLETED";
    popupText.classList.remove("win");
    popupText.classList.remove("lose");
    popupText.classList.add("next-level");
    popupButtonText.textContent = "NEXT";
  }
};

const getRandomPosition = () => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 960);
  } while (randomNumber % 64 !== 0);
  return randomNumber;
};

const setApple = () => {
  let positionX = getRandomPosition();
  let positionY = getRandomPosition();

  apple = [positionX, positionY];
  // if apple has been spawned in player, create new position
  for (let i = 0; i < snake.length; i++) {
    if (snake[i][0] == apple[0] && snake[i][1] == apple[1]) {
      setApple();
    }
  }
  for (let i = 0; i < bricks.length; i++) {
    if (bricks[i][0] == apple[0] && bricks[i][1] == apple[1]) {
      setApple();
    }
  }
};

const setBricks = () => {
  for (let i = 0; i < 5; i++) {
    let positionX = getRandomPosition();
    let positionY = getRandomPosition();
    bricks.push([positionX, positionY]);
    // remove brick when it has been spawned too close to snake start
    let lastBrick = bricks[bricks.length - 1];
    if (lastBrick[0] < 512 && lastBrick[1] == 0) {
      bricks.pop();
    }
  }
};

const drawBricks = () => {
  for (let i = 0; i < bricks.length; i++) {
    let brickPositionX = bricks[i][0];
    let brickPositionY = bricks[i][1];
    ctx.drawImage(
      brickIcon,
      0,
      0,
      64,
      64,
      brickPositionX,
      brickPositionY,
      64,
      64
    );
  }
};

const drawSnakeElements = (element, position) => {
  let choosedElement = IMAGES[element];
  let elementPosition = position;
  ctx.drawImage(
    snakeTxt,
    choosedElement[0],
    choosedElement[1],
    64,
    64,
    elementPosition[0],
    elementPosition[1],
    64,
    64
  );
};

// get snake element
// get his parents
// check which situation match its differences
const chooseSnakeElement = () => {
  ctx.clearRect(0, 0, 1024, 1024);
  ctx.drawImage(appleIcon, 0, 0, 64, 64, apple[0], apple[1], 64, 64);
  for (let i = 0; i < snake.length; i++) {
    let currentElement = snake[i];
    let nextElement = snake[i - 1];
    let previousElement = snake[i + 1];
    // head
    if (nextElement == undefined) {
      for (image in IMAGES) {
        if (
          previousElement[0] - currentElement[0] == IMAGES[image][2] &&
          previousElement[1] - currentElement[1] == IMAGES[image][3]
        ) {
          drawSnakeElements(image, snake[i]);
          break;
        }
      }
    }
    // tail
    else if (previousElement == undefined) {
      for (image in IMAGES) {
        if (
          nextElement[0] - currentElement[0] == IMAGES[image][4] &&
          nextElement[1] - currentElement[1] == IMAGES[image][5]
        ) {
          drawSnakeElements(image, snake[i]);
          break;
        }
      }
    }
    // something else
    else if (nextElement && previousElement) {
      for (image in IMAGES) {
        if (
          (previousElement[0] - currentElement[0] == IMAGES[image][2] &&
            previousElement[1] - currentElement[1] == IMAGES[image][3] &&
            nextElement[0] - currentElement[0] == IMAGES[image][4] &&
            nextElement[1] - currentElement[1] == IMAGES[image][5]) ||
          (previousElement[0] - currentElement[0] == IMAGES[image][4] &&
            previousElement[1] - currentElement[1] == IMAGES[image][5] &&
            nextElement[0] - currentElement[0] == IMAGES[image][2] &&
            nextElement[1] - currentElement[1] == IMAGES[image][3])
        ) {
          drawSnakeElements(image, snake[i]);
          break;
        }
      }
    }
  }
};

const setAutoMove = () => {
  autoMove = setInterval(moveSnake, snakeSpeed);
};

const startGame = () => {
  popup.classList.add("hide");

  snake = [
    [192, 0],
    [128, 0],
    [64, 0],
    [0, 0],
  ];
  direction = "right";
  score = 0;
  counter = 0;
  setApple();
  chooseSnakeElement();
  drawBricks();
  console.log(bricks);
  if (gameStatus == "win" && gameStatus == "lose") {
    bricks = [];
    snakeSpeed = 250;
    currentLevel = 1;
  }

  startScreen.classList.add("hide");
  gameScreen.classList.remove("hide");
  gameScreen.classList.add("blur");

  setTimeout(setAutoMove, 4000);
  setTimeout(() => {
    countDownNumber.textContent = "READY";
    setTimeout(() => {
      countDownNumber.textContent = "STEADY";
      setTimeout(() => {
        countDownNumber.textContent = "GO!";
        setTimeout(() => {
          countDownNumber.textContent = "";
          gameInfo.classList.remove("hide");
          gameScreen.classList.remove("blur");
          gameScreen.classList.remove("hide");
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
};

popupButton.addEventListener("click", startGame);
startButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeWay);
window.addEventListener("load", chooseSnakeElement);
