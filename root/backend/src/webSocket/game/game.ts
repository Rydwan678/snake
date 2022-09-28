import { Store } from "../../interfaces";
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
      const snakePosition = store.games[game].users[index].position;
      const direction = store.games[game].users[index].direction;

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

      console.log(
        "checkCollision",
        checkCollision(store, gameID, updatedSnakePosition)
      );

      if (checkCollision(store, gameID, updatedSnakePosition) === false) {
        store.games[game].users[index].position = updatedSnakePosition;
        console.log(
          "updated game user position",
          store.games[game].users[0].position
        );
      } else if (checkCollision(store, gameID, updatedSnakePosition) === true) {
        store.games[game].isRunning = false;
        // gameDataRef.current.popup = {
        //   isShown: !gameDataRef.current.popup.isShown,
        //   type: settings.gamemode === "bricksSnake" ? "lose" : "end",
        // };
      }
      checkScore(store, lastSnakeElement, gameID);
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
      if (
        snakePosition[0][0] === applePosition[0] &&
        snakePosition[0][1] === applePosition[1]
      ) {
        // const eatSound = new Audio("sounds/eatsound.mp3");
        // settings.audio && eatSound.play();
        store.games[game].users[index].score = score + 1;
        store.games[game].users[index].position.push(lastSnakeElement);

        setApple(store, gameID);

        // if (settings.gamemode === "bricksSnake" && score + 1 === 10) {
        //   if (gameDataRef.current.level < 9) {
        //     gameDataRef.current.isRunning = false;
        //     gameDataRef.current.popup = {
        //       isShown: !gameDataRef.current.popup.isShown,
        //       type: "nextLevel",
        //     };
        //   } else if (gameDataRef.current.level === 9) {
        //     gameDataRef.current.level = 10;
        //     gameDataRef.current.score = 0;
        //     gameDataRef.current.isRunning = false;
        //     gameDataRef.current.popup = {
        //       isShown: !gameDataRef.current.popup.isShown,
        //       type: "win",
        //     };
        //   }
        // }
        return true;
      } else {
        return false;
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

const setApple = (store: Store, gameID: string) => {
  const game = store.games.findIndex((game) => game.id === gameID);

  if (store.games[game]) {
    const bricksPosition = store.games[game].bricksPosition;

    let positionX = getRandomPosition();
    let positionY = getRandomPosition();

    const apple = [positionX, positionY];
    // if apple has been spawned in player, create new position

    store.games[game].users.forEach((user, index) => {
      const snakePosition = store.games[game].users[index].position;

      snakePosition.forEach((position, index) => {
        if (
          snakePosition[index][0] === apple[0] &&
          snakePosition[index][1] === apple[1]
        ) {
          setApple(store, gameID);
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
    for (let i = 0; i < bricksPosition.length; i++) {}
    bricksPosition.forEach((position, i) => {
      appleAdjacentFields.forEach((field, x) => {
        if (
          bricksPosition[i][0] === appleAdjacentFields[x][0] &&
          bricksPosition[i][1] === appleAdjacentFields[x][1]
        ) {
          counter += 1;
        }
      });
      if (counter === 3) {
        setApple(store, gameID);
      }
    });
  }
};

// const setBricks = (store: Store, gameID: string) => {
//   const game = store.games.findIndex((game) => game.id === gameID);

//   if (store.games[game]) {
//     const bricksPosition = store.games[game].bricksPosition;
//     for (let i = 0; i < settings.difficulty.bricksPerLevel; i++) {
//       let positionX = getRandomPosition();
//       let positionY = getRandomPosition();
//       bricksPosition.push([positionX, positionY]);
//       // remove brick when it has been spawned too close to snake start
//       let lastBrick = bricksPosition[bricksPosition.length - 1];
//       if (lastBrick[0] < 512 && lastBrick[1] === 0) {
//         bricksPosition.pop();
//       }
//     }
//   }
// };

// const setNewLevel = () => {
//   gameDataRef.current.level += 1;
//   gameDataRef.current.score = 0;
//   if (gameDataRef.current.level !== 10) {
//     gameDataRef.current.snakePosition = [
//       [192, 0],
//       [128, 0],
//       [64, 0],
//       [0, 0],
//     ];
//     gameDataRef.current.direction = "right";
//     gameDataRef.current.speed -= settings.difficulty.speedPerLevel;
//     gameDataRef.current.popup = {
//       isShown: false,
//       type: "",
//     };

//     setBricks();
//     setApple();
//     gameDataRef.current.isCounting = true;
//   }
// };

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
