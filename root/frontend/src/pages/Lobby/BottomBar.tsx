import React from "react";
import { Box, Stack, Paper, Button, Typography } from "@mui/material";
import { AppContext, AppContextType } from "../../context/app";
import { LobbyType } from "../../../../shared/interfaces";

interface BottomBarProps {
  lobby: LobbyType;
}

function BottomBar(props: BottomBarProps) {
  const { fn } = React.useContext(AppContext) as AppContextType;

  return (
    <Box component={Paper} sx={{ padding: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">{`${props.lobby.users.length}/2 Players`}</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={fn.leaveLobby}>
            Leave
          </Button>
          <Button variant="contained" disabled={props.lobby.users.length < 2}>
            Start
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default BottomBar;
