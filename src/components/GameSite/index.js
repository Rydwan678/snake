import React, { useState } from "react";
import GameField from "./GameField";

export default function GameSite() {
  return (
    <main className="game-site">
      <h1 className="game-title">SNAKE</h1>
      <div>
        <GameField />
      </div>
    </main>
  );
}
