const express = require("express");
const axios = require("axios");
require("dotenv").config();

const router = express.Router();

router.get("/adoptable", async (req, res) => {
  try {
    const response = await axios.get("https://api.petfinder.com/v2/animals", {
      headers: {
        Authorization: `Bearer ${process.env.PETFINDER_API_KEY}`,
      },
      params: {
        type: "Dog",
        limit: 10, // Fetch only 10 pets to avoid excessive data
      },
    });

    const cleanedPets = response.data.animals.map((pet) => ({
      id: pet.id,
      name: pet.name,
      breed: pet.breeds.primary || "Unknown",
      size: pet.size || "Unknown",
      energy_level: pet.attributes.spayed_neutered ? "Moderate" : "High",
      photo: pet.primary_photo_cropped
        ? pet.primary_photo_cropped.full
        : "https://example.com/default-image.jpg",
    }));

    res.json(cleanedPets);
  } catch (error) {
    console.error("Error fetching pets:", error);
    res.status(500).json({ error: "Failed to fetch adoptable pets" });
  }
});

module.exports = router;
