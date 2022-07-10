import React from "react";
import GameField from "./GameField";
import { Settings } from "../../types";

interface GameSiteProps {
  changePage: () => void;
  settings: Settings;
}

export default function GameSite(props: GameSiteProps) {
  return (
    <main className="game-site">
      <h1 className="game-title" onClick={props.changePage}>
        SNAKE
      </h1>
      <div>
        <GameField changePage={props.changePage} settings={props.settings} />
      </div>
    </main>
  );
}
