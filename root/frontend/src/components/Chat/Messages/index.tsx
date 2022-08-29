import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import MessageCard from "./MessageCard";
import { Message } from "../../../../../shared/interfaces";
import { useEffect } from "react";

interface MessagesProps {
  messages: Message[] | undefined;
  me: number | undefined;
  boxRef: React.RefObject<HTMLDivElement>;
}

function Messages(props: MessagesProps) {
  const messagesElement =
    props.me &&
    props.messages &&
    props.messages.map((message, index) => (
      <MessageCard message={message} me={props.me} key={index} />
    ));

  return (
    <Box sx={{ height: 342, overflow: "auto" }} ref={props.boxRef}>
      <Stack spacing={1} sx={{ padding: 1 }}>
        {props.messages && props.me ? (
          messagesElement
        ) : (
          <Typography>No messages</Typography>
        )}
      </Stack>
    </Box>
  );
}

export default Messages;
