// MainPage.tsx

// General import
import React from "react";
import { Link } from "react-router-dom";

// Component import
import Button from "../components/Button";

// Styles import
import "../styles/MainMenu.css";

// A page of the main menu
const MainMenu: React.FC = () => {
  return (
    <>
      <div className="main-page">
        <div className="title-container">
          <h1>ROTA</h1>
        </div>
        <div className="button-container">
          <Link to="/matchmaking">
            <Button customProp="BEGIN" />
          </Link>
          <Link to="/rules">
            <Button customProp="RULES" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default MainMenu;
