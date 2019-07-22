import React, { useState } from "react";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import showdown from "showdown";

const converter = new showdown.Converter();

// material ui - paper
function Notepad({ open, classes }) {
  const [text, setText] = useState("");

  function handleTextChange(e) {
    setText(e.target.value);
  }

  return (
    <textarea
      className={clsx(
        classes.content,
        {
          [classes.contentShift]: open
        },
        classes.textArea
      )}
      autoFocus={true}
      value={text}
      onChange={handleTextChange}
    />
  );
}

export default Notepad;
