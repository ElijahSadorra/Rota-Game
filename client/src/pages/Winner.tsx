import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import "../styles/Winner.css";
import Button from "../components/Button";
import socket from "../components/SocketManager"; // Import the socket instance

const Winner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { winnerColor, playerName, playerColor } = location.state || {}; // Ensure state exists, or default to empty object

  const handleRematch = () => {
    socket.emit("player ready", true);
  };

  useEffect(() => {
    socket.emit("end game");

    // Listen for a match
    socket.on("begin game", (data) => {
      // Upon being matched, navigate to the RotaGame page
      navigate("/rota", {
        state: {
          opponentId: data.opponentId,
          playerColor: playerColor,
          playerName: playerName,
          currentPlayerTurn: data.currentPlayerTurn,
        },
      });
    });
    return () => {
      socket.off("gamestart");
    };
  }, [navigate, playerName, playerColor]);

  return (
    <>
      <div className="winner-page">
        <h1>{winnerColor} Wins!</h1>
      </div>
      <div className="gold-coins-container-left">
        <div className="gold-coins-big"></div>
        <div className="gold-coins"></div>
      </div>
      <div className="gold-coins-container-right">
        <div className="gold-coins-big"></div>
        <div className="gold-coins"></div>
      </div>
      <div className="button-container-winner">
        <Button customProp="REMATCH" onClick={handleRematch} />

        <Link to="/matchmaking">
          <Button customProp="NEW PLAYER" />
        </Link>
        <Link to="/">
          <Button customProp="EXIT" />
        </Link>
      </div>
    </>
  );
};

export default Winner;
