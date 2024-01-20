import Board from "../components/Board";

const RotaGame = () => {
  const handleCircleClick = (circleId: string): void => {
    console.log(`Circle ${circleId} was clicked!`);
  };

  return <Board onCircleClick={handleCircleClick} />;
};

export default RotaGame;
