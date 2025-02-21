import React, { useState, useEffect } from "react";
import "./Pets.scss";
import { fetchPets } from "../apiService";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    size: "All",
    energy_level: "All",
  });

  useEffect(() => {
    const getPets = async () => {
      setLoading(true);
      try {
        const petData = await fetchPets();
        console.log("Raw API Response:", petData);
        if (Array.isArray(petData)) {
          const uniquePets = Array.from(
            new Map(
              petData.map((pet) => [`${pet.name}-${pet.breed.primary}`, pet])
            ).values()
          );
          console.log("Filtered Unique Pets:", uniquePets);
          setPets(uniquePets);
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

      <div className="filters">
        <label>
          Size:
          <select
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          >
            <option value="All">All</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </label>

        <label>
          Energy Level:
          <select
            value={filters.energy_level}
            onChange={(e) =>
              setFilters({ ...filters, energy_level: e.target.value })
            }
          >
            <option value="All">All</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Loading pets...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : pets.length === 0 ? (
        <p>No pets available right now. Check back later!</p>
      ) : (
        <div className="pets-list">
          {pets
            .filter(
              (pet) => filters.size === "All" || pet.size === filters.size
            )
            .filter(
              (pet) =>
                filters.energy_level === "All" ||
                pet.energy_level === filters.energy_level
            )
            .map((pet) => (
              <div key={pet.id} className="pet-card">
                <h2>{pet.name}</h2>
                {pet.photo ? (
                  <img src={pet.photo} alt={pet.name} />
                ) : (
                  <p>No Image Available</p>
                )}
                <p>Breed: {pet.breed.primary || "unknown"}</p>
                <p>Age: {pet.age || "Unknown"}</p>
                <p>Gender: {pet.gender || "Unknown"}</p>
                <p>Size: {pet.size}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Pets;
