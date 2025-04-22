import { useEffect } from "react";
import LogoText from "./LogoText";

const GameLoader = () => {
  useEffect(() => {
    const gameLoader = document.querySelector(".game-loader");
    const gameLoaderContainer = gameLoader?.querySelector(
      ".game-loader-container"
    );

    if (gameLoader && gameLoader.classList.contains("visible")) {
      setTimeout(() => {
        gameLoaderContainer.classList.add("hidden");
        gameLoader.classList.remove("visible");
      }, 1200);
    }
  }, []);
  return (
    <>
      <div className="game-loader visible">
        <div className="game-loader-container">
          <LogoText height={60} width={200} />
          <div className="loading-bar"></div>
        </div>
      </div>
    </>
  );
};

export default GameLoader;
