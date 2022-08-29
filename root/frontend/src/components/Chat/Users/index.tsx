import React from "react";
import { Box, Stack, Input } from "@mui/material";
import UserCard from "./UserCard";
import { Message } from "../../../../../shared/interfaces";

interface UsersProps {
  users:
    | {
        id: number;
        messages: Message[] | undefined;
        online: boolean;
      }[]
    | undefined;
  me: number;
  recipient: number | undefined;
  token: string | null;
  changeRecipient: (id: number) => void;
}

function Users(props: UsersProps) {
  const usersElement =
    props.users &&
    props.users.map(
      (user) =>
        user.id !== props.me && (
          <UserCard
            user={user}
            recipient={props.recipient}
            token={props.token}
            changeReceiver={props.changeRecipient}
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
