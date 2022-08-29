import React, { useRef } from "react";
import { Box, Stack, Paper, Divider } from "@mui/material";
import SearchBar from "./SearchBar";
import Users from "./Users";
import TopBar from "./TopBar";
import Messages from "./Messages";
import BottomBar from "./BottomBar";
import useChat from "./useChat";
import { useEffect } from "react";

function Chat() {
  const {
    users,
    me,
    recipient,
    changeRecipient,
    content,
    updateContent,
    sendMessage,
  } = useChat();

  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  useEffect(() => {
    console.log("me", me);
  }, [me]);

  useEffect(() => {
    console.log("recipient", recipient);
  }, [recipient]);

  return (
    <Stack
      sx={{ position: "absolute", bottom: 20, left: 20 }}
      component={Paper}
    >
      <SearchBar />
      {users && users.length > 2 && me && (
        <Users
          users={users}
          me={me}
          recipient={recipient}
          token={localStorage.getItem("token")}
          changeRecipient={changeRecipient}
        />
      )}
      <Divider />
      <Box
        sx={{
          height: 450,
          minWidth: 350,
        }}
      >
        <TopBar recipient={recipient} />
        <Divider />
        {recipient && users && (
          <Messages
            messages={
              users[users.findIndex((user) => user.id === recipient)].messages
            }
            me={me}
            boxRef={boxRef}
          />
        )}
        <Divider />
        <BottomBar
          content={content}
          updateContent={updateContent}
          sendMessage={() => {
            sendMessage();
            boxRef.current &&
              (boxRef.current.scrollTop = boxRef.current.scrollHeight);
          }}
        />
      </Box>
    </Stack>
  );
}

export default Chat;
