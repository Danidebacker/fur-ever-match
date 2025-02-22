import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pets from "./components/Pets";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Matches from "./pages/Matches";

function App() {
  return (
    <Router>
      <div>
        <h1>Fur-Ever Match</h1>
        <p>Welcome to the pet adoption platform!</p>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/matches/:userId" element={<Matches />} />
          <Route path="/pets" element={<Pets />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
