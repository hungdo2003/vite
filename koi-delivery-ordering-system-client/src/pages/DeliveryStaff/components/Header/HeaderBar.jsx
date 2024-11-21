import "./HeaderBar.scss";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Box,
  styled,
} from "@mui/material";
import { Image } from "antd";
const HeaderWrapper = styled(AppBar)`
  background-color: #1976d2;
`;
const HeaderBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <HeaderWrapper position="fixed" sx={{ width: "100vw" }}>
      <Toolbar>
        <div className="headerbar-container">
          <div className="logo">
            <Image src="./src/assets/logo.png" />
          </div>

          <div className="headerbar-left">
            <Button color="inherit">Home</Button>
            <Button color="inherit">About</Button>
            <Button color="inherit">Contact</Button>
          </div>

          <div className="headerbar-right">
            <Box sx={{ ml: 2 }}>
              <IconButton onClick={handleMenuOpen}>
                <Avatar alt="User-Avatar" src="/path-to-avatar.jpg" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
              </Menu>
            </Box>
          </div>
        </div>
      </Toolbar>
    </HeaderWrapper>
  );
};
export default HeaderBar;
