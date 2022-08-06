import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Paper,
  Input,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import { ThumbUp, Clear } from "@mui/icons-material";
import { wrap } from "module";

interface Message {}

function Chat() {
  const ws = useRef<WebSocket | null>(null);

  const [messages, setMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/chat");
    ws.current.onopen = (e) => {
      console.log("open:", e);
    };

    ws.current.onclose = (e) => {
      console.log("close:", e);
    };

    ws.current.onmessage = (e) => {
      console.log("message:", e);
    };

    return () => {
      ws.current && ws.current.close();
    };
  }, []);

  function sendMessage() {}

  const senderMessage = (
    <Grid container sx={{ width: "100%" }} justifyContent="flex-end">
      <Grid
        sx={{
          borderRadius: 3,
          padding: 1,
          maxWidth: 200,
          backgroundColor: "primary.main",
        }}
      >
        <Typography
          color="white"
          sx={{ width: "100%", "overflow-wrap": "break-word" }}
        >
          Kiedy nowy film na kanał Horizon Border?
        </Typography>
      </Grid>
    </Grid>
  );

  const receiverMessage = (
    <Grid container sx={{ width: "100%" }}>
      <Box
        sx={{
          borderRadius: 3,
          padding: 1,
          maxWidth: 200,
          backgroundColor: "#E9EBEE",
        }}
        alignItems="center"
      >
        <Typography color="black">
          Już nigdy. Kończe z nagrywaniem filmów krótkometrażowych.
        </Typography>
      </Box>
    </Grid>
  );

  const inputElement = (
    <Box sx={{ width: 150 }}>
      <Grid
        container
        sx={{ backgroundColor: "#E9EBEE", borderRadius: 50 }}
        justifyContent="center"
      >
        <Input
          disableUnderline
          style={{ width: "80%", borderRadius: 50 }}
          placeholder="Aa"
        ></Input>
      </Grid>
    </Box>
  );

  const topBar = (
    <Grid container alignItems="center" sx={{ height: 54, padding: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100%", width: "100%" }}
        spacing={1}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ "&:hover": { backgroundColor: "#E9EBEE" } }}
        >
          <Avatar
            alt="avatar"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFnG0huY6whcqQtmgJDP7XgSb8VCpmLUnKXw&usqp=CAU"
          />
          <Stack spacing={-0.7}>
            <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
              Bartosz Kasperek
            </Typography>
            <Typography sx={{ fontSize: 15, color: "90949C" }}>
              Aktywny(a) 30 minut temu
            </Typography>
          </Stack>
        </Stack>
        <Box
          sx={{
            "&:hover": { backgroundColor: "#E9EBEE" },
            padding: 0.5,
            borderRadius: 50,
          }}
        >
          <Clear />
        </Box>
      </Stack>
    </Grid>
  );
  const messagesField = (
    <Box sx={{ height: 342 }}>
      <Stack spacing={1} sx={{ padding: 2 }}>
        {senderMessage}
        {receiverMessage}
      </Stack>
    </Box>
  );
  const bottomBar = (
    <Grid
      container
      justifyContent="flex-end"
      alignItems="center"
      sx={{ height: 54, padding: 1 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{ height: "90%" }}
        spacing={1}
      >
        {inputElement}
        <Box
          sx={{
            "&:hover": { backgroundColor: "#E9EBEE" },
            padding: 0.5,
            borderRadius: 50,
          }}
        >
          <ThumbUp color="primary" />
        </Box>
      </Stack>
    </Grid>
  );

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 20,
        left: 20,
        height: 450,
        minWidth: 350,
      }}
      component={Paper}
    >
      {topBar}
      <Divider />
      {messagesField}
      <Divider />
      {bottomBar}
    </Box>
  );
}

export default Chat;
