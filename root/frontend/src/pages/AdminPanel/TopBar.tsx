import React, { useState } from "react";
import { Stack, TextField, Box } from "@mui/material";
import { Search } from "@mui/icons-material";
import Menu from "./Menu";

interface TopBarProps {
  search: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  confirmDelete: () => void;
}

function TopBar(props: TopBarProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ padding: 2 }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Search sx={{ color: "#6e6e6e" }} />
        <TextField
          label="Search users"
          variant="outlined"
          size="small"
          onChange={(e) => props.search(e)}
        />
      </Stack>
      <Menu confirmDelete={props.confirmDelete} />
    </Stack>
  );
}

{
  /* <Menu id="menu" anchorEl={anchorElement} open={Boolean(anchorElement)}>
        <MenuItem onClick={closeMenu}>
          <DeleteOutline sx={{ color: "#6e6e6e" }} />
          DELETE
        </MenuItem>
      </Menu> */
}

export default TopBar;
