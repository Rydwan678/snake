import React from "react";
import {
  Container,
  Box,
  Stack,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { User, Change, Changes } from "../../types";

interface InfoCardProps {
  user: User;
  changes: Changes | null;
  getChanges: (changeKey: Change, changeValue: string) => void;
}

function InfoCard(props: InfoCardProps) {
  function setChanges(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    changeKey: Change
  ) {
    props.getChanges(changeKey, e.target.value);
  }

  return (
    <Box sx={{ padding: 2, height: "350px" }} component={Paper}>
      {props.user && (
        <Stack component="form" spacing={2}>
          <Stack>
            <Typography>Account name</Typography>
            <TextField
              value={
                props.changes ? props.changes.login : props.user.login ?? ""
              }
              name="login"
              id="login"
              onChange={(e) => setChanges(e, "login")}
            ></TextField>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack>
              <Typography>First name</Typography>
              <TextField
                value={
                  props.changes
                    ? props.changes.firstname
                    : props.user.firstname ?? ""
                }
                name="firstName"
                id="firstName"
                onChange={(e) => setChanges(e, "firstname")}
              ></TextField>
            </Stack>
            <Stack>
              <Typography>Last name</Typography>
              <TextField
                value={
                  props.changes
                    ? props.changes.lastname
                    : props.user.lastname ?? ""
                }
                name="lastName"
                id="lastName"
                onChange={(e) => setChanges(e, "lastname")}
              ></TextField>
            </Stack>
          </Stack>
          <Stack>
            <Typography>Description</Typography>
            <TextField
              value={
                props.changes
                  ? props.changes.description
                  : props.user.description ?? ""
              }
              name="description"
              id="description"
              onChange={(e) => setChanges(e, "description")}
              multiline
              rows={4}
            ></TextField>
          </Stack>
        </Stack>
      )}
    </Box>
  );
}

export default InfoCard;
