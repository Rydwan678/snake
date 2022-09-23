import React, { useState } from "react";
import { Box, Stack, Paper, Button, Typography } from "@mui/material";
import { AppContext, AppContextType } from "../../context/app";
import UserCard from "./UserCard";
import { LobbyType } from "../../../../shared/interfaces";

interface OnlineUsersProps {
  lobby: LobbyType | null;
}

function OnlineUsers(props: OnlineUsersProps) {
  const { users, me, fn } = React.useContext(AppContext) as AppContextType;

  return (
    <Box sx={{ height: 400 }} component={Paper}>
      <Stack>
        {users.map(
          (user) =>
            user.online &&
            user.id !== me && (
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
                {props.lobby && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      props.lobby && fn.invite(props.lobby.id, user.id);
                    }}
                  >
                    Invite
                  </Button>
                )}
              </Stack>
            )
        )}
      </Stack>
      {users.filter((user) => user.online).length < 2 && (
        <Stack
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%" }}
        >
          <Typography variant="h6">
            Currently, there aren't any users online
          </Typography>
        </Stack>
      )}
    </Box>
  );
}

export default OnlineUsers;
