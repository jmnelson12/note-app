import React from "react";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";

function Navbar({ open, handleDrawerOpen, classes, setIsDarkTheme }) {
  return (
    <AppBar
      position="fixed"
      color={"inherit"}
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open
      })}
      onClick={() => {
        setIsDarkTheme(true);
      }}
    >
      <Toolbar variant="dense">
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        {/* <Typography variant="h6" noWrap>
          User/Guest Menu
        </Typography> */}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
