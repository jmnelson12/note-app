import React from "react";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

function DrawerItem({ text, date, classes }) {
  return (
    <>
      <ListItem button dense className={classes.drawerItem}>
        <ListItemText
          primary={text}
          disableTypography
          className={classes.drawerTitle}
        />
        <ListItemText
          primary={date}
          disableTypography
          className={classes.drawerDate}
        />
      </ListItem>
      <Divider className={classes.divider} />
    </>
  );
}

export default DrawerItem;
