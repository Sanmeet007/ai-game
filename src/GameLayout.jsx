const GameLayout = ({ sideComponent, children }) => {
  return (
    <>
      <div className="game-wrapper">
        <div className="side-component">{sideComponent}</div>
        <div className="main-component">{children}</div>
      </div>
    </>
  );
};

export default GameLayout;
