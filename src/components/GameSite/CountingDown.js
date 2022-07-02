import React, { useEffect, useState } from "react";

export default function CountingDown(props) {
  const [text, setText] = useState("");

  const styles = {};

  useEffect(() => {
    setTimeout(() => {
      setText("READY");
      setTimeout(() => {
        setText("STEADY");
        setTimeout(() => {
          setTimeout(() => {
            setText("GO!");
          });
          setTimeout(() => {
            props.setRunning();
            props.disableCounting();
            setTimeout(() => {
              setText("");
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, []);

  return (
    <div className="counting-down" style={styles}>
      <h1>{text}</h1>
    </div>
  );
}
