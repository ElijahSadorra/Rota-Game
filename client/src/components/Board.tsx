import React from "react";

import "../styles/Rota.css"; // Make sure to create a corresponding CSS file

interface BoardProps {
  onCircleClick: (circleId: string) => void;
}

const Board: React.FC<BoardProps> = ({ onCircleClick }) => {
  const circles = [
    "center",
    "top",
    "top-right",
    "right",
    "bottom-right",
    "bottom",
    "bottom-left",
    "left",
    "top-left",
  ];

  return (
    <>
      <div className="wheel-container">
        <div className="wheel">
          {circles.map((circle) => (
            <div
              key={circle}
              className={`circle ${circle}`}
              onClick={() => onCircleClick(circle)}
              role="button"
              tabIndex={0}
              aria-label={`Click on circle ${circle}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default Board;
