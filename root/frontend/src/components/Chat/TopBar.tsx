import React, { useEffect, useState } from "react";
import { Grid, Stack, Avatar, Typography, Box } from "@mui/material";
import { Clear } from "@mui/icons-material";
import { getUsers } from "../../ApiServices";
import { User } from "../../types";

interface TopBarProps {
  recipient: number | undefined;
}

function TopBar(props: TopBarProps) {
  const [recipient, setRecipient] = useState<User>();

  useEffect(() => {
    async function main() {
      if (props.recipient) {
        const response = await getUsers(
          [props.recipient],
          localStorage.getItem("token")
        );
        setRecipient(response[0]);
      }
    }
    main();
  }, [props.recipient]);

  return (
    <Grid container alignItems="center" sx={{ height: 54, padding: 1 }}>
      {recipient && (
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
            <Avatar alt="avatar" />
            <Stack spacing={-0.7}>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                {`${recipient.firstname} ${recipient.lastname}`}
              </Typography>
              <Typography sx={{ fontSize: 15, color: "90949C" }}>
                Aktywny(a)
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
      )}
      {!recipient && <Typography>Select user to chat with!</Typography>}
    </Grid>
  );
}

export default TopBar;
