import React from "react";
import { Grid, Stack, Box, Input } from "@mui/material";
import { ThumbUp, Send } from "@mui/icons-material";

interface BottomBarProps {
  content: string | undefined;
  updateContent: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  sendMessage: () => void;
}

function BottomBar(props: BottomBarProps) {
  const sendInputElement = (
    <Box
      sx={{
        transition: "ease-out, 300ms",
        width: 150,
      }}
    >
      <Grid
        container
        sx={{ backgroundColor: "#E9EBEE", borderRadius: 50 }}
        justifyContent="center"
      >
        <Input
          sx={{
            width: "80%",
            borderRadius: 50,
          }}
          disableUnderline
          placeholder="Aa"
          id="content"
          name="content"
          onChange={(e) => props.updateContent(e)}
          onKeyDown={(e) => e.key === "Enter" && props.sendMessage()}
        ></Input>
      </Grid>
    </Box>
  );

  return (
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
        {sendInputElement}
        <Box
          sx={{
            "&:hover": { backgroundColor: "#E9EBEE" },
            padding: 0.5,
            borderRadius: 50,
          }}
        >
          {!props.content || props.content.length < 1 ? (
            <ThumbUp color="primary" />
          ) : (
            <Send color="primary" onClick={props.sendMessage} />
          )}
        </Box>
      </Stack>
    </Grid>
  );
}

export default BottomBar;
