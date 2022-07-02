import React, { useState, useEffect, useRef } from "react";
import useGameLogic from "./useGameLogic";
import useGame from "./useGame";
import Popup from "./Popup";
import CountingDown from "./CountingDown";

export default function GameField(props) {
  const snakeIcon = new Image();
  snakeIcon.src = "textures/snakegraphics.png";
  const appleIcon = new Image();
  appleIcon.src = "textures/apple.png";
  const brickIcon = new Image();
  brickIcon.src = "textures/brick.png";

  const canvasRef = useRef(null);
  const focusRef = useRef();

  const {
    gameDataRef,
    handleKeyDown,
    startGame,
    setRunning,
    disableCounting,
    setNewLevel,
  } = useGame(render);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(gameDataRef.current.level);
  const [isRunning, setIsRunning] = useState(gameDataRef.current.isRunning);
  const [popup, setPopup] = useState({
    isShown: false,
    type: "",
  });
  const [isCounting, setIsCounting] = useState(true);

  useEffect(() => {
    setScore(gameDataRef.current.score);
    setIsRunning(gameDataRef.current.isRunning);
    setLevel(gameDataRef.current.level);
    setPopup({ ...gameDataRef.current.popup });
    setIsCounting(gameDataRef.current.isCounting);
    focusRef.current.focus();
  }, [
    gameDataRef.current.snakePosition,
    gameDataRef.current.score,
    gameDataRef.current.isRunning,
    gameDataRef.current.level,
    gameDataRef.current.popup,
    gameDataRef.current.isCounting,
  ]);

  function render() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = "1024";
    canvas.height = "1024";

    const drawSnakeElements = (element, position) => {
      let choosedElement = IMAGES[element];
      let elementPosition = position;
      ctx.drawImage(
        snakeIcon,
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

    const chooseSnakeElement = () => {
      const snakePosition = gameDataRef.current.snakePosition;
      const applePosition = gameDataRef.current.applePosition;
      ctx.drawImage(
        appleIcon,
        0,
        0,
        64,
        64,
        applePosition[0],
        applePosition[1],
        64,
        64
      );
      for (let i = 0; i < snakePosition.length; i++) {
        let currentElement = snakePosition[i];
        let nextElement = snakePosition[i - 1];
        let previousElement = snakePosition[i + 1];
        // head
        if (nextElement == undefined) {
          for (let image in IMAGES) {
            if (
              previousElement[0] - currentElement[0] === IMAGES[image][2] &&
              previousElement[1] - currentElement[1] === IMAGES[image][3]
            ) {
              drawSnakeElements(image, snakePosition[i]);
              break;
            }
          }
        }
        // tail
        else if (previousElement == undefined) {
          for (let image in IMAGES) {
            if (
              nextElement[0] - currentElement[0] === IMAGES[image][4] &&
              nextElement[1] - currentElement[1] === IMAGES[image][5]
            ) {
              drawSnakeElements(image, snakePosition[i]);
              break;
            }
          }
        }
        // something else
        else if (nextElement && previousElement) {
          for (let image in IMAGES) {
            if (
              (previousElement[0] - currentElement[0] === IMAGES[image][2] &&
                previousElement[1] - currentElement[1] === IMAGES[image][3] &&
                nextElement[0] - currentElement[0] === IMAGES[image][4] &&
                nextElement[1] - currentElement[1] === IMAGES[image][5]) ||
              (previousElement[0] - currentElement[0] === IMAGES[image][4] &&
                previousElement[1] - currentElement[1] === IMAGES[image][5] &&
                nextElement[0] - currentElement[0] === IMAGES[image][2] &&
                nextElement[1] - currentElement[1] === IMAGES[image][3])
            ) {
              drawSnakeElements(image, snakePosition[i]);
              break;
            }
          }
        }
      }
    };

    const drawBricks = () => {
      const bricksPosition = gameDataRef.current.bricksPosition;
      for (let i = 0; i < bricksPosition.length; i++) {
        let brickPositionX = bricksPosition[i][0];
        let brickPositionY = bricksPosition[i][1];
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
    chooseSnakeElement();
    drawBricks();
  }

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

  return (
    <div
      className="game-field"
      tabIndex={1}
      ref={focusRef}
      onKeyDown={isRunning ? handleKeyDown : () => {}}
    >
      {isCounting && (
        <CountingDown
          setRunning={setRunning}
          disableCounting={disableCounting}
        />
      )}
      {popup.isShown && (
        <Popup
          type={popup.type}
          level={level}
          changePage={props.changePage}
          startGame={startGame}
          setNewLevel={setNewLevel}
          handleKeyDown={handleKeyDown}
        />
      )}
      <div className="game-info">
        <img src="textures/apple.png" className="apple-icon"></img>
        <h1>{score}</h1>
        <img
          src="https://cdn3.iconfinder.com/data/icons/game-competition-flat/64/15_Top_Player_game_competition-512.png"
          className="level-icon"
        ></img>
        <h1>{level}</h1>
      </div>
      <div className="canvas-field" tabIndex={0}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
