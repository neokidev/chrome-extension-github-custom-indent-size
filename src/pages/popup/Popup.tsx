import React, { ChangeEvent, useEffect, useState } from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";

const Popup = () => {
  const [tabSize, setTabSize] = useState(8);
  const onChangeTabSize = (e: ChangeEvent<HTMLInputElement>) => {
    const newTabSize = Number(e.currentTarget.value);
    setTabSize(newTabSize);
    chrome.storage.sync.set({
      tabSize: newTabSize,
    });
  };

  useEffect(() => {
    chrome.storage.sync.get(
      {
        tabSize: 8,
      },
      (items) => {
        setTabSize(items.tabSize);
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <label>Tab size</label>
        <input
          type="number"
          value={tabSize}
          onChange={onChangeTabSize}
          min={1}
          max={8}
        />
      </header>
    </div>
  );
};

export default Popup;
