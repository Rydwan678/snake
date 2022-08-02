import * as React from "react";
import { Menu, MenuItem, Box } from "@mui/material";
import { MenuOutlined, DeleteOutline } from "@mui/icons-material";

interface MenuProps {
  confirmDelete: () => void;
}

export default function PositionedMenu(props: MenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Box
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuOutlined
          sx={{
            color: "#6e6e6e",
            "&:hover": { color: "black" },
          }}
        />
      </Box>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            props.confirmDelete();
          }}
        >
          <DeleteOutline />
          DELETE
        </MenuItem>
      </Menu>
    </div>
  );
}
