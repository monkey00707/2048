import React, { useState, useEffect, useCallback } from "react";
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import GameOverlay from "./GameOverlay";
import useEvent from "../hooks/useEvent";

const BoardView = () => {
  const [board, setBoard] = useState(() => new Board());

  const handleKeyDown = useCallback(
    (event) => {
      if (board.hasWon()) return;
      if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(event.key)) {
        const direction = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3 }[event.key];
  
        setBoard((prevBoard) => {
          const newBoard = new Board();
          Object.assign(newBoard, prevBoard); // Preserve existing board state
          newBoard.move(direction);
          return newBoard;
        });
      }
    },
    [board]
  );

  useEvent("keydown", handleKeyDown);

  return (
    <div>
      <div className="details-box">
        <button className="resetButton" onClick={() => setBoard(new Board())}>New Game</button>
        <div className="score-box">
          <div className="score-header">SCORE</div>
          <div>{board.score}</div>
        </div>
      </div>
      <div className="board">
        {board.cells.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((_, colIndex) => (
              <Cell key={`${rowIndex}-${colIndex}`} />
            ))}
          </div>
        ))}
        {board.tiles
          .filter((tile) => tile.value !== 0)
          .map((tile, index) => (
            <Tile tile={tile} key={index} />
          ))}
        <GameOverlay onRestart={() => setBoard(new Board())} board={board} />
      </div>
    </div>
  );
};

export default BoardView;
