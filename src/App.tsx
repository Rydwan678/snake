import React, { useState } from "react";
import StartSite from "./components/StartSite";
import GameSite from "./components/GameSite";

export default function App() {
  const [isStartSite, setIsStartSite] = useState<boolean>(true);

  function changePage() {
    setIsStartSite((previousPage) => !previousPage);
  }

  return (
    <div>
      {isStartSite && <StartSite changePage={changePage} />}
      {!isStartSite && <GameSite changePage={changePage} />}
    </div>
  );
}
