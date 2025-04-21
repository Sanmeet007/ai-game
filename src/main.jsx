import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LevelContextProvider } from "./providers/LevelProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LevelContextProvider>
      <App />
    </LevelContextProvider>
  </React.StrictMode>
);
