import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchMatches, fetchPets } from "../apiService";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [matchedPets, setMatchedPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllPets, setShowAllPets] = useState(false);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        console.log(`Fetching matches for user ID: ${userId}`);
        const matches = await fetchMatches(userId);
        console.log("Matched Pets:", matches);
        setMatchedPets(matches || []);
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to fetch matches.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [userId]);

  const handleShowAllPets = async () => {
    navigate("/pets");
  };

  return (
    <div className="matches-container">
      <h2>{showAllPets ? "All Available Pets" : "Your Matched Pets"}</h2>

      <button onClick={handleShowAllPets} className="show-all-pets-btn">
        View All Available Pets
      </button>

      {loading ? (
        <p>Loading your matches...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="pets-list">
          {(showAllPets ? allPets : matchedPets).map((pet) => (
            <div key={pet.id} className="pet-card">
              <h2>{pet.name}</h2>
              <img src={pet.image_url} alt={pet.name} />
              <p>Breed: {pet.breed}</p>
              <p>Size: {pet.size}</p>
              <p>Energy Level: {pet.energy_level}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
