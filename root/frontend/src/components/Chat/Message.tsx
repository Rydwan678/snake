import React from "react";
import { Grid, Box, Typography } from "@mui/material";

type Type = "send" | "receive";

interface MessageProps {
  type: Type;
}

function Message(props: MessageProps) {
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

  return props.type === "send" ? senderMessage : receiverMessage;
}

export default Message;
