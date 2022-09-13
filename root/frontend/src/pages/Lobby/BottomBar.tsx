import React from "react";
import { Box, Stack, Paper, Button, Typography } from "@mui/material";

function BottomBar() {
  return (
    <Box component={Paper} sx={{ padding: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">1/2 Players</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained">Leave</Button>
          <Button variant="contained">Start</Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default BottomBar;
