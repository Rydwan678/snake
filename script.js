// enter game screen z guzikiem play na srodku

// statystyki (score, level, czas)

// levele
// - 1-10 Levelow
// - co level zmiana speeda
// - co level dodanie sie cegly
// - celem kazdego Levelu jest 10 jablek
// game over i play again / win i play again
// 10 level 80 speeda

const canvas = document.querySelector("#canvas");
const ctx = canvas.getContext("2d");

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

let snakeSpeed = 250;
let apple = [];
let score = 0;
let lose = false;
let counter = 0;

let currentLevel = 1;
let bricks = [];

canvas.width = "1024";
canvas.height = "1024";

levelCounter.textContent = `Level: ${currentLevel}`;
scoreCounter.textContent = `Points: ${score}`;

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
  if (score == 10) {
    score = 0;
    snake = [
      [192, 0],
      [128, 0],
      [64, 0],
      [0, 0],
    ];
    direction = "right";
    currentLevel += 1;
    snakeSpeed -= 100;
    clearInterval(play);
    setInterval(moveSnake, snakeSpeed);
    chooseSnakeElement();
    setBricks();
    // drawBricks()
    return true;
  } else {
    return false;
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
  if (checkCollision() == true) {
    console.log("collision true");
    gameLose();
  } else if (checkGameLevel() == true) {
    console.log("nowylevel");
    levelCounter.textContent = `Level: ${currentLevel}`;
    scoreCounter.textContent = `Points: ${score}`;
  } else {
    chooseSnakeElement();
    drawBricks();
    console.log(snake);
  }
  checkScore();
};

const play = setInterval(moveSnake, snakeSpeed);

const checkScore = () => {
  if (snake[0][0] == apple[0] && snake[0][1] == apple[1]) {
    score += 5;
    scoreCounter.textContent = `Points: ${score}`;
    eatSound.play();
    setApple();
    let lastElementX = snake[snake.length - 1][0];
    let lastElementY = snake[snake.length - 1][1];
    snake.push([lastElementX, lastElementY]);
  }
};

const checkCollision = () => {
  // counter is for disabling collison with bricks for first 3 moves in new round to avoid losing instantly
  counter += 1;
  let snakeHeadPositionX = snake[0][0];
  let snakeHeadPositionY = snake[0][1];
  // check if snake collided with brick
  if (counter > 3) {
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

const gameLose = () => {
  clearInterval(play);
  console.log("przegrales");
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

const winPopup = () => {};

document.addEventListener("keydown", changeWay);
window.addEventListener("load", setApple);
window.addEventListener("load", chooseSnakeElement);
