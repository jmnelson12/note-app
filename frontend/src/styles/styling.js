import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    boxShadow: "none",
    border: "none"
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  divider: {
    width: "90%",
    margin: "0 auto"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  drawerItem: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "flex-start !important"
  },
  drawerTitle: {
    fontWeight: "bold"
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerSearchWrapper: {
    height: "32px",
    border: "1px solid"
  },
  drawerSearch: {
    marginLeft: 8,
    flex: 1,
    height: "100%"
  },
  hide: {
    display: "none"
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  textArea: {
    height: `calc(100% - 48px)`,
    marginTop: "48px !important",
    resize: "none",
    border: "none",
    padding: "0"
  },
  root: {
    display: "flex",
    height: "100%",
    overflowY: "auto"
  },
  searchIcon: {
    color: "#666",
    fontSize: "1.5rem",
    marginTop: "-2px"
  }
}));

export default useStyles;
