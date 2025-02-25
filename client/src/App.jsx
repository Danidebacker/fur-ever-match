import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Pets from "./components/Pets";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Matches from "./pages/Matches";

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/matches/:userId" element={<Matches />} />
          <Route path="/pets" element={<Pets />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
