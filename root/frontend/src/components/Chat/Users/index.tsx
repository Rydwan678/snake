import React from "react";
import { Box, Stack } from "@mui/material";
import UserCard from "./UserCard";
import { AppContext, AppContextType } from "../../../context/app";

function Users() {
  const { users, me, recipient, fn } = React.useContext(
    AppContext
  ) as AppContextType;

  const usersElement =
    users &&
    users.map(
      (user) =>
        user.id !== me && (
          <UserCard
            user={user}
            recipient={recipient}
            token={localStorage.getItem("token")}
            changeReceiver={fn.changeRecipient}
          />
        )
    );

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          maxWidth: 350,
          padding: 1,
          overflow: "auto",
          "::-webkit-scrollbar": { height: 5 },
        }}
        spacing={1}
      >
        {usersElement}
      </Stack>
    </Box>
  );
}

export default Users;
