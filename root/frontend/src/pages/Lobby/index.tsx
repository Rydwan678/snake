import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import NavigationBar from "./NavigationBar";
import UserLobby from "./UserLobby";
import OnlineUsers from "./OnlineUsers";
import BottomBar from "./BottomBar";
import { AppContext, AppContextType } from "../../context/app";
import { LobbyType } from "../../../../shared/interfaces";

function Lobby() {
  const [window, setWindow] = useState(0);
  const changeWindow = (e: React.SyntheticEvent, newWindow: number) => {
    setWindow(newWindow);
  };

  const { me } = React.useContext(AppContext) as AppContextType;

  const [lobby, setLobby] = useState<LobbyType>();

  return (
    <Box sx={{ minWidth: 400, maxWidth: 750 }}>
      {me && (
        <Stack spacing={1}>
          <NavigationBar window={window} changeWindow={changeWindow} />
          {window === 0 && <UserLobby lobby={lobby} me={me} />}
          {window === 1 && <OnlineUsers />}
          {lobby && <BottomBar />}
        </Stack>
      )}
    </Box>
  );
}

export default Lobby;
