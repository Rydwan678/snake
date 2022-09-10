import React from "react";
import { Box, Stack, Paper, Typography, Button } from "@mui/material";
import { AppContext, AppContextType } from "../../context/app";

function SettingsCard() {
  const { fn, settings } = React.useContext(AppContext) as AppContextType;

  return (
    <Box sx={{ padding: 2, height: "350px" }} component={Paper}>
      <Stack spacing={2}>
        <Stack>
          <Typography>Audio</Typography>
          <Button variant="contained" onClick={() => fn.toggleSetting("audio")}>
            {settings.audio ? "ON" : "OFF"}
          </Button>
        </Stack>
        <Stack>
          <Typography>Difficulty</Typography>
          <Button variant="contained" onClick={fn.changeDifficulty}>
            {settings.difficulty.name}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SettingsCard;
