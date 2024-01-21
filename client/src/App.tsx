// Main imports
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import MainMenu from "./pages/MainMenu";
import Rules from "./pages/Rules";
import Matchmaking from "./pages/MatchMaking";
import Lobby from "./pages/Lobby";
import RotaGame from "./pages/RotaGame";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/rota" element={<RotaGame />} />
      </Routes>
    </Router>
  );
}

export default App;
