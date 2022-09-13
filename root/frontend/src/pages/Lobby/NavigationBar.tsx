import React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";

interface NavigationBarProps {
  changeWindow: (e: React.SyntheticEvent, newWindow: number) => void;
  window: number;
}

function NavigationBar(props: NavigationBarProps) {
  return (
    <Box component={Paper}>
      <Tabs value={props.window} onChange={props.changeWindow}>
        <Tab label="Your lobby" />
        <Tab label="Invite players" />
      </Tabs>
    </Box>
  );
}

export default NavigationBar;
