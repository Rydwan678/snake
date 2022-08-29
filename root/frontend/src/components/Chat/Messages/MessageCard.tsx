import React from "react";
import { Grid, Box, Typography, Stack, Avatar } from "@mui/material";
import { Message } from "../../../../../shared/interfaces";
import { CheckOutlined } from "@mui/icons-material";

interface MessageProps {
  message: Message;
  me: number | undefined;
}

export default function MessageCard(props: MessageProps) {
  const recipientMessage = (
    <Grid container sx={{ width: "100%" }} alignItems="center">
      <Stack direction="row" alignItems="center" spacing={0.7}>
        <Avatar sx={{ height: 28, width: 28 }} />
        <Box
          sx={{
            borderRadius: 3,
            padding: 1,
            maxWidth: 200,
            backgroundColor: "#E9EBEE",
          }}
        >
          <Typography
            color="black"
            sx={{ width: "100%", overflowWrap: "break-word" }}
          >
            {props.message.content}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );

  const meMessage = (
    <Grid
      container
      sx={{ width: "100%" }}
      justifyContent="flex-end"
      alignItems="flex-end"
    >
      <Stack direction="row" alignItems="flex-end" spacing={0.7}>
        <Grid
          sx={{
            borderRadius: 3,
            padding: 1,
            maxWidth: 200,
            backgroundColor: "primary.main",
            transition: "opacity 0.5s",
          }}
        >
          <Typography
            color="white"
            sx={{ width: "100%", overflowWrap: "break-word" }}
          >
            {props.message.content}
          </Typography>
        </Grid>
        {!props.message.read && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              height: 14,
              width: 14,
              border: "2px solid #bcbec2",
              borderRadius: 50,
              backgroundColor: props.message.recieved ? "#bcbec2" : "white",
            }}
          >
            {props.message.sent && (
              <CheckOutlined
                sx={{
                  height: 10,
                  width: 10,
                  color: props.message.recieved ? "white" : "#bcbec2",
                }}
              />
            )}
          </Grid>
        )}
        {props.message.read && <Avatar sx={{ height: 14, width: 14 }} />}
      </Stack>
    </Grid>
  );

  return props.message.from === props.me ? meMessage : recipientMessage;
}
