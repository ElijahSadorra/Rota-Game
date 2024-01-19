// MainPage.tsx

import React from "react";
import "../styles/MainMenu.css";
import Button from "../components/Button";

const MainMenu: React.FC = () => {
  return (
    <>
      <div className="main-page">
        <div className="title-container">
          <h1>ROTA</h1>
        </div>
        <div className="button-container">
          <Button customProp="BEGIN" onClick={() => alert("Button Clicked!")} />
          <Button customProp="RULES" onClick={() => alert("Button Clicked!")} />
        </div>
      </div>
    </>
  );
};

export default MainMenu;
