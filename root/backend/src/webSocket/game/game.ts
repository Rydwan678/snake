import { Store } from "../../interfaces";
import * as parse from "./protocols/parse";
import * as send from "../app/protocols/send";

interface GameDataTypes {
  snakePosition: number[][];
  direction: string;
  speed: number;
  applePosition: number[];
  bricksPosition: number[][];
  score: number;
  level: number;
  isRunning: boolean;
  winner: undefined | number;
  popup: {
    isShown: boolean;
    type: string;
  };
  isCounting: boolean;
}

export const processGames = (store: Store) => {
  if (store.games.length > 0) {
    store.games.forEach((game) => {
      game.isRunning && moveSnake(store, game.id);
      send.game(store, game.id);
    });
  }
};

const moveSnake = (store: Store, gameID: string) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  // delete last part of snake and add new with updated position
  if (store.games[game]) {
    store.games[game].users.forEach((user, index) => {
      const currentUser = store.games[game].users[index];
      const snakePosition = currentUser.position;
      const direction = currentUser.direction;

      let previousElementX = snakePosition[0][0];
      let previousElementY = snakePosition[0][1];

      let lastSnakeElement = snakePosition[snakePosition.length - 1];
      let updatedSnakePosition = [...snakePosition];

      if (direction === "right") {
        updatedSnakePosition.pop();
        updatedSnakePosition.unshift([previousElementX, previousElementY]);
        updatedSnakePosition[0][0] += 64;
      } else if (direction === "left") {
        updatedSnakePosition.pop();
        updatedSnakePosition.unshift([previousElementX, previousElementY]);
        updatedSnakePosition[0][0] -= 64;
      } else if (direction === "up") {
        updatedSnakePosition.pop();
        updatedSnakePosition.unshift([previousElementX, previousElementY]);
        updatedSnakePosition[0][1] -= 64;
      } else if (direction === "down") {
        updatedSnakePosition.pop();
        updatedSnakePosition.unshift([previousElementX, previousElementY]);
        updatedSnakePosition[0][1] += 64;
      }

      if (checkCollision(store, gameID, updatedSnakePosition) === false) {
        store.games[game].users[index].position = updatedSnakePosition;
      } else if (checkCollision(store, gameID, updatedSnakePosition) === true) {
        const gameWinner = store.games[game].users.find(
          (user) => user.id !== currentUser.id
        );
        const gameLoser = currentUser;

        store.games[game].isRunning = false;
        gameWinner && (store.games[game].winner = gameWinner.id);
        store.games[game].loser = gameLoser.id;
      }
      checkScore(store, lastSnakeElement, gameID);
      user.id === "env" &&
        parse.changeDirection(store, user.id, store.games[game].id, "right");
    });
  }
};

const checkScore = (
  store: Store,
  lastSnakeElement: [number, number],
  gameID: string
) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  if (store.games[game]) {
    store.games[game].users.forEach((user, index) => {
      const snakePosition = store.games[game].users[index].position;
      const applePosition = store.games[game].applePosition;
      const score = store.games[game].users[index].score;

      if (applePosition) {
        if (
          snakePosition[0][0] === applePosition[0] &&
          snakePosition[0][1] === applePosition[1]
        ) {
          // const eatSound = new Audio("sounds/eatsound.mp3");
          // settings.audio && eatSound.play();
          store.games[game].users[index].score = score + 1;
          store.games[game].users[index].position.push(lastSnakeElement);

          setApple(store, gameID);

          if (store.games[game].mode === "bricks" && score + 1 === 10) {
            if (store.games[game].level < 9) {
              store.games[game].isRunning = false;
            } else if (store.games[game].level === 9) {
              store.games[game].level = 10;
              store.games[game].users[index].score = 0;
              store.games[game].isRunning = false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
    });
  }
};

const checkCollision = (
  store: Store,
  gameID: string,
  data: [number, number][]
) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  if (store.games[game]) {
    const snakePosition = data;
    const bricksPosition = store.games[game].bricksPosition;
    let snakeHeadPositionX = snakePosition[0][0];
    let snakeHeadPositionY = snakePosition[0][1];
    // check if snake collided with brick
    for (let i = 0; i < bricksPosition.length; i++) {
      let brickPositionX = bricksPosition[i][0];
      let brickPositionY = bricksPosition[i][1];

      if (
        snakeHeadPositionX === brickPositionX &&
        snakeHeadPositionY === brickPositionY
      ) {
        // setBestScore();
        console.log("collided with brick");
        return true;
      }
    }
    // check if snake collided with himself
    for (let i = 1; i < snakePosition.length; i++) {
      let snakePartPositionX = snakePosition[i][0];
      let snakePartPositionY = snakePosition[i][1];
      if (
        snakePartPositionX === snakeHeadPositionX &&
        snakePartPositionY === snakeHeadPositionY
      ) {
        // setBestScore();
        console.log("collided with himself");
        return true;
      }
    }
    // check if snake collided with another player
    for (let i = 0; i < store.games[game].users.length; i++) {
      const currentUser = store.games[game].users[i];
      const enemy = store.games[game].users.find(
        (user) => user.id !== currentUser.id
      );

      store.games[game].users[i].position.forEach((coordinates) => {
        if (
          coordinates[0] === snakeHeadPositionX &&
          coordinates[1] === snakeHeadPositionY
        ) {
          store.games[game].isRunning = false;
          store.games[game].loser = currentUser.id;
          store.games[game].winner = enemy?.id;
        }
      });
    }
    // check if snake collided with game border
    if (
      snakeHeadPositionX < 0 ||
      snakeHeadPositionX > 960 ||
      snakeHeadPositionY < 0 ||
      snakeHeadPositionY > 960
    ) {
      // setBestScore();
      console.log("collided with game border");
      return true;
    } else {
      return false;
    }
  }
};

const getRandomPosition = () => {
  let randomNumber;
  do {
    randomNumber = Math.floor(Math.random() * 960);
  } while (randomNumber % 64 !== 0);
  return randomNumber;
};

export const setApple = (store: Store, gameID: string) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  if (store.games[game]) {
    let positionX = getRandomPosition();
    let positionY = getRandomPosition();

    const apple: [number, number] = [positionX, positionY];
    const bricksPosition = store.games[game].bricksPosition;

    // if apple has been spawned in player, create new position
    store.games[game].users.forEach((user, index) => {
      const snakePosition = store.games[game].users[index].position;

      snakePosition.forEach((position, index) => {
        if (
          snakePosition[index][0] === apple[0] &&
          snakePosition[index][1] === apple[1]
        ) {
          setApple(store, gameID);
          return;
        }
      });
    });
    // if apple has been spawned in brick, create new position

    bricksPosition.forEach((position, index) => {
      if (
        bricksPosition[index][0] === apple[0] &&
        bricksPosition[index][1] === apple[1]
      ) {
        setApple(store, gameID);
        return;
      }
    });
    // if apple has been spawned in blind alley, create new position
    const appleAdjacentFields = [
      [apple[0], apple[1] - 64],
      [apple[0], apple[1] + 64],
      [apple[0] - 64, apple[1]],
      [apple[0] + 64, apple[1]],
    ];
    let counter = 0;
    for (let i = 0; i < bricksPosition.length; i++) {
      for (let x = 0; x < appleAdjacentFields.length; x++) {
        if (
          bricksPosition[i][0] === appleAdjacentFields[x][0] &&
          bricksPosition[i][1] === appleAdjacentFields[x][1]
        ) {
          counter += 1;
        }
      }
      if (counter === 3) {
        setApple(store, gameID);
        return;
      }
    }
    store.games[game].applePosition = apple;
  }
};

export const setBricks = (store: Store, gameID: string) => {
  const game = store.games.findIndex((game) => game.id === gameID);
  const bricksPerLevel = 5;

  if (store.games[game]) {
    const bricksPosition = store.games[game].bricksPosition;
    for (let i = 0; i < bricksPerLevel; i++) {
      let positionX = getRandomPosition();
      let positionY = getRandomPosition();
      bricksPosition.push([positionX, positionY]);
      // remove brick when it has been spawned too close to snake start
      let lastBrick = bricksPosition[bricksPosition.length - 1];
      if (lastBrick[0] < 512 && lastBrick[1] === 0) {
        bricksPosition.pop();
      }
    }
    send.game(store, gameID);
  }
};

// const setBestScore = () => {
//   const storedBestScore = parseInt(`${localStorage.getItem("bestscore")}`);
//   const score = gameDataRef.current.score;

//   if (settings.gamemode === "classicSnake") {
//     if (score > storedBestScore) {
//       console.log("tak");
//       localStorage.setItem("bestscore", `${score}`);
//     } else if (isNaN(storedBestScore) && score > 0) {
//       console.log("nie");
//       localStorage.setItem("bestscore", `${score}`);
//     }
//   }
// };

// function startGame() {
//   gameDataRef.current = {
//     snakePosition: [
//       [192, 0],
//       [128, 0],
//       [64, 0],
//       [0, 0],
//     ],
//     direction: "right",
//     speed: 250,
//     applePosition: [],
//     bricksPosition: [],
//     score: 0,
//     level: 1,
//     isRunning: false,
//     popup: {
//       isShown: false,
//       type: "",
//     },
//     isCounting: true,
//   };
//   settings.gamemode === "bricksSnake" && setBricks();
//   setApple();
// }

// function setRunning() {
//   gameDataRef.current.isRunning = true;
// }

// function disableCounting() {
//   gameDataRef.current.isCounting = false;
// }

// function update() {
//   if (gameDataRef.current.isRunning) {
//     moveSnake();
//   }
// }

// setApple();
// settings.gamemode === "bricksSnake" && setBricks();
