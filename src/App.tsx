import React, { useState } from "react";
import StartSite from "./components/StartSite";
import GameSite from "./components/GameSite";
import { Settings, Setting } from "./types";

export default function App() {
  const [isStartSite, setIsStartSite] = useState<boolean>(true);

  const [settings, setSettings] = useState<Settings>({
    audio: true,
    difficulty: {
      name: "NORMAL",
      speedPerLevel: 12,
      bricksPerLevel: 5,
    },
    gamemode: "",
  });

  function changeDifficulty() {
    const levels = [
      {
        name: "EASY",
        speedPerLevel: 6,
        bricksPerLevel: 4,
      },
      {
        name: "NORMAL",
        speedPerLevel: 12,
        bricksPerLevel: 5,
      },
      {
        name: "HARD",
        speedPerLevel: 18,
        bricksPerLevel: 6,
      },
    ];
    const currentLevel = levels.findIndex(
      (element) => element.name === settings.difficulty.name
    );
    const nextLevel = levels[currentLevel + 1]
      ? levels[currentLevel + 1]
      : levels[0];
    setSettings((previousSettings) => ({
      ...previousSettings,
      difficulty: nextLevel,
    }));
  }

  function changeGamemode(selectedGamemode: string) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      gamemode: selectedGamemode,
    }));
  }

  function toggleSetting(setting: Setting) {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [setting]: !previousSettings[setting],
    }));
  }

  function changePage() {
    setIsStartSite((previousPage) => !previousPage);
  }

  return (
    <div>
      {isStartSite && (
        <StartSite
          changePage={changePage}
          changeDifficulty={changeDifficulty}
          toggleSetting={toggleSetting}
          changeGamemode={changeGamemode}
          settings={settings}
        />
      )}
      {!isStartSite && <GameSite changePage={changePage} settings={settings} />}
    </div>
  );
}
