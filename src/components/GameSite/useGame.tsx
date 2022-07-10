/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import useGameLogic from "./useGameLogic";
import { Settings } from "../../types";

export default function useGame(render: () => void, settings: Settings) {
  const requestID = useRef<number | null>(null);
  const previousTime = useRef<number | null>(null);

  const gameLogic = useGameLogic(settings);

  const [gameData, setGameData] = useState(gameLogic.gameDataRef.current);

  const newFrameRef = useRef(-1);

  function loop(time: number) {
    const speed = gameData.speed;
    if (time > newFrameRef.current) {
      newFrameRef.current = time + speed;
      gameLogic.update();
    }

    setGameData({ ...gameLogic.gameDataRef.current });
    previousTime.current = time;

    requestID.current! = requestAnimationFrame(loop);
  }

  useEffect(() => {
    render();
  }, [gameData]);

  useEffect(() => {
    console.log("renderUseGame");

    requestID.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(requestID.current!);
  }, []);
  return { ...gameLogic, gameData };
}
