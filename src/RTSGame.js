import React, { useState, useEffect } from 'react';
import './RTSGame.css';

const BOARD_SIZE = 5;
const SQUARE_SIZE = 50;

const RTSGame = () => {
  const [unitPosition, setUnitPosition] = useState({ row: 0, col: 0 });
  const [targetPosition, setTargetPosition] = useState(null);

  useEffect(() => {
    if (targetPosition) {
      const moveUnit = () => {
        const deltaRow = targetPosition.row - unitPosition.row;
        const deltaCol = targetPosition.col - unitPosition.col;

        if (deltaRow === 0 && deltaCol === 0) {
          setTargetPosition(null);
          return;
        }

        const nextRow = unitPosition.row + Math.sign(deltaRow);
        const nextCol = unitPosition.col + Math.sign(deltaCol);
        setUnitPosition({ row: nextRow, col: nextCol });
      };

      const timer = setInterval(moveUnit, 300);
      return () => clearInterval(timer);
    }
  }, [unitPosition, targetPosition]);

  const handleSquareClick = (row, col) => {
    setTargetPosition({ row, col });
  };

  return (
    <div className="rts-game-board" style={{ width: BOARD_SIZE * SQUARE_SIZE, height: BOARD_SIZE * SQUARE_SIZE }}>
      {Array.from({ length: BOARD_SIZE }).map((_, rowIndex) => (
        <div key={rowIndex} className="rts-row">
          {Array.from({ length: BOARD_SIZE }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="rts-square"
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            ></div>
          ))}
        </div>
      ))}
      <div
        className="rts-unit"
        style={{
          top: unitPosition.row * SQUARE_SIZE,
          left: unitPosition.col * SQUARE_SIZE,
          transition: 'top 0.3s, left 0.3s',
        }}
      ></div>
    </div>
  );
};

export default RTSGame;
