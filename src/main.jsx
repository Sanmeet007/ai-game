import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { LevelContextProvider } from "./providers/LevelProvider";
import GameLoader from "./components/GameLoader";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LevelContextProvider>
      <GameLoader />
      <App />
    </LevelContextProvider>
  </React.StrictMode>
);
