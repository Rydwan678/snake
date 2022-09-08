import React from "react";
import { Button, Box, Stack } from "@mui/material";
import { Link } from "react-router-dom";

interface PlayProps {
  changeGamemode: (selectedGamemode: string) => void;
}

export default function Play(props: PlayProps) {
  return (
    <Box>
      <Stack direction="row" spacing={2}>
        <Link to="/game">
          <Button
            onClick={() => {
              props.changeGamemode("classicSnake");
            }}
            variant="contained"
          >
            Classic Snake
          </Button>
        </Link>
        <Link to="/game">
          <Button
            onClick={() => {
              props.changeGamemode("bricksSnake");
            }}
            variant="contained"
          >
            Bricks Snake
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
