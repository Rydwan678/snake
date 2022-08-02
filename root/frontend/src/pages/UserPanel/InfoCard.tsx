import React from "react";
import {
  Container,
  Stack,
  Box,
  Paper,
  Table,
  TableRow,
  TableCell,
  Typography,
} from "@mui/material";
import { User } from "../../types";

interface InfoCardProps {
  user: User;
}

function InfoCard(props: InfoCardProps) {
  return (
    <Container sx={{ padding: 2, height: 300 }} component={Paper}>
      {props.user && (
        <Stack spacing={2}>
          <Table>
            <TableRow>
              <TableCell>
                <Typography>Login</Typography>
              </TableCell>
              <TableCell>{props.user.login}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Name</Typography>
              </TableCell>
              <TableCell>{`${props.user.firstName ?? ""} ${
                props.user.lastName ?? ""
              }`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>Email</Typography>
              </TableCell>
              <TableCell>{props.user.email}</TableCell>
            </TableRow>
          </Table>
        </Stack>
      )}
    </Container>
  );
}

export default InfoCard;
