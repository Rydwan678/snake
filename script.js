// enter game screen z guzikiem play na srodku

// statystyki (score, level, czas)

// levele
// - 1-10 poziomow
// - co level zmiana speeda
// - co level dodanie sie cegly
// - celem kazdego poziomu jest 10 jablek
// game over i play again / win i play again

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

let snakeSpeed = 316;
let apple = [];
let score = 9;
let lose = false;

let currentLevel = 1;
let bricks = [];

canvas.width = "1024";
canvas.height = "1024";

levelCounter.textContent = `Poziom: ${currentLevel}`;
scoreCounter.textContent = `Punkty: ${score}`;

const changeWay = (e) => {
  if (e.key == "w") {
    direction = "up";
  } else if (e.key == "s") {
    direction = "down";
  } else if (e.key == "a") {
    direction = "left";
  } else if (e.key == "d") {
    direction = "right";
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
    currentLevel += 1;
    snakeSpeed -= 24;
    chooseSnakeElement();
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
    gameLose();
  } else if (checkGameLevel() == true) {
    console.log("nowylevel");
    levelCounter.textContent = `Poziom: ${currentLevel}`;
    scoreCounter.textContent = `Punkty: ${score}`;
  } else {
    chooseSnakeElement();
  }
  checkScore();
  console.log(speedSnake);
};

const play = setInterval(moveSnake, snakeSpeed);

const checkScore = () => {
  if (snake[0][0] == apple[0] && snake[0][1] == apple[1]) {
    score += 1;
    scoreCounter.textContent = `Punkty: ${score}`;
    eatSound.play();
    setApple();
    let lastElementX = snake[snake.length - 1][0];
    let lastElementY = snake[snake.length - 1][1];
    snake.push([lastElementX, lastElementY]);
  }
};

const checkCollision = () => {
  // check if snake collided with himself
  for (let i = 1; i < snake.length; i++) {
    if (snake[0][0] == snake[i][0] && snake[0][1] == snake[i][1]) {
      return true;
    }
    // check if snake collided with game field border
    else if (
      snake[0][0] < 0 ||
      snake[0][0] > 960 ||
      snake[0][1] < 0 ||
      snake[0][1] > 960
    ) {
      return true;
    }
  }
};

const gameLose = () => {
  clearInterval(play);
  ctx.clearRect(0, 0, 512, 512);
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
};

const setBrick = () => {
  if (currentLevel > 0) {
    for (let i = 0; i < currentLevel + 5; i++) {
      let positionX = getRandomPosition();
      let positionY = getRandomPosition();
      bricks.push([positionX, positionY]);
    }
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

document.addEventListener("keydown", changeWay);
window.addEventListener("load", setApple);
window.addEventListener("load", chooseSnakeElement);
