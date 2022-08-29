import React, { useEffect, useState } from "react";
import { Box, Stack, Avatar, Typography } from "@mui/material";
import { getUsers } from "../../../ApiServices";
import { User } from "../../../types";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Message } from "../../../../../shared/interfaces";

interface UserCardProps {
  user: {
    id: number;
    messages: Message[] | undefined;
    online: boolean;
  };
  recipient: number | undefined;
  token: string | null;
  changeReceiver: (id: number) => void;
}

function UserCard(props: UserCardProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    async function main() {
      const response = await getUsers([props.user.id], props.token);
      setUser(response[0]);
    }
    main();
  }, []);

  return (
    <Box
      sx={{ minWidth: 55 }}
      onClick={() => props.changeReceiver(props.user.id)}
    >
      {user && (
        <Stack alignItems="center">
          {props.user.online && (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "green",
                  color: "green",
                  boxShadow: `0 0 0 2px white`,
                },
              }}
            >
              <Avatar
                sx={{
                  boxShadow:
                    props.recipient === user.id
                      ? "0px 0px 4px 3px #719ac8"
                      : "none",
                }}
              />
            </Badge>
          )}
          {!props.user.online && <Avatar />}
          <Stack alignItems="center" spacing={-0.5}>
            <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
              {user.firstname}
            </Typography>
            <Typography sx={{ fontSize: 10, fontWeight: 600 }}>
              {user.lastname}
            </Typography>
          </Stack>
        </Stack>
      )}
      {!user && <Typography>Loading...</Typography>}
    </Box>
  );
}

export default UserCard;
