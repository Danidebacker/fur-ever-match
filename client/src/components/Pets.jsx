import React, { useState, useEffect } from "react";
import "./Pets.scss"; // Import styles
import { fetchPets } from "../apiService";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPets = async () => {
      setLoading(true);
      try {
        const petData = await fetchPets();
        if (Array.isArray(petData)) {
          setPets(petData);
        } else {
          setPets([]);
        }
      } catch (err) {
        setError("Failed to load pets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getPets();
  }, []);

  return (
    <div className="pets-container">
      <h1>Available Pets</h1>

      {loading ? (
        <p>Loading pets...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : pets.length === 0 ? (
        <p>No pets available right now. Check back later!</p>
      ) : (
        <div className="pets-list">
          {pets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <h2>{pet.name}</h2>
              {pet.primary_photo_cropped ? (
                <img
                  src={
                    pet.primary_photo_cropped?.small ||
                    "https://example.com/default-image.jpg"
                  }
                  alt={pet.name}
                />
              ) : (
                <p>No Image Available</p>
              )}
              <p>Breed: {pet.breeds?.primary || "unknown"}</p>
              <p>Age: {pet.age}</p>
              <p>Gender: {pet.gender}</p>
              <p>Size: {pet.size}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pets;
