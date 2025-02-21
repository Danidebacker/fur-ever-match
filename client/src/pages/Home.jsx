import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Fur-Ever Match!</h1>
      <p>Find the perfect pet match for you.</p>
      <Link to="/quiz">
        <button>Take Quiz</button>
      </Link>
    </div>
  );
};

export default Home;
