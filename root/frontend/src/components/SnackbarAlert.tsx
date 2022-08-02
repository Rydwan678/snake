import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { Alert as AlertType } from "../types";

interface SnackbarAlertProps {
  alert: AlertType;
  close: () => void;
}

export default function SnackbarAlert(props: SnackbarAlertProps) {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    props.close();
  };

  return (
    <Snackbar
      open={props.alert.open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={props.alert.type}
        sx={{ width: "100%" }}
      >
        {props.alert.message}
      </Alert>
    </Snackbar>
  );
}
