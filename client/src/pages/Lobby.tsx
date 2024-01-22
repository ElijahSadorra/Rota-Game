// General import
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Component import
import Button from "../components/Button";
import socket from "../components/SocketManager";

// Styles import
import "../styles/Lobby.css";

// The lobby page
const Lobby = () => {
  // Variables
  const navigate = useNavigate();
  const location = useLocation();
  const { counterColor } = location.state || {};

  // State to track player's readiness
  const [isReady, setIsReady] = useState(false);

  // State to store the name input value
  const [name, setName] = useState<string>(""); // Initialize it as an empty string

  // Function to handle player's readiness
  const handleReadyClick = () => {
    if (name.trim() === "") {
      // Check if the name is empty
      //console.log("Require name");
    } else {
      setIsReady(true);
      socket.emit("player ready", true);
    }
  };

  useEffect(() => {
    // Listen for a match
    socket.on("begin game", (data) => {
      // Upon being matched, navigate to the RotaGame page
      navigate("/rota", {
        state: {
          opponentId: data.opponentId,
          playerColor: counterColor,
          playerName: name,
          currentPlayerTurn: data.currentPlayerTurn,
        },
      });
    });
    return () => {
      socket.off("gamestart");
    };
  }, [navigate, name, counterColor]);

  return (
    <>
      <div className="lobby-page">
        <h1>Your colour is: {counterColor}</h1>
        <div className="counter-container">
          {counterColor === "White" && <div className="counters-white"></div>}
          {counterColor === "White" && <div className="counters-white"></div>}
          {counterColor === "White" && <div className="counters-white"></div>}
          {counterColor === "Black" && <div className="counters-black"></div>}
          {counterColor === "Black" && <div className="counters-black"></div>}
          {counterColor === "Black" && <div className="counters-black"></div>}
        </div>
        <div className="nameInputContainer">
          <input
            className="nameInput"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Enter name"
          />
        </div>
        <div className="bottom-middle">
          {isReady ? (
            <Button customProp="Waiting..." />
          ) : (
            <Button customProp="READY!" onClick={handleReadyClick} />
          )}
        </div>
      </div>
    </>
  );
};

export default Lobby;
