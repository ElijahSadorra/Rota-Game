import { useState, useEffect } from "react";
import Board from "../components/Board";
import { useLocation } from "react-router-dom";
import { mapCirclesToNumbers } from "../components/CommonFunctions";
import "../styles/RotaGame.css";
import socket from "../components/SocketManager"; // Import the socket instance

interface GameState {
  board: string[];
  currentPlayer: string;
  winner: string | null;
  clickedCircles: string[];
  counterLeft: number;
  showMoves: boolean;
  currentClicked: string;
}

const RotaGame = () => {
  const location = useLocation();
  const { opponentId, playerColor, playerName, currentPlayerTurn } =
    location.state || {}; // Ensure state exists, or default to empty object

  let opponentColor: string;
  if (playerColor === "White") {
    opponentColor = "Black";
  } else {
    opponentColor = "White";
  }

  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(""),
    currentPlayer: currentPlayerTurn,
    winner: null,
    clickedCircles: Array(9).fill("false"),
    counterLeft: 6,
    showMoves: false,
    currentClicked: "",
  });

  useEffect(() => {
    socket.on("begin game", (gameData) => {
      // Initialize the game state with data received from the server
      setGameState({
        board: Array(9).fill(""),
        currentPlayer: gameData.currentPlayerTurn,
        winner: null,
        clickedCircles: Array(9).fill("false"),
        counterLeft: 6,
        showMoves: false,
        currentClicked: "",
      });
    });

    socket.on("updateMove", (moveData) => {
      // Handle the opponent's move
      const { circleId } = moveData;

      // Update the game state based on the received move data
      const circleIndex = mapCirclesToNumbers(circleId);
      const updatedClickedCircles = [...gameState.clickedCircles];

      if (moveData.nextPlayer === "White") {
        updatedClickedCircles[circleIndex] = "Black";
      } else {
        updatedClickedCircles[circleIndex] = "White";
      }

      console.log(gameState.counterLeft);

      setGameState((prevState) => ({
        ...prevState,
        clickedCircles: updatedClickedCircles,
        currentPlayer: moveData.nextPlayer,
        counterLeft: gameState.counterLeft - 1,
      }));

      console.log(gameState);
    });

    socket.on("update move counter", (data) => {
      const { oldPosition, newPosition } = data;

      const oldIndex = mapCirclesToNumbers(oldPosition);
      const newIndex = mapCirclesToNumbers(newPosition);

      const updatedClickedCircles = [...gameState.clickedCircles];

      if (data.nextPlayer === "White") {
        updatedClickedCircles[newIndex] = "Black";
      } else {
        updatedClickedCircles[newIndex] = "White";
      }
      updatedClickedCircles[oldIndex] = "false";

      setGameState((prevState) => ({
        ...prevState,
        clickedCircles: updatedClickedCircles,
        currentPlayer: data.nextPlayer,
      }));
    });
  }, [gameState, playerColor]);

  const handleCircleClick = (circleId: string): void => {
    // Only allow to place if if its their turn

    // If there are no more counters user has to click on one of their counters
    if (gameState.counterLeft > 0) {
      const circleIndex = mapCirclesToNumbers(circleId);

      if (
        gameState.currentPlayer === playerColor &&
        !gameState.winner &&
        gameState.clickedCircles[circleIndex] === "false"
      ) {
        console.log(
          `Circle ${circleId} was clicked by  ${playerName} and his color is  ${playerColor}`
        );

        socket.emit("move", {
          circleId,
          nextPlayer: opponentColor,
          opponentId: opponentId,
        });
      } else {
        console.log(`Not your turn`);
      }
    } else {
      // Check whether they have clicked their own counter
      const circleIndex = mapCirclesToNumbers(circleId);

      const circleColor = gameState.clickedCircles[circleIndex];

      console.log(playerColor + " " + circleColor);

      if (gameState.currentPlayer == playerColor) {
        if (circleColor === playerColor) {
          setGameState((prevState) => ({
            ...prevState,
            showMoves: true,
            currentClicked: circleId,
          }));
        } else {
          if (circleColor === "false" && gameState.showMoves === true) {
            socket.emit("move counter", {
              oldPosition: gameState.currentClicked,
              newPosition: circleId,
              nextPlayer: opponentColor,
            });
          }

          setGameState((prevState) => ({
            ...prevState,
            showMoves: false,
            currentClicked: "",
          }));
        }
      }
    }
  };

  console.log(`Joined the game ${playerName} and his color is ${playerColor}`);

  return (
    <>
      <Board
        onCircleClick={handleCircleClick}
        clickedCircles={gameState.clickedCircles}
        currentPlayer={gameState.currentPlayer}
        currentCounter={gameState.counterLeft}
        showMoves={gameState.showMoves}
      />
      <div className="show-turn-message">{gameState.currentPlayer}' turn</div>
    </>
  );
};

export default RotaGame;
