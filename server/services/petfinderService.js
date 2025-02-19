const axios = require("axios");
require("dotenv").config();

const PETFINDER_API_KEY = process.env.PETFINDER_API_KEY;
const PETFINDER_SECRET = process.env.PETFINDER_SECRET;

const getPetfinderToken = async () => {
  try {
    const response = await axios.post(
      "https://api.petfinder.com/v2/oauth2/token",
      {
        grant_type: "client_credentials",
        client_id: PETFINDER_API_KEY,
        client_secret: PETFINDER_SECRET,
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error getting Petfinder token:",
      error.response ? error.response.data : error
    );
    return null;
  }
};

const getAdoptablePets = async (breed) => {
  const token = await getPetfinderToken();
  if (!token) return null;

  try {
    const response = await axios.get("https://api.petfinder.com/v2/animals", {
      headers: { Authorization: `Bearer ${token}` },
      params: { type: "dog", breed: breed, status: "adoptable", limit: 10 },
    });

    return response.data.animals;
  } catch (error) {
    console.error(
      "Error fetching adoptable pets:",
      error.response ? error.response.data : error
    );
    return null;
  }
};

module.exports = { getAdoptablePets };
