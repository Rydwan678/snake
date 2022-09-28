import React, { useEffect, useContext } from "react";
import GameField from "./GameField";

export default function GameSite() {
  return (
    <main className="game-site">
      <div>
        <GameField />
      </div>
    </main>
  );
}
