import React from "react";
import { Grid, Input, Box } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

function SearchBar() {
  const searchInputElement = (
    <Box
      sx={{
        transition: "ease-out, 300ms",
        width: "90%",
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
            "&:focus": {
              height: 200,
            },
          }}
          disableUnderline
          placeholder="Search for users"
          id="content"
          name="content"
        ></Input>
      </Grid>
    </Box>
  );

  return (
    <Grid
      container
      justifyContent="space-between"
      sx={{
        minWidth: 350,
        padding: 1,
      }}
    >
      {searchInputElement}
      <ExpandMore sx={{ fontSize: 30 }} />
    </Grid>
  );
}

export default SearchBar;
