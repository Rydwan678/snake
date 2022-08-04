import React, { useState, useEffect } from "react";
import Menu from "./pages/Menu";
import Options from "./pages/Options";
import About from "./pages/About";
import Play from "./pages/Play";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import { Settings, Setting } from "./types";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Container, AppBar, Typography } from "@mui/material";

export default function App() {
  const [settings, setSettings] = useState<Settings>({
    audio: true,
    difficulty: {
      name: "NORMAL",
      speedPerLevel: 12,
      bricksPerLevel: 5,
    },
    gamemode: "",
  });
  const [token, setToken] = useState(localStorage.getItem("token"));

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

  return (
    <Container>
      <BrowserRouter>
        <Link to="/"></Link>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/userPanel"
            element={
              <UserPanel
                toggleSetting={toggleSetting}
                changeDifficulty={changeDifficulty}
                settings={settings}
              />
            }
          />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/" element={<Menu />} />
          <Route
            path="/play"
            element={<Play changeGamemode={changeGamemode} />}
          />
          <Route
            path="/options"
            element={
              <Options
                toggleSetting={toggleSetting}
                changeDifficulty={changeDifficulty}
                settings={settings}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/game" element={<Game settings={settings} />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
