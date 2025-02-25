import React from "react";
import { Link } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero__overlay">
          <h1>Welcome to Fur-Ever Match!</h1>
          <p>
            In a world where pets become part of the family, Fur-Ever Match is
            here to help you discover the perfect companion. Our interactive
            quiz takes into account your lifestyle, personality, and preferences
            to match you with a pet that truly fits your home and heart. Whether
            you're seeking a playful pup or a calm, cuddly friend, your perfect
            match awaits. Embark on this journey and let the adventure of pet
            companionship begin!
          </p>
          <Link to="/quiz">
            <button>Take Quiz</button>
          </Link>
        </div>
      </div>
      <div className="home__content">
        <p>Find the perfect pet match for you.</p>
      </div>
    </div>
  );
};

export default Home;
