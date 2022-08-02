import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Stack, Button } from "@mui/material";

export default function Menu() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === "undefined") {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <Container>
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ Button: { height: 50, width: 150 } }}
      >
        <Link to="/play">
          <Button variant="contained">
            <p>START</p>
          </Button>
        </Link>
        <Link to="/options" className="button">
          <Button variant="contained">
            <p>OPTIONS</p>
          </Button>
        </Link>
        <Link to="/userPanel" className="button">
          <Button variant="contained">
            <p>PROFILE</p>
          </Button>
        </Link>
        <Link to="/adminPanel" className="button">
          <Button variant="contained">
            <p>ADMIN</p>
          </Button>
        </Link>
        <Link to="/about" className="button">
          <Button variant="contained">
            <p>ABOUT</p>
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}
