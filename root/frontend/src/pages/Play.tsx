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
              fn.startGame("classic");
            }}
            variant="contained"
          >
            Classic Snake
          </Button>
        </Link>

        <Link to="/game">
          <Button
            onClick={() => {
              fn.startGame("bricks");
            }}
            variant="contained"
          >
            Bricks Snake
          </Button>
        </Link>

        <Link to="/lobby">
          <Button variant="contained">Multiplayer</Button>
        </Link>

        <Link to="/game">
          <Button
            onClick={async () => {
              fn.startGame("pve");
            }}
            variant="contained"
          >
            PvE
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
