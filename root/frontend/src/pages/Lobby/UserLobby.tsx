import React, { useEffect } from "react";
import { Box, Stack, Button, Paper, Typography, Avatar } from "@mui/material";
import UserCard from "./UserCard";
import { LobbyType } from "../../../../shared/interfaces";
import { AppContext, AppContextType } from "../../context/app";
import Lobby from ".";

interface UserLobbyProps {
  lobby: LobbyType | null;
  me: number;
}

function UserLobby(props: UserLobbyProps) {
  const { fn, me } = React.useContext(AppContext) as AppContextType;

  return (
    <Box sx={{ height: 400 }} component={Paper}>
      {props.lobby &&
        props.lobby.users.map((user) => (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              "&:hover": {
                backgroundColor: "#c2c2c2",
                transition: "300ms",
              },
              padding: 1,
            }}
          >
            <UserCard userID={user.id} />
            {user.id !== props.me &&
              props.lobby &&
              props.lobby.users.find((user) => user.id === me)?.leader && (
                <Button variant="contained" onClick={() => fn.kick(user.id)}>
                  Kick
                </Button>
              )}
            {user.leader && (
              <Avatar src="https://cdn-icons-png.flaticon.com/512/1657/1657088.png" />
            )}
          </Stack>
        ))}
      {!props.lobby && (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", width: "100%" }}
          spacing={2}
        >
          <Box sx={{ maxWidth: 300, textAlign: "center" }}>
            <Typography variant="h6">
              Currently you're not in any lobby. You can either create your
              lobby or join someone's lobby.
            </Typography>
          </Box>
          <Button variant="contained" onClick={fn.createLobby}>
            Create new lobby
          </Button>
        </Stack>
      )}
    </Box>
  );
}

export default UserLobby;
