/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

interface CountingDownProps {
  setRunning: () => void;
  disableCounting: () => void;
}

export default function CountingDown(props: CountingDownProps) {
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
