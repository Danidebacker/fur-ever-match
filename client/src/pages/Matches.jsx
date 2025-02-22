import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Matches = () => {
  const { userId } = useParams();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!userId) return;

      try {
        console.log(`Fetching matches for user ID: ${userId}`);

        const matchResponse = await fetch(
          `http://localhost:5000/api/quiz/match/${userId}`
        );
        if (!matchResponse.ok) {
          console.error("Failed to fetch matches:", matchResponse.statusText);
          return;
        }

        const matchData = await matchResponse.json();
        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [userId]);

  return (
    <div>
      <h2>Your Pet Matches</h2>
      {matches.length > 0 ? (
        matches.map((pet) => (
          <div key={pet.id}>
            <h3>{pet.name}</h3>
            <p>Size: {pet.size}</p>
            <p>Energy Level: {pet.energy_level}</p>
            <p>Grooming Needs: {pet.grooming_needs}</p>
            <img src={pet.image_url} alt={pet.name} width="200" />
          </div>
        ))
      ) : (
        <p>No perfect matches found, but keep looking!</p>
      )}
    </div>
  );
};

export default Matches;
