import React from "react";
import { Link } from "react-router-dom";

interface PlayProps {
  changeGamemode: (selectedGamemode: string) => void;
}

export default function Play(props: PlayProps) {
  return (
    <div>
      <Link to="/game">
        <button
          onClick={() => {
            props.changeGamemode("classicSnake");
          }}
        >
          Classic Snake
        </button>
      </Link>
      <Link to="/game">
        <button
          onClick={() => {
            props.changeGamemode("bricksSnake");
          }}
        >
          Bricks Snake
        </button>
      </Link>
    </div>
  );
}
