import React, { useState } from "react";
import GameField from "./GameField";

interface GameSiteProps {
  changePage: () => void;
}

export default function GameSite(props: GameSiteProps) {
  return (
    <main className="game-site">
      <h1 className="game-title">SNAKE</h1>
      <div>
        <GameField changePage={props.changePage} />
      </div>
    </main>
  );
}
