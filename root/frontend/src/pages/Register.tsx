/* eslint-disable no-useless-escape */
import React, { useState } from "react";
import useValidateData from "../hooks/useValidateData";
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
import SnackbarAlert from "../components/SnackbarAlert";
import { AppContext, AppContextType } from "../context/app";

export default function Register() {
  const { fn } = React.useContext(AppContext) as AppContextType;

  const validateData = useValidateData();

  async function registerUser(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const userData = {
        login: (formData.get("login") as string) ?? "",
        firstName: (formData.get("firstName") as string) ?? "",
        lastName: (formData.get("lastName") as string) ?? "",
        email: (formData.get("email") as string) ?? "",
        password: (formData.get("password") as string) ?? "",
        confirmPassword: (formData.get("confirmPassword") as string) ?? "",
        dateOfBirth: "",
      };
      await validateData(userData);

      const response = await fetch("http://127.0.0.1:8080/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();

      fn.showAlert("success", data.message);
    } catch (error) {
      fn.showAlert("error", error as string);
    }
  }

  return (
    <Container>
      <Container component={Paper} sx={{ padding: 5 }}>
        <Grid component="form" onSubmit={registerUser}>
          <Stack spacing={2}>
            <Typography variant="h5">Sign Up</Typography>
            <TextField label="Login" name="login" id="login"></TextField>
            <Stack direction="row" spacing={2}>
              <TextField
                label="First name"
                name="firstName"
                id="firstName"
              ></TextField>
              <TextField
                label="Last name"
                name="lastName"
                id="lastName"
              ></TextField>
            </Stack>
            <TextField label="Email" name="email" id="email"></TextField>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Password"
                type="password"
                name="password"
                id="password"
              ></TextField>
              <TextField
                label="Confirm password"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
              ></TextField>
            </Stack>

            <Button variant="contained" type="submit">
              Sign Up
            </Button>
            <Link href="/">Already have an account? Sign In.</Link>
          </Stack>
        </Grid>
      </Container>
      <SnackbarAlert />
    </Container>
  );
}

// async function registerUser(user: any) {
//   try {
//     const response = await fetch("http://127.0.0.1:8080/register", {
//       method: "POST",
//       body: JSON.stringify({
//         name: user.login.username,
//         email: user.email,
//         dateOfBirth: "18-07-2022",
//         password: user.login.password,
//       }),
//       headers: {
//         "Content-type": "application/json",
//       },
//     });
//     const data = await response.json();
//     setInfo(data.message);
//   } catch (error) {
//     setInfo(JSON.stringify(error));
//   }
// }

// async function getApi() {
//   try {
//     const response = await fetch("https://randomuser.me/api/?results=2000");
//     const data = await response.json();
//     data.results.map(async (user: any) => await registerUser(user));
//   } catch (error) {
//     console.log("error");
//   }
// }
