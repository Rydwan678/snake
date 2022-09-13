import React from "react";
import { Box, Stack, Button, Paper, Typography } from "@mui/material";
import UserCard from "./UserCard";
import { LobbyType } from "../../../../shared/interfaces";

interface UserLobbyProps {
  lobby: LobbyType | undefined;
  me: number;
}

function UserLobby(props: UserLobbyProps) {
  return (
    <Box sx={{ height: 400 }} component={Paper}>
      {/* {props.users.map((user) => (
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
          <UserCard userID={user} />
          {user !== props.me && <Button variant="contained">Kick</Button>}
        </Stack>
      ))} */}
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
          <Button variant="contained">Create new lobby</Button>
        </Stack>
      )}
    </Box>
  );
}

export default UserLobby;
