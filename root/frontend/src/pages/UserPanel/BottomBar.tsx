import React from "react";
import { Stack, Box, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { Changes } from "../../types";

interface BottomBarProps {
  logout: () => void;
  saveChanges: () => void;
  cancelChanges: () => void;
  changes: Changes | null;
}

function BottomBar(props: BottomBarProps) {
  return (
    <Box component={Paper} sx={{ padding: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          <Link to="/">
            <Button variant="contained">BACK</Button>
          </Link>
          <Button variant="contained" onClick={props.logout}>
            LOGOUT
          </Button>
        </Stack>
        {props.changes && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={props.cancelChanges}>
              CANCEL
            </Button>
            <Button variant="contained" onClick={props.saveChanges}>
              SAVE
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default BottomBar;
