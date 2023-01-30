import React, { useState, useCallback } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import logo from "../../assets/img/icons/logo.png";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import HeaderMenu from "./HeaderMenu";
import ClosableDrawer from "./ClosableDrawer"
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'

const Header = () => {
  const navigate = useNavigate();
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const user = useAppSelector((state: RootState) => state.user.selectedUser)
  
  const handleDrawerToggle = useCallback(
    (event: any, isOpen: boolean) => {
      if (
        event.type === "keydown" &&
        (event.key === "Tab" || event.key === "Shift")
      ) {
        return;
      }
      setSideBarOpen(isOpen);
    },
    [setSideBarOpen]
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ bgColor: "#fff", color: "#444" }}>
        <Toolbar sx={{ m: "0 auto", maxWidth: 1024, width: "100%" }}>
          <img
            alt="logo"
            src={logo}
            width="128px"
            onClick={() => navigate('/')}
          />
          <p style={{ color: '#fff', marginLeft: '8px' }}>{user.username} さん こんにちは</p>
            <Box sx={{ m: "0 0 0 auto" }}>
              <HeaderMenu handleDrawerToggle={handleDrawerToggle} />
            </Box>
        </Toolbar>
      </AppBar>
      <ClosableDrawer 
        open={sideBarOpen} 
        onClose={handleDrawerToggle} 
        />
    </Box>
  );
};

export default Header;
