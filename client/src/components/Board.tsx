import React from "react";

import "../styles/Rota.css"; // Make sure to create a corresponding CSS file
import { mapCirclesToNumbers } from "../components/CommonFunctions";

interface BoardProps {
  onCircleClick: (circleId: string) => void;
  clickedCircles: string[];
  currentPlayer: string; // "White" or "Black"
  currentCounter: number;
  showMoves: boolean;
}

const Board: React.FC<BoardProps> = ({
  onCircleClick,
  clickedCircles,
  currentPlayer,
  currentCounter,
  showMoves,
}) => {
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

  const getCircleCounterPlacement = (circleId: string): string => {
    // If it's White's turn, make the background white; otherwise, make it black

    const counterIndex = mapCirclesToNumbers(circleId);

    if (clickedCircles[counterIndex] === "White") {
      return `url("src/assets/tile_white.png")`;
    } else if (clickedCircles[counterIndex] === "Black") {
      return `url("src/assets/tile_black.png")`;
    } else {
      return "";
    }
  };

  const getCircleAvailableMove = (
    circleId: string,
    currentCounter: number
  ): string => {
    const counterIndex = mapCirclesToNumbers(circleId);
    console.log(currentCounter);

    if (
      clickedCircles[counterIndex] === "false" &&
      (currentCounter > 0 || showMoves === true)
    ) {
      return `aqua`;
    }
    return "black";
  };

  return (
    <>
      <div className="wheel-container">
        <div className="wheel">
          {circles.map((circle) => (
            <div
              key={circle}
              className={`circle ${circle}`}
              style={{
                content: getCircleCounterPlacement(circle),
                borderColor: getCircleAvailableMove(circle, currentCounter),
                borderWidth: `6px`,
              }}
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
