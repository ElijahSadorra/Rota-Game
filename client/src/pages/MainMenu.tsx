// MainPage.tsx

import React from "react";
import "../styles/MainMenu.css";
import Button from "../components/Button";

import { Link } from "react-router-dom";

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
