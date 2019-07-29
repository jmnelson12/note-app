import React, { useState, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { UserProvider } from "./context/user";
import { NotesProvider } from "./context/notes";
import {
  getFromStorage,
  removeFromStorage,
  token_key,
  notes_key
} from "./utils/storage";
import useStyles from "./styles/styling";
import useAppTheme from "./styles/appTheme";
import "./styles/main.css";

const Drawer = React.lazy(() => import("./components/Drawer"));
const Navbar = React.lazy(() => import("./components/Navbar"));
const Notepad = React.lazy(() => import("./components/Notepad"));

function Main() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userNotes, setuserNotes] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    type: "guest"
  });
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const theme = useAppTheme({ isDarkTheme });
  const classes = useStyles();

  useEffect(() => {
    // verify
    const token = getFromStorage(token_key);
    const notes = getFromStorage(notes_key);
  }, []);

  function handleDrawerOpen() {
    setDrawerOpen(true);
  }
  function handleDrawerClose() {
    setDrawerOpen(false);
  }
  function handleKeydown(e) {
    let charCode = String.fromCharCode(e.which).toLowerCase();
    if (e.ctrlKey && charCode === "s") {
      e.preventDefault();
    }
  }

  return (
    <Suspense fallback={<div className="global-loader">Loading...</div>}>
      <ThemeProvider theme={theme}>
        <div className="Main" onKeyDown={handleKeydown}>
          <UserProvider loggedIn={userLoggedIn} user={userData}>
            <Navbar
              open={drawerOpen}
              handleDrawerOpen={handleDrawerOpen}
              classes={classes}
              setIsDarkTheme={setIsDarkTheme}
              isDarkTheme={isDarkTheme}
            />
            <NotesProvider notes={userNotes}>
              <div className={classes.root}>
                <Drawer
                  open={drawerOpen}
                  handleDrawerClose={handleDrawerClose}
                  classes={classes}
                />
                <Notepad open={drawerOpen} classes={classes} />
              </div>
            </NotesProvider>
          </UserProvider>
        </div>
      </ThemeProvider>
    </Suspense>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
