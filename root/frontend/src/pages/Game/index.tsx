import React from "react";
import GameField from "./GameField";
import { Settings } from "../../types";

interface GameSiteProps {
  settings: Settings;
}

export default function GameSite(props: GameSiteProps) {
  return (
    <main className="game-site">
      <div>
        <GameField settings={props.settings} />
      </div>
    </main>
  );
}
