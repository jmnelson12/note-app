import React, { useState } from "react";
import clsx from "clsx";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

function Notepad({ open, classes }) {
  const [value, setValue] = useState("**Hello world!!!**");
  const [selectedTab, setSelectedTab] = useState("write");
  const [timeoutId, setTimeoutId] = useState("null");

  function handleChange(val) {
    setValue(val);

    if (timeoutId) setTimeoutId(clearTimeout(timeoutId));

    setTimeoutId(
      setTimeout(function() {
        console.log("auto saved");
      }, 5000)
    );
  }

  return (
    <ReactMde
      value={value}
      onChange={handleChange}
      selectedTab={selectedTab}
      onTabChange={setSelectedTab}
      generateMarkdownPreview={markdown =>
        Promise.resolve(converter.makeHtml(markdown))
      }
      className={clsx(
        classes.content,
        {
          [classes.contentShift]: open
        },
        classes.textArea
      )}
    />
  );
}

export default Notepad;
