/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Change, Changes, Setting, Settings, Alert } from "../../types";
import InfoCard from "./InfoCard";
import SafetyCard from "./SafetyCard";
import SettingsCard from "./SettingsCard";
import UserCard from "../../components/UserCard";
import BottomBar from "./BottomBar";
import NavigationBar from "./NavigationBar";
import SnackbarAlert from "../../components/SnackbarAlert";
import { Grid, Container, Box } from "@mui/material";
import useValidateData from "../../hooks/useValidateData";

interface UserPanelProps {
  toggleSetting: (setting: Setting) => void;
  changeDifficulty: () => void;
  settings: Settings;
}

export default function UserPanel(props: UserPanelProps) {
  const [sessionToken, setSessionToken] = useState(
    localStorage.getItem("token")
  );
  const [window, setWindow] = useState(0);
  const [alert, setAlert] = useState<Alert>({
    open: false,
    type: "info",
    message: "string",
  });
  const [user, setUser] = useState<User | null>(null);
  const [changes, setChanges] = useState<Changes | null>(null);

  const navigate = useNavigate();
  const validateUserData = useValidateData();

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setChanges(null);
  }, [window]);

  useEffect(() => {
    if (user && changes) {
      let key: keyof Changes;

      for (key in changes) {
        if (user[key] !== changes[key]) {
          return;
        }
      }
      setChanges(null);
    }
  }, [changes]);

  const changeWindow = (e: React.SyntheticEvent, newWindow: number) => {
    setWindow(newWindow);
  };

  async function getUserData() {
    try {
      const response = await fetch("http://127.0.0.1:8080/me", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          authorization: `Beaer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      setUser(data.user[0]);
    } catch (error) {
      console.log(error);
    }
  }

  async function logout() {
    try {
      await localStorage.setItem("token", "undefined");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  function getChanges(changeKey: Change, changeValue: string) {
    setChanges((previousChanges) => ({
      ...previousChanges,
      [changeKey]: changeValue,
    }));
  }

  async function saveChanges() {
    if (user && changes) {
      const userID = user.id;
      try {
        changes && (await validateUserData(changes));
        const response = await fetch("http://127.0.0.1:8080/updateUser", {
          method: "POST",
          body: JSON.stringify({ changes, userID }),
          headers: {
            "Content-type": "application/json",
          },
        });

        const data = await response.json();
        getUserData();
        setChanges(null);

        setAlert({
          open: true,
          type: "success",
          message: data.message,
        });
      } catch (error) {
        setAlert({
          open: true,
          type: "error",
          message: error as string,
        });
      }
    }
  }

  function closeAlert() {
    setAlert((previousAlert) => ({
      ...previousAlert,
      open: false,
    }));
  }

  return (
    <Box sx={{ maxWidth: "750px" }}>
      {user && (
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12}>
            <NavigationBar window={window} changeWindow={changeWindow} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <UserCard user={user} type="userPanel" />
          </Grid>
          <Grid item xs={12} sm={8}>
            {window === 0 && (
              <InfoCard getChanges={getChanges} changes={changes} user={user} />
            )}
            {window === 1 && <SafetyCard />}
            {window === 2 && (
              <SettingsCard
                toggleSetting={props.toggleSetting}
                changeDifficulty={props.changeDifficulty}
                settings={props.settings}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12}>
            <BottomBar
              logout={logout}
              saveChanges={saveChanges}
              cancelChanges={() => setChanges(null)}
              changes={changes}
            />
          </Grid>
        </Grid>
      )}
      <SnackbarAlert alert={alert} close={closeAlert} />
    </Box>
  );
}
