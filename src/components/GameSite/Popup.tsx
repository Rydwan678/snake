import React, { useEffect, useRef } from "react";
import { Settings } from "../../types";

interface PopupProps {
  type: string;
  level: number;
  settings: Settings;
  score: number;
  bestScore: number | null;
  changePage: () => void;
  startGame: () => void;
  setNewLevel: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export default function Popup(props: PopupProps) {
  type Styles = {
    background: string;
    boxShadow: string;
  };

  const styles: Styles = {
    background: "",
    boxShadow: "",
  };

  if (props.type === "win") {
    styles.background = "linear-gradient(90deg, #fcff9e 0%, #c67700 100%)";
    styles.boxShadow = "4px 4px 15px #ff9900";
  }
  if (props.type === "lose") {
    styles.background =
      "linear-gradient(90deg, #EB3349 0%, #F45C43 51%, #EB3349  100%)";
    styles.boxShadow = "4px 4px 15px #ed5568";
  }
  if (props.type === "end") {
    styles.background =
      "linear-gradient(to right, #757F9A 0%, #D7DDE8  51%, #757F9A  100%)";
    styles.boxShadow = "4px 4px 15px #D7DDE8";
  }
  if (props.type === "gamePaused") {
    styles.background = "linear-gradient(90deg, #9ebd13 0%, #008552 100%)";
    styles.boxShadow = "1px 1px 15px  #bbe014";
  }
  if (props.type === "nextLevel") {
    styles.background = "linear-gradient(90deg, #1CB5E0 0%, #2e70ff 100%)";
    styles.boxShadow = "1px 1px 15px  #1CB5E0";
  }

  const focusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    focusRef.current && focusRef.current.focus();
  }, []);

  if (props.type === "nextLevel") {
    return (
      <div ref={focusRef} tabIndex={1} className="popup-body">
        <div className="popup" style={styles}>
          <p>LEVEL {props.level} COMPLETED</p>
          <div>
            <button style={styles} onClick={props.setNewLevel}>
              NEXT LEVEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (props.type === "gamePaused")
    return (
      <div
        ref={focusRef}
        tabIndex={1}
        className="popup-body"
        onKeyDown={(e) => {
          props.handleKeyDown(e);
        }}
      >
        <div className="popup" style={styles}>
          <p>GAME PAUSED</p>

          <div>
            <button style={styles} onClick={props.startGame}>
              RESTART
            </button>

            <button style={styles} onClick={props.changePage}>
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    );

  if (props.type === "lose")
    return (
      <div className="popup-body" ref={focusRef} tabIndex={1}>
        <div className="popup" style={styles}>
          <p>YOU LOST</p>

          <div>
            <button style={styles} onClick={props.startGame}>
              PLAY AGAIN
            </button>

            <button style={styles} onClick={props.changePage}>
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    );

  if (props.type === "end") {
    return (
      <div className="popup-body" ref={focusRef} tabIndex={1}>
        <div className="popup" style={styles}>
          <div className="game-info">
            <img
              alt="apple"
              src="textures/apple.png"
              className="apple-icon"
            ></img>
            <h1>{props.score}</h1>
            {props.bestScore && (
              <img
                alt="trophy"
                src="textures/trophy.png"
                className="trophy-icon"
              ></img>
            )}
            {props.bestScore && <h1>{props.bestScore}</h1>}
          </div>
          <div>
            <button style={styles} onClick={props.startGame}>
              PLAY AGAIN
            </button>

            <button style={styles} onClick={props.changePage}>
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (props.type === "win") {
    return (
      <div className="popup-body" ref={focusRef} tabIndex={1}>
        <div className="popup" style={styles}>
          <p>YOU WON</p>

          <div>
            <button style={styles} onClick={props.startGame}>
              PLAY AGAIN
            </button>

            <button style={styles} onClick={props.changePage}>
              BACK TO MENU
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
