import React from "react";
import { Box, Stack, Paper, Button } from "@mui/material";
import { AppContext, AppContextType } from "../../context/app";
import UserCard from "./UserCard";

function OnlineUsers() {
  const { users, me } = React.useContext(AppContext) as AppContextType;

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
                <Button variant="contained">Invite</Button>
              </Stack>
            )
        )}
      </Stack>
    </Box>
  );
}

export default OnlineUsers;
