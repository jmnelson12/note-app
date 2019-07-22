import React, { createContext, useState } from "react";
const { Provider, Consumer } = createContext();

const NotesProvider = ({ children, notes }) => {
  const [selectedNote, setSelectedNote] = useState(null);
  const [userNotes, setUserNotes] = useState(notes);

  return (
    <Provider
      value={{
        selectedNote,
        setSelectedNote,
        userNotes,
        setUserNotes
      }}
    >
      {children}
    </Provider>
  );
};

export { NotesProvider };

// making this default because it will be used most
export default Consumer;
