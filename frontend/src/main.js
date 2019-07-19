import React, { useState, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "./context/theme";
import { UserProvider } from "./context/user";
import { NotesProvider } from "./context/notes";
import {
  getFromStorage,
  removeFromStorage,
  token_key,
  notes_key
} from "./utils/storage";

import "./styles/main.css";

const Drawer = React.lazy(() => import("./components/Drawer"));
const Content = React.lazy(() => import("./components/Content"));

function Main() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userNotes, setuserNotes] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    type: "guest"
  });

  useEffect(() => {
    // verify
    const token = getFromStorage(token_key);
    const notes = getFromStorage(notes_key);
  }, []);

  return (
    <Suspense fallback={<div className="global-loader">Loading...</div>}>
      <ThemeProvider defaultTheme={"light"}>
        <div className="Main">
          <UserProvider loggedIn={userLoggedIn} user={userData}>
            <NotesProvider notes={userNotes}>
              <Drawer />
              <Content />
            </NotesProvider>
          </UserProvider>
        </div>
      </ThemeProvider>
    </Suspense>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
