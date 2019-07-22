import React from "react";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

function DrawerItem({ text, date }) {
  return (
    <>
      <ListItem button>
        <ListItemText primary={text} />
        <ListItemText primary={date} />
      </ListItem>
      <Divider />
    </>
  );
}

export default DrawerItem;
