import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import NavigationBar from "./NavigationBar";
import UserLobby from "./UserLobby";
import OnlineUsers from "./OnlineUsers";
import BottomBar from "./BottomBar";
import { AppContext, AppContextType } from "../../context/app";
import { LobbyType } from "../../../../shared/interfaces";
import { getModeForResolutionAtIndex } from "typescript";

function Lobby() {
  const [window, setWindow] = useState(0);
  const changeWindow = (e: React.SyntheticEvent, newWindow: number) => {
    setWindow(newWindow);
  };

  const { me, lobby, fn } = React.useContext(AppContext) as AppContextType;

  useEffect(() => {
    fn.getLobbies();
  }, []);

  return (
    <Box sx={{ minWidth: 400, maxWidth: 750 }}>
      {me && (
        <Stack spacing={1}>
          <NavigationBar window={window} changeWindow={changeWindow} />
          {window === 0 && <UserLobby lobby={lobby} me={me} />}
          {window === 1 && <OnlineUsers lobby={lobby} />}
          {lobby && <BottomBar lobby={lobby} />}
        </Stack>
      )}
    </Box>
  );
}

export default Lobby;
