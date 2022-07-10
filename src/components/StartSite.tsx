import React, { useState } from "react";
import { Settings, Setting } from "../types";

interface StartSiteProps {
  changePage: () => void;
  changeDifficulty: () => void;
  toggleSetting: (setting: Setting) => void;
  changeGamemode: (selectedGamemode: string) => void;
  settings: Settings;
}

export default function StartSite(props: StartSiteProps) {
  const [currentSite, setCurrentSite] = useState({
    menu: true,
    options: false,
    about: false,
    chooseGamemode: false,
  });

  function changeSite(site: string) {
    setCurrentSite((previousCurrentSite) => ({
      menu: false,
      options: false,
      about: false,
      chooseGamemode: false,
      [site]: true,
    }));
  }

  return (
    <main>
      <h1 className="game-title">SNAKE</h1>
      {currentSite.menu && (
        <div className="menu">
          <button onClick={(e) => changeSite("chooseGamemode")}>
            <p>START</p>
          </button>
          <button onClick={(e) => changeSite("options")}>
            <p>OPTIONS</p>
          </button>
          <button onClick={(e) => changeSite("about")}>
            <p>ABOUT</p>
          </button>
        </div>
      )}
      {currentSite.options && (
        <div>
          <div className="option-container">
            <h1>Audio</h1>
            <button onClick={(e) => props.toggleSetting("audio")}>
              {props.settings.audio ? "ON" : "OFF"}
            </button>
          </div>
          <div className="option-container">
            <h1>Difficulty</h1>
            <button onClick={props.changeDifficulty}>
              {props.settings.difficulty.name}
            </button>
          </div>
          <button name="menu" onClick={() => changeSite("menu")}>
            BACK
          </button>
        </div>
      )}
      {currentSite.about && (
        <div>
          <h1>About</h1>
          <button name="menu" onClick={() => changeSite("menu")}>
            BACK
          </button>
        </div>
      )}
      {currentSite.chooseGamemode && (
        <div>
          <button
            onClick={() => {
              props.changePage();
              props.changeGamemode("classicSnake");
            }}
          >
            Classic Snake
          </button>
          <button
            onClick={() => {
              props.changePage();
              props.changeGamemode("bricksSnake");
            }}
          >
            Bricks Snake
          </button>
        </div>
      )}
    </main>
  );
}
