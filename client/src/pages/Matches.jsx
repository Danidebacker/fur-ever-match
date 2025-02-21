import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    const fetchMatches = async () => {
      if (!email) return;

      try {
        const userResponse = await fetch(
          `http://localhost:5000/api/quiz/user?email=${email}`
        );

        const userData = await userResponse.json();

        if (!userData.id) {
          console.error("User not found");
          return;
        }

        // Fetch matches for the user
        const matchResponse = await fetch(
          `http://localhost:5000/api/quiz/match/${userData.id}`
        );
        const matchData = await matchResponse.json();

        setMatches(matchData);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [email]);

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
