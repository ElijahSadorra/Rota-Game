import React from "react";

import "../styles/Rota.css"; // Make sure to create a corresponding CSS file
import { mapCirclesToNumbers } from "../components/CommonFunctions";

// Interface for calling the component
interface BoardProps {
  onCircleClick: (circleId: string) => void;
  clickedCircles: string[];
  currentCounter: number;
  showMoves: boolean;
  showMatch: boolean;
  currentPlayer: string;
}

// The component
const Board: React.FC<BoardProps> = ({
  onCircleClick,
  clickedCircles,
  currentCounter,
  showMoves,
  showMatch,
  currentPlayer,
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

  // A function to replace the rota wheel board with the coressponding color
  const getCircleCounterPlacement = (circleId: string): string => {
    const counterIndex = mapCirclesToNumbers(circleId);

    // If it's White's turn, make the background white; otherwise, make it black
    if (clickedCircles[counterIndex] === "White") {
      return `url("src/assets/tile_white.png")`;
    } else if (clickedCircles[counterIndex] === "Black") {
      return `url("src/assets/tile_black.png")`;
    } else {
      return "";
    }
  };

  // A function to get all available moves and highlight them aqua
  const getCircleAvailableMove = (
    circleId: string,
    currentCounter: number
  ): string => {
    const counterIndex = mapCirclesToNumbers(circleId);
    //console.log(currentCounter);
    console.log(currentPlayer + " " + showMatch);

    if (
      clickedCircles[counterIndex] === "false" &&
      (currentCounter > 0 || showMoves === true) &&
      showMatch === false
    ) {
      return `aqua`;
    } else if (
      clickedCircles[counterIndex] === currentPlayer &&
      showMatch === true
    ) {
      return `green`;
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
