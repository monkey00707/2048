import React from "react";
import TryAgainLogo from "../assets/img/try-again.gif";

const GameOverlay = ({ onRestart, board }) => {
  if (!board) return null; // Ensure board is defined before accessing properties

  if (board.hasWon()) {
    return <div className="tile2048"></div>;
  }

  if (board.hasLost()) {
    return (
      <div className="gameOver" onClick={onRestart}>
        <img src={TryAgainLogo} alt="Try Again" className="try-again-img" />
      </div>
    );
  }

  return null;
};

export default GameOverlay;
