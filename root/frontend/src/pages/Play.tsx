import React from "react";
import { Button, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { AppContext, AppContextType } from "../context/app";

export default function Play() {
  const { fn } = React.useContext(AppContext) as AppContextType;

  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Link to="/game">
          <Button
            onClick={() => {
              fn.changeGamemode("classicSnake");
            }}
            variant="contained"
          >
            Classic Snake
          </Button>
        </Link>
        <Link to="/game">
          <Button
            onClick={() => {
              fn.changeGamemode("bricksSnake");
            }}
            variant="contained"
          >
            Bricks Snake
          </Button>
        </Link>
        <Link to="/lobby">
          <Button
            onClick={() => {
              fn.changeGamemode("multiplayer");
            }}
            variant="contained"
          >
            Multiplayer
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
