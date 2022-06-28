import React from "react";

export default function Popup(props) {
  if (props.type === "gamePaused")
    return (
      <div className="popup-body">
        <div className="popup">
          <p>GAME PAUSED</p>
        </div>
      </div>
    );
  if (props.type === "lose")
    return (
      <div className="popup-body">
        <div className="popup">
          <p>YOU LOST</p>
        </div>
      </div>
    );
}
