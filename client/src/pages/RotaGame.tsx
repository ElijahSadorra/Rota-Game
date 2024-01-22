// General imports
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

// Component imports
import socket from "../components/SocketManager";
import Board from "../components/Board";

// Common functions imports
import {
  mapCirclesToNumbers,
  checkRotaGameWinner,
} from "../components/CommonFunctions";

// Styles import
import "../styles/RotaGame.css";
import "../styles/MainMenu.css";

// Interface for the game state
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

// An initilisation of the game state to reset everything
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

// The main logic page where all game state is handled with the server
const RotaGame = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { opponentId, playerColor, playerName, currentPlayerTurn } =
    location.state || {}; // Ensure state exists, or default to empty object

  // Sets the opponent color
  let opponentColor: string;
  if (playerColor === "White") {
    opponentColor = "Black";
  } else {
    opponentColor = "White";
  }

  // Usestates to keep the web page in use
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [facts, setFacts] = useState<string[]>([]);
  const [currentFact, setCurrentFact] = useState<string | null>(null);

  // Debugging
  console.log(gameState);

  // useEffect to fetch and set facts from the text file
  useEffect(() => {
    // Fetch the facts file
    fetch("/facts.txt")
      .then((response) => response.text())
      .then((data) => {
        // Split the file content by lines to get individual facts
        const factList = data.split("\n").filter((fact) => fact.trim() !== "");
        setFacts(factList);

        // Set an initial random fact
        const initialRandomFact = getRandomFact(factList);
        setCurrentFact(initialRandomFact);
      })
      .catch((error) => {
        console.error("Error fetching facts:", error);
      });
  }, []);

  // Function to get a random fact from the array
  const getRandomFact = (factList: string[]): string | null => {
    if (factList.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * factList.length);
    return factList[randomIndex];
  };

  // Use setInterval to periodically update the displayed fact
  useEffect(() => {
    const intervalId = setInterval(() => {
      const randomFact = getRandomFact(facts);
      setCurrentFact(randomFact);
    }, 10000); // Change the interval to your preferred time (in milliseconds)

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [facts]);

  // Allows the page to set the currentPlayer turn as initialisation was outside of scope
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

    // When the server sends over an update move
    socket.on("updateMove", (moveData) => {
      // Debugging
      console.log("Updating move");

      // Handle the opponent's move
      const { circleId } = moveData;

      // Update the game state based on the received move data
      const circleIndex = mapCirclesToNumbers(circleId);
      const updatedClickedCircles = [...gameState.clickedCircles];

      // Sets the correct color to the board
      if (moveData.nextPlayer === "White") {
        updatedClickedCircles[circleIndex] = "Black";
      } else {
        updatedClickedCircles[circleIndex] = "White";
      }

      // Debugging
      //console.log(gameState.counterLeft);

      // Check if there is a winner
      const [winner, winningPattern] = checkRotaGameWinner(
        updatedClickedCircles
      );

      // Debugging
      console.log("The winner is " + winner + " " + winningPattern);

      // If there is a winner
      // Allow game to end
      if (winner === true) {
        console.log("Clicked update move counter");
        console.log("Finished");

        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: winningPattern,
          showMatch: true,
        }));

        // Goes to the winner page after 3 secs
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
        // otherwise update game state to new board clicks etc.
        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: moveData.nextPlayer,
          counterLeft: gameState.counterLeft - 1,
        }));
      }

      // Debugging
      //console.log(gameState);
    });

    // When the server sends a move counter
    socket.on("update move counter", (data) => {
      // Keeps track of the old and new position
      const { oldPosition, newPosition } = data;

      // Gets the index value of the circle direction
      const oldIndex = mapCirclesToNumbers(oldPosition);
      const newIndex = mapCirclesToNumbers(newPosition);

      const updatedClickedCircles = [...gameState.clickedCircles];

      // Updates it accordingly
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

      // If there is a winner, end the game
      if (winner === true) {
        console.log("Clicked update move counter");
        console.log("Finished");

        setGameState((prevState) => ({
          ...prevState,
          clickedCircles: updatedClickedCircles,
          currentPlayer: winningPattern,
          showMatch: true,
        }));

        // Allow navigation to winner page with the winning color
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

  // When the user clicks to place a counter
  // Only allow to place if its their turn
  const handleCircleClick = (circleId: string): void => {
    // Case where there are still counters by the side
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
        // If its not their move dont allow to move
        console.log(
          `Not your turn ` + gameState.currentPlayer + " " + playerColor
        );
      }
    } else {
      // Case where all counters are placed on the board
      // Check whether they have clicked their own counter
      const circleIndex = mapCirclesToNumbers(circleId);

      const circleColor = gameState.clickedCircles[circleIndex];

      // Debugging
      console.log("Important!: " + gameState);

      if (gameState.currentPlayer == playerColor) {
        // allow player highglight the counter
        if (circleColor === playerColor) {
          setGameState((prevState) => ({
            ...prevState,
            showMoves: true,
            currentClicked: circleId,
          }));
        } else {
          if (circleColor === "false" && gameState.showMoves === true) {
            // allow the player to move the highligted counter to the new place
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
      <div className="black-side-counters-container">
        <div
          className={
            gameState.counterLeft > 5 && gameState.showMatch === false
              ? "black-counters"
              : ""
          }
        ></div>
        <div
          className={
            gameState.counterLeft > 3 && gameState.showMatch === false
              ? "black-counters"
              : ""
          }
        ></div>
        <div
          className={
            gameState.counterLeft > 1 && gameState.showMatch === false
              ? "black-counters"
              : ""
          }
        ></div>
      </div>
      <div
        className={
          gameState.currentPlayer == "Black" &&
          gameState.counterLeft > 0 &&
          gameState.showMatch === false
            ? "black-counters-indication"
            : ""
        }
      ></div>
      <div className="white-side-counters-container">
        <div
          className={
            gameState.counterLeft > 2 && gameState.showMatch === false
              ? "white-counters"
              : ""
          }
        ></div>
        <div
          className={
            gameState.counterLeft > 4 && gameState.showMatch === false
              ? "white-counters"
              : ""
          }
        ></div>
      </div>
      <div
        className={
          gameState.currentPlayer == "White" &&
          gameState.counterLeft > 0 &&
          gameState.showMatch === false
            ? "white-counters-indication"
            : ""
        }
      ></div>
      <div
        className={gameState.counterLeft > 0 ? "" : "fact-message-container"}
      >
        <div className="message-Title">Roman Facts</div>
        <div className="show-fact-message">{currentFact}</div>
      </div>
    </>
  );
};

export default RotaGame;
