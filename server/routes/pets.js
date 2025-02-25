const express = require("express");
const axios = require("axios");
const pool = require("../config/db");
require("dotenv").config();

const router = express.Router();

const PETFINDER_API_URL = "https://api.petfinder.com/v2";

async function getAccessToken() {
  try {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    params.append("client_id", process.env.PETFINDER_CLIENT_ID);
    params.append("client_secret", process.env.PETFINDER_CLIENT_SECRET);

    const response = await axios.post(
      `${PETFINDER_API_URL}/oauth2/token`,
      params,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to retrieve Petfinder access token.");
  }
}

router.get("/fetch-and-store", async (req, res) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(`${PETFINDER_API_URL}/animals`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        type: "Dog",
        limit: 100,
      },
    });

    const pets = response.data.animals;

    let storedPets = [];

    for (const pet of pets) {
      const [checkPet] = await pool.execute(
        "SELECT id FROM pets WHERE id = ?",
        [pet.id]
      );

      if (checkPet.length === 0) {
        await pool.execute(
          `INSERT INTO pets 
      (id, name, breed, size, age, gender, energy_level, grooming_needs, 
      location, image_url, coat_length, good_with_kids, good_with_dogs, 
      good_with_cats, training_needs) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,

          [
            pet.id,
            pet.name || "Unknown",
            pet.breeds?.primary || "Unknown",
            pet.size || "Unknown",
            pet.age || "Unknown",
            pet.gender || "Unknown",
            "Moderate",
            "Moderate Grooming",
            pet.contact.address.city || "Unknown",
            pet.primary_photo_cropped?.full ||
              (pet.photos.length > 0
                ? pet.photos[0].full
                : "https://placehold.co/300x200?text=No+Image"),
            pet.coat || "Unknown",
            pet.environment.children !== null
              ? pet.environment.children
                ? 1
                : 0
              : null,
            pet.environment.dogs !== null
              ? pet.environment.dogs
                ? 1
                : 0
              : null,
            pet.environment.cats !== null
              ? pet.environment.cats
                ? 1
                : 0
              : null,
            pet.attributes.house_trained !== null
              ? pet.attributes.house_trained
                ? "Yes"
                : "No"
              : null,
          ]
        );
        storedPets.push({ id: pet.id, name: pet.name });
      }
    }

    res.json({
      message: "Pets fetched and stored successfully!",
      petsAdded: storedPets.length,
      addedPets: storedPets,
    });
  } catch (error) {
    console.error(
      "Error fetching pets:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch adoptable pets" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [pets] = await pool.execute("SELECT * FROM pets");
    res.json(pets);
  } catch (error) {
    console.error("Error fetching pets from database:", error);
    res.status(500).json({ error: "Failed to retrieve pets from database" });
  }
});

module.exports = router;
