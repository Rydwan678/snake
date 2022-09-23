import React from "react";
import { Snackbar, Alert, Box, Button, Stack, Typography } from "@mui/material";
import { AppContext, AppContextType } from "../context/app";

export default function SnackbarAlert() {
  const { alert, fn } = React.useContext(AppContext) as AppContextType;

  return (
    <Box>
      {!alert.inviteID && (
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={fn.handleAlertClose}
        >
          <Alert
            onClose={fn.handleAlertClose}
            severity={alert.type}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      )}
      {alert.inviteID && (
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={fn.handleAlertClose}
        >
          <Alert
            onClose={fn.handleAlertClose}
            severity="info"
            sx={{ width: "100%" }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography> {alert.message}</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  alert.inviteID && fn.acceptInvite(alert.inviteID);
                  fn.handleAlertClose();
                }}
              >
                JOIN
              </Button>
            </Stack>
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
