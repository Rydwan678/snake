import React, { useState } from "react";
import {
  Grid,
  Container,
  TextField,
  Stack,
  Typography,
  Button,
  Link,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SnackbarAlert from "../components/SnackbarAlert";
import { AppContext, AppContextType } from "../context/app";

export default function Login() {
  const { fn } = React.useContext(AppContext) as AppContextType;

  const navigate = useNavigate();

  async function loginUser(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const response = await fetch("http://127.0.0.1:8080/login", {
        method: "POST",
        body: JSON.stringify({
          login: formData.get("login"),
          password: formData.get("password"),
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();

      if (response.status === 401) {
        fn.showAlert("error", data.message);
      } else if (response.status === 200) {
        fn.showAlert("success", data.message);
        await localStorage.setItem("token", data.token);
        if (localStorage.getItem("token") !== "undefined") {
          navigate("/", { replace: true });
        }
      } else {
        fn.showAlert("error", `Unknown error ${response.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <Container component={Paper} sx={{ padding: 5 }}>
        <Grid component="form" onSubmit={loginUser}>
          <Stack spacing={2}>
            <Typography variant="h5">Sign in</Typography>
            <TextField label="Login" name="login" id="login"></TextField>
            <TextField
              label="Password"
              name="password"
              id="password"
            ></TextField>
            <Button variant="contained" type="submit">
              Sign In
            </Button>
            <Link href="/register">Create account</Link>
          </Stack>
        </Grid>
      </Container>
      <SnackbarAlert />
    </Container>
  );
}
