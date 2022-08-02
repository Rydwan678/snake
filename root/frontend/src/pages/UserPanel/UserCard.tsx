import React from "react";
import { Container, Stack, Avatar, Paper, Typography } from "@mui/material";
import { User } from "../../types";

interface UserCardProps {
  user: User;
}

function UserCard(props: UserCardProps) {
  return (
    <Container component={Paper} sx={{ padding: 2, height: 300 }}>
      <Stack alignItems="center" spacing={2}>
        <Avatar
          alt={props.user.login}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFnG0huY6whcqQtmgJDP7XgSb8VCpmLUnKXw&usqp=CAU"
          sx={{ width: 80, height: 80 }}
        />
        <Typography variant="h5">
          {`${props.user.firstName ?? "John"} ${props.user.lastName ?? "Doe"}`}
        </Typography>
        <Typography sx={{ color: "gray" }}>User description</Typography>
        <Typography sx={{ color: "gray" }}>User Address</Typography>
      </Stack>
    </Container>
  );
}

export default UserCard;
