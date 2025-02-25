import React, { useState, useEffect } from "react";
import "./Pets.scss";
import { fetchPets } from "../apiService";

const Pets = () => {
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    size: "All",
    gender: "All",
    age: "All",
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

  const filteredPets = pets.filter((pet) => {
    const sizeMatch = filters.size === "All" || pet.size === filters.size;
    const genderMatch =
      filters.gender === "All" || pet.gender === filters.gender;
    const ageMatch = filters.age === "All" || pet.age === filters.age;
    return sizeMatch && genderMatch && ageMatch;
  });

  return (
    <div className="pets-container">
      <h1>Available Pets</h1>

      <div className="filters">
        <label className="labels">
          Size:
          <select
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          >
            <option value="All">All</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </label>

        <label className="labels">
          Gender:
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>

        <label className="labels">
          Age:
          <select
            value={filters.age}
            onChange={(e) => setFilters({ ...filters, age: e.target.value })}
          >
            <option value="All">All</option>
            <option value="Baby">Baby</option>
            <option value="Young">Young</option>
            <option value="Adult">Adult</option>
          </select>
        </label>
      </div>

      {/* <button onClick={() => setShowAllPets(!showAllPets)}>
        {showAllPets ? "Show Matched Pets" : "Show All Pets"}
      </button> */}

      {loading ? (
        <p>Loading pets...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : pets.length === 0 ? (
        <p>No pets available right now. Check back later!</p>
      ) : (
        <div className="pets-list">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="pet-card">
              <h2>{pet.name}</h2>
              <img
                src={
                  pet.image_url
                    ? pet.image_url
                    : "https://placehold.co/300x200?text=No+Image"
                }
                alt={pet.name}
              />
              <p>Breed: {pet.breed || "unknown"}</p>
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
