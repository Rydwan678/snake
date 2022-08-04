import React from "react";
import { Box, Stack, Avatar, Paper, Typography } from "@mui/material";
import { User } from "../../types";

interface UserCardProps {
  user: User;
}

function UserCard(props: UserCardProps) {
  return (
    <Box component={Paper} sx={{ padding: 2, height: "350px" }}>
      <Stack alignItems="center" spacing={2}>
        <Avatar
          alt={props.user.login}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFnG0huY6whcqQtmgJDP7XgSb8VCpmLUnKXw&usqp=CAU"
          sx={{ width: 80, height: 80 }}
        />
        <Typography variant="h5">
          {`${props.user.firstname ?? ""} ${props.user.lastname ?? ""}`}
        </Typography>
        <Typography sx={{ color: "gray" }}>
          {props.user.description ?? ""}
        </Typography>
      </Stack>
    </Box>
  );
}

export default UserCard;
