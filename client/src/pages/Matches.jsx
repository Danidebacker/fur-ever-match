import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMatches } from "../apiService";
import { useNavigate } from "react-router-dom";
import "./Matches.scss";

const Matches = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [matchedPets, setMatchedPets] = useState([]);
  const [viewMore, setViewMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const matches = await fetchMatches(userId);

        if (!matches || !Array.isArray(matches)) {
          throw new Error("Invalid response format");
        }

        const shuffledMatches = matches
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);

        setMatchedPets(shuffledMatches);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to fetch matches.");
      } finally {
        setLoading(false);
      }
    };
    getMatches();
  }, [userId]);

  const handleShowAllPets = async () => {
    navigate("/pets");
  };

  return (
    <div className="matches-container">
      <h2>Your Matched Pets</h2>

      <button onClick={handleShowAllPets} className="show-all-pets-btn">
        View All Available Pets
      </button>

      {loading ? (
        <p>Loading your matches...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : matchedPets.length === 0 ? (
        <p>
          No matches found. Try adjusting your preferences or check back later!
        </p>
      ) : (
        <div className="pets-list">
          {matchedPets
            .slice(0, viewMore ? matchedPets.length : 5)
            .map((pet) => (
              <div key={pet.id} className="pet-card">
                <h2>{pet.name}</h2>
                <img
                  src={
                    pet.image_url ||
                    "https://placehold.co/300x200?text=No+Image"
                  }
                  alt={pet.name}
                />
                <p>Breed: {pet.breed}</p>
                <p>Size: {pet.size}</p>
                <p>Energy Level: {pet.energy_level}</p>
              </div>
            ))}
        </div>
      )}
      {!viewMore && matchedPets.length > 5 && (
        <button onClick={() => setViewMore(true)} className="view-more-btn">
          View More Matches
        </button>
      )}
    </div>
  );
};

export default Matches;
