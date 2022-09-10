import React, { useRef, useState } from "react";
import { Box, Stack, Paper, Divider } from "@mui/material";
import SearchBar from "./SearchBar";
import Users from "./Users";
import TopBar from "./TopBar";
import Messages from "./Messages";
import BottomBar from "./BottomBar";
import { AppContext, AppContextType } from "../../context/app";

function Chat() {
  const [content, setContent] = useState<string>();

  function updateContent(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setContent(e.target.value);
  }

  const { users, me, recipient, fn } = React.useContext(
    AppContext
  ) as AppContextType;

  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <Stack
      sx={{ position: "absolute", bottom: 20, left: 20 }}
      component={Paper}
    >
      <SearchBar />
      {users && users.length > 2 && me && <Users />}
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
            content && fn.sendMessage(content);
            boxRef.current &&
              (boxRef.current.scrollTop = boxRef.current.scrollHeight);
          }}
        />
      </Box>
    </Stack>
  );
}

export default Chat;
