import React from "react";
import { Container, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";

function BottomBar() {
  return (
    <Container component={Paper} sx={{ padding: 2 }}>
      <Link to="/">
        <Button variant="contained">BACK</Button>
      </Link>
    </Container>
  );
}

export default BottomBar;
