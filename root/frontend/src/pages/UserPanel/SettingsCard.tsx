import React from "react";
import { Box, Stack, Paper, Typography, Button } from "@mui/material";
import { Settings, Setting } from "../../types";

interface SettingsCardProps {
  toggleSetting: (setting: Setting) => void;
  changeDifficulty: () => void;
  settings: Settings;
}

function SettingsCard(props: SettingsCardProps) {
  return (
    <Box sx={{ padding: 2, height: "350px" }} component={Paper}>
      <Stack spacing={2}>
        <Stack>
          <Typography>Audio</Typography>
          <Button
            variant="contained"
            onClick={() => props.toggleSetting("audio")}
          >
            {props.settings.audio ? "ON" : "OFF"}
          </Button>
        </Stack>
        <Stack>
          <Typography>Difficulty</Typography>
          <Button variant="contained" onClick={props.changeDifficulty}>
            {props.settings.difficulty.name}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default SettingsCard;
