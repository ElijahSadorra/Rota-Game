// General imports
import React from "react";
import { Link } from "react-router-dom";

// Component imports
import Button from "../components/Button";

// Style imports
import "../styles/Rules.css";

// A rule page to show users the rule of the game
const Rules: React.FC = () => {
  return (
    <>
      <div className="rule-page">
        <div className="text-container">
          <h1>RULES</h1>
          <ol type="I">
            <li>
              Players take turns placing one piece on the board in any open spot
            </li>
            <li>
              After all the pieces are on the board, a player moves one piece
              each turn onto the next empty spot (along spokes or circle)
            </li>
            <li>You may not:</li>
            <ul>
              <li>Skip a turn, even if the move forces you to lose the game</li>
              <li>Jump over another piece</li>
              <li>Move more than one space</li>
              <li>Land on a space with a piece already on it</li>
              <li>Knock a piece off a space </li>
            </ul>
            <li>
              First to 3 in a row, through the middle or along the circle’s
              edge, WINS!
            </li>
          </ol>
        </div>
        <Link to="/matchmaking">
          <Button customProp="BEGIN" />
        </Link>
      </div>
      <div className="top-leftButton">
        <Link to="/">
          <Button customProp="back-button" />
        </Link>
      </div>
    </>
  );
};

export default Rules;
