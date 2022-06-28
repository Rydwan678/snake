import React from "react";

export default function Popup(props) {
  const styles = {
    background:
      props.type === "lose"
        ? "linear-gradient(90deg, #EB3349 0%, #F45C43 51%, #EB3349  100%)"
        : "linear-gradient(90deg, #9ebd13 0%, #008552 100%)",
  };

  if (props.type === "gamePaused")
    return (
      <div className="popup-body">
        <div className="popup" styles={styles}>
          <p>GAME PAUSED</p>
        </div>
      </div>
    );
  if (props.type === "lose")
    return (
      <div className="popup-body">
        <div className="popup" styles={styles}>
          <p>YOU LOST</p>
        </div>
      </div>
    );
}
