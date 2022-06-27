import React, { useEffect, useState, useRef } from "react";
import useGameLogic from "./useGameLogic";

export default function useGame(render) {
  const requestID = useRef(null);
  const previousTime = useRef(null);

  const gameLogic = useGameLogic();

  const [gameData, setGameData] = useState(gameLogic.gameDataRef.current);

  const newFrameRef = useRef(-1);

  function loop(time) {
    const deltaTime = time - previousTime.current;
    const speed = gameData.speed;
    if (time > newFrameRef.current) {
      newFrameRef.current = time + speed;
      gameLogic.update();
    }

    setGameData({ ...gameLogic.gameDataRef.current });
    previousTime.current = time;

    requestID.current = requestAnimationFrame(loop);
  }

  useEffect(() => {
    render();
  }, [gameData]);

  useEffect(() => {
    console.log("renderUseGame");

    requestID.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestID.current);
  }, []);
  return { ...gameLogic, gameData };
}
