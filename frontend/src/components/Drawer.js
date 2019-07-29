import React from "react";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import DrawerItem from "./DrawerItem";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import Paper from "@material-ui/core/Paper";

function DrawerLeft({ open, handleDrawerClose, classes }) {
  return (
    <>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <Paper className={classes.drawerSearchWrapper}>
            <IconButton size={"small"} disabled aria-label="Search">
              <SearchIcon className={classes.searchIcon} />
            </IconButton>
            <InputBase
              className={classes.drawerSearch}
              placeholder="Search"
              inputProps={{ "aria-label": "Search" }}
            />
          </Paper>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {[
            "This is a line.",
            "TODO",
            "The joy is in the journey",
            "Movies & Books",
            "Organize & Backup",
            '"Two roads diverged in a ..."'
          ].map((text, index) => (
            <DrawerItem
              key={index}
              text={text}
              date={"7/23/19"}
              classes={classes}
            />
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default DrawerLeft;
