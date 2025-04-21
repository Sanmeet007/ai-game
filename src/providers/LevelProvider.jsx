import { createContext, useContext, useState } from "react";

const LevelContext = createContext(null);
export const useLevelContext = () => {
  const context = useContext(LevelContext);
  if (!context) {
    throw new Error(
      "useLevelContext must be used within a LevelContextProvider"
    );
  }
  return context;
};
export const LevelContextProvider = ({ children }) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  return (
    <LevelContext.Provider value={{ currentLevel, setCurrentLevel }}>
      {children}
    </LevelContext.Provider>
  );
};
