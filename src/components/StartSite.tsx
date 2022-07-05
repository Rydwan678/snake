import { getDefaultNormalizer } from "@testing-library/react";
import React, { ReducerWithoutAction, useState } from "react";

interface StartSiteProps {
  changePage: () => void;
}

export default function StartSite(props: StartSiteProps) {
  const [currentSite, setCurrentSite] = useState({
    menu: true,
    options: false,
    about: false,
    chooseGamemode: false,
  });

  const [settings, setSettings] = useState({
    audio: true,
    difficulty: "EASY",
  });

  function changeSite(e: React.MouseEvent) {
    setCurrentSite((previousCurrentSite) => ({
      menu: false,
      options: false,
      about: false,
      chooseGamemode: false,
      [(e.target as HTMLInputElement).name]: true,
    }));
  }

  function changeDifficulty() {
    const levels = ["EASY", "NORMAL", "HARD"];
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

  function toggleSetting(e: React.MouseEvent) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [(e.target as HTMLInputElement).name]: !(e.target as HTMLInputElement)
        .name,
    }));
  }

  return (
    <main>
      <h1 className="game-title">SNAKE</h1>
      {currentSite.menu && (
        <div className="menu">
          <button onClick={(e) => changeSite(e)} name="chooseGamemode">
            <p>START</p>
          </button>
          <button onClick={(e) => changeSite(e)} name="options">
            <p>OPTIONS</p>
          </button>
          <button onClick={(e) => changeSite(e)} name="about">
            <p>ABOUT</p>
          </button>
        </div>
      )}
      {currentSite.options && (
        <div>
          <div className="option-container">
            <h1>Audio</h1>
            <button onClick={(e) => toggleSetting(e)} name="audio">
              {settings.audio ? "ON" : "OFF"}
            </button>
          </div>
          <div className="option-container">
            <h1>Difficulty</h1>
            <button onClick={changeDifficulty}>{settings.difficulty}</button>
          </div>
          <button name="menu" onClick={(e) => changeSite(e)}>
            BACK
          </button>
        </div>
      )}
      {currentSite.about && (
        <div>
          <h1>About</h1>
          <button name="menu" onClick={(e) => changeSite(e)}>
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
