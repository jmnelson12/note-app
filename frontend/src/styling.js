import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 320;

const useStyles = makeStyles(theme => ({
    appBar: {
        transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        boxShadow: "none"
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
    drawerPaper: {
        width: drawerWidth
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
        resize: "none"
    },
    root: {
        display: "flex",
        height: "100%"
    }
}));

export default useStyles;
