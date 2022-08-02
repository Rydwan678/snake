/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "../../types";
import InfoCard from "./InfoCard";
import UserCard from "./UserCard";
import BottomBar from "./BottomBar";
import { Grid, Box } from "@mui/material";

export default function UserPanel() {
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<User | null>();

  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  async function logout() {
    try {
      await localStorage.setItem("token", "undefined");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUserData() {
    try {
      console.log("1");
      const response = await fetch("http://127.0.0.1:5500/userPanel", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          authorization: `Beaer ${sessionToken}`,
        },
      });
      const data = await response.json();
      console.log("siema", data.userData.rows[0]);
      setUser(data.userData.rows[0]);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box>
      {user && (
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <UserCard user={user} />
          </Grid>
          <Grid item xs={12} sm={8}>
            <InfoCard user={user} />
          </Grid>
          <Grid item xs={12} sm={12}>
            <BottomBar />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
