import React, { useEffect } from "react";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Play from "./pages/Play";
import Lobby from "./pages/Lobby";
import Game from "./pages/Game";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserPanel from "./pages/UserPanel";
import AdminPanel from "./pages/AdminPanel";
import { Routes, Route, Link } from "react-router-dom";
import { Container } from "@mui/material";
import Chat from "./components/Chat";
import { AppContext } from "./context/app";
import useApp from "./hooks/useApp";
import SnackbarAlert from "./components/SnackbarAlert";
import { useNavigate } from "react-router-dom";

export default function App() {
  const value = useApp();

  const navigate = useNavigate();

  useEffect(() => {
    if (value.game && window.location.pathname !== "/game") {
      navigate("/game");
    }
  }, [value.game]);

  return (
    <Container>
      <AppContext.Provider value={value}>
        {localStorage.getItem("token") && <Chat />}
        <Link to="/"></Link>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userPanel" element={<UserPanel />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/" element={<Menu />} />
          <Route path="/play" element={<Play />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/about" element={<About />} />
          <Route path="/game" element={<Game />} />
        </Routes>
        <SnackbarAlert />
      </AppContext.Provider>
    </Container>
  );
}
