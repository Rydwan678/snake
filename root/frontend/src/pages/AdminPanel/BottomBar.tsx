import React from "react";
import {
  Stack,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { NavigateNext, NavigateBefore } from "@mui/icons-material";
import { Way, TableType } from "../../types";

interface BottomBarProps {
  changeTable: (e: SelectChangeEvent) => void;
  changePage: (way: Way) => void;
  page: number;
  pages: number;
  table: TableType;
}

function BottomBar(props: BottomBarProps) {
  const navigationElement = (
    <Stack direction="row" alignItems="center">
      {props.page > 1 && (
        <NavigateBefore
          sx={{ color: "black", fontSize: 30 }}
          onClick={
            props.page < props.pages
              ? () => props.changePage("previous")
              : () => {}
          }
        />
      )}
      <Typography sx={{ fontSize: 25 }}>{props.page}</Typography>
      {props.page < props.pages && (
        <NavigateNext
          sx={{ color: "black", fontSize: 30 }}
          onClick={
            props.page < props.pages ? () => props.changePage("next") : () => {}
          }
        />
      )}
    </Stack>
  );

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={3}
      sx={{ padding: 2 }}
    >
      <Stack direction="row" spacing={3}>
        <Link to="/">
          <Button variant="contained">BACK</Button>
        </Link>
      </Stack>
      {props.table === "pages" && navigationElement}
      <Select
        sx={{ maxHeight: 40 }}
        defaultValue={"virtual"}
        onChange={(e) => props.changeTable(e)}
      >
        <MenuItem value={"virtual"}>Virtualized</MenuItem>
        <MenuItem value={"pages"}>Pages</MenuItem>
      </Select>
    </Stack>
  );
}

export default BottomBar;
