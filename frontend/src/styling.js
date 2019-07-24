import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    boxShadow: "none",
    backgroundImage:
      'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
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
    alignItems: "flex-start"
  },
  drawerTitle: {
    fontWeight: "bold"
  },
  drawerDate: {
    color: "#6E6E6E"
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerSearchWrapper: {
    height: "40px",
    boxShadow: "none",
    border: "1px solid #aeaeae"
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
    marginTop: "48px",
    resize: "none",
    border: "none"
  },
  root: {
    display: "flex",
    height: "100%"
  },
  searchIcon: {
    color: "#666"
  }
}));

export default useStyles;
