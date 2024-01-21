// Matchmaking.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MatchMaking.css";
import Button from "../components/Button";

import { Link } from "react-router-dom";

import socket from "../components/SocketManager"; // Import the socket instance

// Establish a connection

const Matchmaking: React.FC = () => {
  const navigate = useNavigate(); // This is for react-router-dom v6

  useEffect(() => {
    // Enter matchmaking when component mounts
    socket.emit("enter matchmaking");

    // Listen for a match
    socket.on("matched", (data) => {
      // Upon being matched, navigate to the RotaGame page
      navigate("/lobby", {
        state: { opponentId: data.opponentId, counterColor: data.counterColor },
      });
    });

    // Clean up on unmount
    return () => {
      socket.off("matched");
    };
  }, [navigate]);

  return (
    <>
      <div className="matchmaking-page">
        <div className="matchmaking-container">
          <h1>MATCHMAKING</h1>
          <h2>Finding an Opponent!</h2>
          <div className="dot-container">
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
            <div className="dots"></div>
          </div>
        </div>
      </div>
      <div className="top-leftButton">
        <Link to="/">
          <Button customProp="back-button" />
        </Link>
      </div>
      <div className="bottom-middle">
        <Link to="/lobby">
          <Button customProp="Click for a bot!" />
        </Link>
      </div>
    </>
  );
};

export default Matchmaking;
