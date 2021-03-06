/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { Settings } from "../../types";

export default function useGameLogic(settings: Settings) {
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

  const gameDataRef = useRef<GameDataTypes>({
    snakePosition: [
      [192, 0],
      [128, 0],
      [64, 0],
      [0, 0],
    ],
    direction: "right",
    speed: 250,
    applePosition: [],
    bricksPosition: [],
    score: 0,
    level: 1,
    isRunning: false,
    popup: {
      isShown: false,
      type: "",
    },
    isCounting: true,
  });

  useEffect(() => {
    setApple();
    settings.gamemode === "bricksSnake" && setBricks();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    const direction = gameDataRef.current.direction;
    if (e.key === "w") {
      if (direction !== "down") {
        gameDataRef.current.direction = "up";
      }
    } else if (e.key === "s") {
      if (direction !== "up") {
        gameDataRef.current.direction = "down";
      }
    } else if (e.key === "a") {
      if (direction !== "right") {
        gameDataRef.current.direction = "left";
      }
    } else if (e.key === "d") {
      if (direction !== "left") {
        gameDataRef.current.direction = "right";
      }
    }

    if (e.key === "Escape") {
      console.log("test");
      gameDataRef.current.isRunning = !gameDataRef.current.isRunning;
      gameDataRef.current.popup = {
        isShown: !gameDataRef.current.popup.isShown,
        type: "gamePaused",
      };
    }
  }

  const moveSnake = () => {
    const snakePosition = gameDataRef.current.snakePosition;
    const direction = gameDataRef.current.direction;
    // delete last part of snake and add new with updated position
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

    if (checkCollision(updatedSnakePosition) === false) {
      gameDataRef.current.snakePosition = updatedSnakePosition;
    } else if (checkCollision(updatedSnakePosition) === true) {
      gameDataRef.current.isRunning = false;
      gameDataRef.current.popup = {
        isShown: !gameDataRef.current.popup.isShown,
        type: settings.gamemode === "bricksSnake" ? "lose" : "end",
      };
    }
    checkScore(lastSnakeElement);
  };

  const checkScore = (lastSnakeElement: number[]) => {
    const snakePosition = gameDataRef.current.snakePosition;
    const applePosition = gameDataRef.current.applePosition;
    const score = gameDataRef.current.score;
    if (
      snakePosition[0][0] === applePosition[0] &&
      snakePosition[0][1] === applePosition[1]
    ) {
      const eatSound = new Audio("sounds/eatsound.mp3");
      settings.audio && eatSound.play();
      gameDataRef.current.score = score + 1;
      gameDataRef.current.snakePosition.push(lastSnakeElement);

      setApple();

      if (settings.gamemode === "bricksSnake" && score + 1 === 10) {
        if (gameDataRef.current.level < 9) {
          gameDataRef.current.isRunning = false;
          gameDataRef.current.popup = {
            isShown: !gameDataRef.current.popup.isShown,
            type: "nextLevel",
          };
        } else if (gameDataRef.current.level === 9) {
          gameDataRef.current.level = 10;
          gameDataRef.current.score = 0;
          gameDataRef.current.isRunning = false;
          gameDataRef.current.popup = {
            isShown: !gameDataRef.current.popup.isShown,
            type: "win",
          };
        }
      }
      return true;
    } else {
      return false;
    }
  };

  const checkCollision = (data: number[][]) => {
    const snakePosition = data;
    const bricksPosition = gameDataRef.current.bricksPosition;
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
        setBestScore();
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
        setBestScore();
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
      setBestScore();
      return true;
    } else {
      return false;
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
    const snakePosition = gameDataRef.current.snakePosition;
    const bricksPosition = gameDataRef.current.bricksPosition;

    let positionX = getRandomPosition();
    let positionY = getRandomPosition();

    const apple = [positionX, positionY];
    gameDataRef.current.applePosition = apple;
    // if apple has been spawned in player, create new position
    for (let i = 0; i < snakePosition.length; i++) {
      if (
        snakePosition[i][0] === apple[0] &&
        snakePosition[i][1] === apple[1]
      ) {
        setApple();
      }
    }
    // if apple has been spawned in brick, create new position
    for (let i = 0; i < bricksPosition.length; i++) {
      if (
        bricksPosition[i][0] === apple[0] &&
        bricksPosition[i][1] === apple[1]
      ) {
        setApple();
      }
    }
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
        setApple();
      }
    }
  };

  const setBricks = () => {
    const bricksPosition = gameDataRef.current.bricksPosition;
    for (let i = 0; i < settings.difficulty.bricksPerLevel; i++) {
      let positionX = getRandomPosition();
      let positionY = getRandomPosition();
      bricksPosition.push([positionX, positionY]);
      // remove brick when it has been spawned too close to snake start
      let lastBrick = bricksPosition[bricksPosition.length - 1];
      if (lastBrick[0] < 512 && lastBrick[1] === 0) {
        bricksPosition.pop();
      }
    }
  };

  const setNewLevel = () => {
    gameDataRef.current.level += 1;
    gameDataRef.current.score = 0;
    if (gameDataRef.current.level !== 10) {
      gameDataRef.current.snakePosition = [
        [192, 0],
        [128, 0],
        [64, 0],
        [0, 0],
      ];
      gameDataRef.current.direction = "right";
      gameDataRef.current.speed -= settings.difficulty.speedPerLevel;
      gameDataRef.current.popup = {
        isShown: false,
        type: "",
      };

      setBricks();
      setApple();
      gameDataRef.current.isCounting = true;
    }
  };

  const setBestScore = () => {
    const storedBestScore = parseInt(`${localStorage.getItem("bestscore")}`);
    const score = gameDataRef.current.score;

    if (settings.gamemode === "classicSnake") {
      if (score > storedBestScore) {
        console.log("tak");
        localStorage.setItem("bestscore", `${score}`);
      } else if (isNaN(storedBestScore) && score > 0) {
        console.log("nie");
        localStorage.setItem("bestscore", `${score}`);
      }
    }
  };

  function startGame() {
    gameDataRef.current = {
      snakePosition: [
        [192, 0],
        [128, 0],
        [64, 0],
        [0, 0],
      ],
      direction: "right",
      speed: 250,
      applePosition: [],
      bricksPosition: [],
      score: 0,
      level: 1,
      isRunning: false,
      popup: {
        isShown: false,
        type: "",
      },
      isCounting: true,
    };
    settings.gamemode === "bricksSnake" && setBricks();
    setApple();
  }

  function setRunning() {
    gameDataRef.current.isRunning = true;
  }

  function disableCounting() {
    gameDataRef.current.isCounting = false;
  }

  function update() {
    if (gameDataRef.current.isRunning) {
      moveSnake();
    }
  }

  return {
    gameDataRef,
    handleKeyDown,
    update,
    startGame,
    setNewLevel,
    setRunning,
    disableCounting,
  };
}
