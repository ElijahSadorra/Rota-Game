import Board from "../components/Board";
import { useLocation } from "react-router-dom";

const RotaGame = () => {
  const location = useLocation();
  const { opponentId, playerColor, playerName } = location.state || {}; // Ensure state exists, or default to empty object

  const handleCircleClick = (circleId: string): void => {
    console.log(
      `Circle ${circleId} was clicked by  ${playerName} and his color is  ${playerColor}`
    );
  };

  return <Board onCircleClick={handleCircleClick} />;
};

export default RotaGame;
