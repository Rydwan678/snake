import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stack,
  Button,
  Typography,
  Grid,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Settings,
  SportsEsports,
  Backpack,
  LocalGroceryStore,
  PersonAdd,
  Person,
} from "@mui/icons-material";

export default function Menu() {
  const theme = useTheme();

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === "undefined" || token === null) {
      navigate("/login", { replace: true });
    }
  }, []);

  const ResponsiveDivider = () => {
    return (
      <Divider
        sx={{
          backgroundColor: "white",
          height: { xs: "4rem", md: "auto" },
          width: { xs: "auto", md: "100%" },
        }}
        orientation={
          useMediaQuery(theme.breakpoints.down("md"))
            ? "vertical"
            : "horizontal"
        }
      />
    );
  };

  const FriendAvatar = () => {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "8rem", width: "8rem" }}
      >
        <Avatar sx={{ height: "50%", width: "50%" }} />
      </Grid>
    );
  };

  return (
    <Grid
      container
      sx={{
        height: "100%",
        width: "100%",
        flex: { xs: "column", md: "row" },
        justifyContent: { xs: "center", md: "space-between" },
        alignItems: { xs: "space-between", md: "center" },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#191B1F",
          boxSizing: "border-box",
          borderRadius: 10,
          height: { xs: "5rem", md: "100%" },
          width: { xs: "100%", md: "10rem" },
        }}
      >
        <Stack
          sx={{
            height: "100%",
            justifyContent: { xs: "space-between", md: "center" },
            alignItems: { xs: "center", md: "space-between" },
          }}
          direction={{ xs: "row", md: "column" }}
        >
          <img src="/248.png" alt="logo" style={{ height: "8rem" }} />
          <ResponsiveDivider />
          <Stack
            sx={{ height: "auto", width: "100%" }}
            flexGrow={1}
            direction={{ xs: "row", md: "column" }}
          >
            <IconButton
              children={
                <SportsEsports
                  sx={{ height: "8rem", width: "4rem", color: "white" }}
                />
              }
              sx={{ width: "100%", borderRadius: 0 }}
            />
            <IconButton
              children={
                <Backpack
                  sx={{ height: "8rem", width: "4rem", color: "white" }}
                />
              }
              sx={{ width: "100%", borderRadius: 0 }}
            />
            <IconButton
              children={
                <LocalGroceryStore
                  sx={{ height: "8rem", width: "4rem", color: "white" }}
                />
              }
              sx={{ width: "100%", borderRadius: 0 }}
            />
          </Stack>
          <ResponsiveDivider />
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ height: "8rem", width: "100%" }}
          >
            <IconButton
              children={<Settings sx={{ fontSize: "4rem", color: "white" }} />}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "0px 0px 38px 38px",
              }}
            />
          </Stack>
        </Stack>
      </Box>

      <Grid
        container
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "#191B1F ",
          borderRadius: 10,
          height: { xs: "30rem", md: "35rem" },
          width: { xs: "100%", md: "40%" },
          padding: 5,
          boxSizing: "border-box",
        }}
      >
        <Stack sx={{ height: "100%", width: "100%", backgroundColor: "red" }}>
          <Stack justifyContent="center" alignItems="center">
            <Typography>248RYDWAN LOBBY</Typography>
          </Stack>
        </Stack>
      </Grid>

      <Box
        sx={{
          display: { xs: "none", md: "block" },
          backgroundColor: "#191B1F",
          boxSizing: "border-box",
          borderRadius: 10,
          height: { xs: "5rem", md: "100%" },
          width: { xs: "100%", md: "10rem" },
        }}
      >
        <Stack
          sx={{
            height: "100%",
            width: "100%",
            justifyContent: { xs: "space-between", md: "center" },
            alignItems: { xs: "center", md: "space-between" },
          }}
          direction={{ xs: "row", md: "column" }}
        >
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ height: "8rem", width: "8rem" }}
          >
            <Avatar sx={{ height: "65%", width: "65%" }} />
          </Grid>

          <ResponsiveDivider />
          <Stack
            sx={{ height: "auto" }}
            flexGrow={1}
            direction={{ xs: "row", md: "column" }}
          >
            <FriendAvatar />
            <FriendAvatar />
            <FriendAvatar />
          </Stack>
          <ResponsiveDivider />
          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ height: "8rem", width: "100%" }}
          >
            <IconButton
              children={<PersonAdd sx={{ fontSize: "4rem", color: "white" }} />}
              sx={{
                height: "100%",
                width: "100%",
                borderRadius: "0px 0px 38px 38px",
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </Grid>
  );
}
