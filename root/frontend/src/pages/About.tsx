import React from "react";
import { Box, Stack, Typography, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <Box component={Paper} sx={{ padding: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">About</Typography>
        <Box sx={{ maxWidth: 400 }}>
          <Typography>
            Snake game is my main project which im developing since May 2021. It
            was originally coded in pure JavaScript, then ported to React, and
            now it is made with TypeScript with backend working on Express.
          </Typography>
        </Box>
        <Link to="/">
          <Button name="menu" variant="contained">
            BACK
          </Button>
        </Link>
      </Stack>
    </Box>
  );
}
