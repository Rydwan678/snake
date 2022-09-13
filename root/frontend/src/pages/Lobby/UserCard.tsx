import React, { useEffect, useState } from "react";
import { Box, Stack, Typography, Avatar, Button } from "@mui/material";
import { getUsers } from "../../ApiServices";
import { User } from "../../types";

interface UserCardProps {
  userID: number;
}

function UserCard(props: UserCardProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    async function getUser() {
      try {
        const response = await getUsers(
          [props.userID],
          localStorage.getItem("token")
        );
        setUser(response[0]);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);

  return (
    <Box>
      {user && (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar />
              <Typography>{user.login}</Typography>
            </Stack>
          </Stack>
        </Box>
      )}
    </Box>
  );
}

export default UserCard;
