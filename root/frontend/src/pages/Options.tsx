import React from "react";
import { Settings, Setting } from "../types";
import { Link } from "react-router-dom";

interface OptionsProps {
  toggleSetting: (setting: Setting) => void;
  changeDifficulty: () => void;
  settings: Settings;
}

export default function Options(props: OptionsProps) {
  return (
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
      <Link to="/">
        <button name="menu">BACK</button>
      </Link>
    </div>
  );
}
