import { useState, useEffect } from "react";

import Board from "../components/Board";
import { useLocation, useNavigate } from "react-router-dom";
import {
  mapCirclesToNumbers,
  checkRotaGameWinner,
} from "../components/CommonFunctions";
import "../styles/RotaGame.css";
import socket from "../components/SocketManager"; // Import the socket instance
import Webcam from "react-webcam"; // Import the webcam component

interface GameState {
  board: string[];
  currentPlayer: string;
  winner: string | null;
  clickedCircles: string[];
  counterLeft: number;
  showMoves: boolean;
  showMatch: boolean;
  currentClicked: string;
}

const initialGameState = {
  board: Array(9).fill(""),
  currentPlayer: "", // Set currentPlayer to currentPlayerTurn
  winner: null,
  clickedCircles: Array(9).fill("false"),
  counterLeft: 6,
  showMoves: false,
  showMatch: false,
  currentClicked: "",
};

const RotaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { opponentId, playerColor, playerName, currentPlayerTurn } =
    location.state || {}; // Ensure state exists, or default to empty object

  let opponentColor: string;
  if (playerColor === "White") {
    opponentColor = "Black";
  } else {
    opponentColor = "White";
  }

  const [gameState, setGameState] = useState<GameState>(initialGameState);

  console.log(gameState);

  useEffect(() => {
    if (currentPlayerTurn) {
      setGameState((prevState) => ({
        ...prevState,
        currentPlayer: currentPlayerTurn,
      }));
    }
  }, [currentPlayerTurn]);

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
        showMatch: false,
        currentClicked: "",
      });
    });

    socket.on("updateMove", (moveData) => {
      console.log("Updating move");

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

      //console.log(gameState.counterLeft);

      // Check if there is a winner
      const [winner, winningPattern] = checkRotaGameWinner(
        updatedClickedCircles
      );

      console.log("The winner is " + winner + " " + winningPattern);

      if (winner === true) {
        console.log("Clicked update move counter");
        console.log("Finished");

        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: winningPattern,
          showMatch: true,
        }));

        setTimeout(() => {
          navigate("/winner", {
            state: {
              opponentId: opponentId,
              winnerColor: winningPattern,
              playerName: playerName,
              playerColor: playerColor,
            },
          });
        }, 3000);
      } else {
        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: moveData.nextPlayer,
          counterLeft: gameState.counterLeft - 1,
        }));
      }

      //console.log(gameState);
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

      // Check if there is a winner
      const [winner, winningPattern] = checkRotaGameWinner(
        updatedClickedCircles
      );

      if (winner === true) {
        console.log("Clicked update move counter");
        console.log("Finished");

        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: winningPattern,
          showMatch: true,
        }));

        setTimeout(() => {
          navigate("/winner", {
            state: {
              opponentId: opponentId,
              winnerColor: winningPattern,
              playerName: playerName,
              playerColor: playerColor,
            },
          });
        }, 3000);
      } else {
        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: data.nextPlayer,
        }));
      }
    });
    return () => {
      socket.off("gamestart");
    };
  }, [gameState, playerColor, navigate, opponentId, playerName]);

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
        //console.log(`Circle ${circleId} was clicked by  ${playerName} and his color is  ${playerColor}`);

        socket.emit("move", {
          circleId,
          nextPlayer: opponentColor,
          opponentId: opponentId,
        });
      } else {
        console.log(
          `Not your turn ` + gameState.currentPlayer + " " + playerColor
        );
      }
    } else {
      // Check whether they have clicked their own counter
      const circleIndex = mapCirclesToNumbers(circleId);

      const circleColor = gameState.clickedCircles[circleIndex];

      console.log("Important!: " + gameState);

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

  //console.log(`Joined the game ${playerName} and his color is ${playerColor}`);

  return (
    <>
      <Board
        onCircleClick={handleCircleClick}
        clickedCircles={gameState.clickedCircles}
        currentCounter={gameState.counterLeft}
        showMoves={gameState.showMoves}
        showMatch={gameState.showMatch}
        currentPlayer={gameState.currentPlayer}
      />
      <div className="show-turn-message">{gameState.currentPlayer}' turn</div>
      <div className="webcam-container">
        <Webcam className="webcam"></Webcam>
        <Webcam className="webcam"></Webcam>
      </div>
    </>
  );
};

export default RotaGame;
