const express = require("express");
const axios = require("axios");
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
      "https://api.petfinder.com/v2/oauth2/token",
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

router.get("/", async (req, res) => {
  try {
    const accessToken = await getAccessToken();
    console.log("Access token obtained:", accessToken ? "Yes" : "No");

    const response = await axios.get(`${PETFINDER_API_URL}/animals`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        type: "Dog",
        limit: 10,
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
    console.error(
      "Error fetching pets:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch adoptable pets" });
  }
});

module.exports = router;
