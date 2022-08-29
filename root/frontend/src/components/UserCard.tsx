import React from "react";
import { Box, Stack, Grid, Avatar, Paper, Typography } from "@mui/material";
import { User } from "../types";
import { Message } from "@mui/icons-material";

type Type = "adminPanel" | "userPanel";

interface UserCardProps {
  user: User;
  type: Type;
}

function UserCard(props: UserCardProps) {
  return (
    <Box
      component={Paper}
      sx={{
        padding: 2,
        height: "350px",
      }}
    >
      <Stack
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "100%" }}
      >
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
        <Grid
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "primary.main",
            padding: 1,
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={1}>
            <Typography sx={{ color: "white", userSelect: "none" }}>
              Send message
            </Typography>
            <Message sx={{ color: "white" }} />
          </Stack>
        </Grid>
      </Stack>
    </Box>
  );
}

export default UserCard;
