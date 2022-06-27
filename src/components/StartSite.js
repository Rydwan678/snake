import { getDefaultNormalizer } from "@testing-library/react";
import React, { useState } from "react";

export default function StartSite(props) {
  const [currentSite, setCurrentSite] = useState({
    menu: true,
    options: false,
    about: false,
    chooseGamemode: false,
  });

  const [settings, setSettings] = useState({
    audio: true,
    difficulty: "easy",
  });

  function changeSite(e) {
    setCurrentSite((previousCurrentSite) => ({
      menu: false,
      options: false,
      about: false,
      chooseGamemode: false,
      [e.target.name]: true,
    }));
  }

  function changeDifficulty() {
    const levels = ["easy", "normal", "hard"];
    const currentLevel = levels.findIndex(
      (element) => element === settings.difficulty
    );
    const nextLevel = levels[currentLevel + 1]
      ? levels[currentLevel + 1]
      : levels[0];
    setSettings((previousSettings) => ({
      ...previousSettings,
      difficulty: nextLevel,
    }));
  }

  function toggleSetting(e) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [e.target.name]: !previousSettings[e.target.name],
    }));
  }

  return (
    <main>
      <h1 className="game-title">SNAKE</h1>
      {currentSite.menu && (
        <div className="menu">
          <button onClick={changeSite} name="chooseGamemode">
            <p>START</p>
          </button>
          <button onClick={changeSite} name="options">
            <p>OPTIONS</p>
          </button>
          <button onClick={changeSite} name="about">
            <p>ABOUT</p>
          </button>
        </div>
      )}
      {currentSite.options && (
        <div>
          <div className="option-container">
            <h1>Audio</h1>
            <button onClick={toggleSetting} name="audio">
              {settings.audio ? "ON" : "OFF"}
            </button>
          </div>
          <div className="option-container">
            <h1>Difficulty</h1>
            <button onClick={changeDifficulty}>{settings.difficulty}</button>
          </div>
          <button name="menu" onClick={changeSite}>
            BACK
          </button>
        </div>
      )}
      {currentSite.about && (
        <div>
          <h1>About</h1>
          <button name="menu" onClick={changeSite}>
            BACK
          </button>
        </div>
      )}
      {currentSite.chooseGamemode && (
        <div>
          <button>Classic Snake</button>
          <button onClick={props.changePage}>Bricks Snake</button>
        </div>
      )}
    </main>
  );
}
