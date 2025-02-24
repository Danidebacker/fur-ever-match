const express = require("express");
const pool = require("../config/db");

require("dotenv").config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, answers } = req.body;
    console.log("Received quiz submission:", req.body);
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Invalid answers format" });
    }

    let userId;

    const [existingUser] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length === 0) {
      console.log("New user detected, inserting into database...");
      const [insertUser] = await pool.execute(
        "INSERT INTO Users (name, email) VALUES (?, ?)",
        [name, email]
      );
      userId = insertUser.insertId;
      console.log("New user ID assigned:", userId);
    } else {
      userId = existingUser[0].id;
      console.log("Existing user found with ID:", userId);
    }

    if (!userId) {
      console.error("Error: userId is undefined!");
      return res.status(500).json({ error: "Failed to retrieve userId" });
    }

    for (const answer of answers) {
      console.log("answerrrrrr", answer);
      await pool.execute(
        "INSERT INTO quizresponses (user_id, question_id, answer_id) VALUES (?, ?, ?)",
        [userId, answer.question_id, answer.answer_id]
      );
    }

    console.log("Quiz responses stored successfully for user:", userId);

    const responseData = { message: "Quiz submitted successfully!", userId };
    console.log(" Sending response to frontend:", responseData);
    res.status(201).json(responseData);
  } catch (error) {
    console.error("Error saving quiz response:", error);
    res.status(500).json({ error: "Failed to save quiz response" });
  }
});

router.get("/user", async (req, res) => {
  const { email } = req.query;
  try {
    const [user] = await pool.execute("SELECT id FROM Users WHERE email = ?", [
      email,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user[0].id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const [questions] = await pool.execute("SELECT * FROM questions");

    const questionsWithAnswers = [];
    for (const question of questions) {
      const [answers] = await pool.execute(
        "SELECT id, text FROM answers WHERE question_id = ?",
        [question.id]
      );

      questionsWithAnswers.push({
        id: question.id,
        text: question.text,
        category: question.category,
        answers,
      });
    }

    res.json(questionsWithAnswers);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

router.get("/match/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`Fetching matches for user ID: ${userId}`);

    const [quizResponse] = await pool.execute(
      `SELECT a.energy_level, a.size, a.grooming_needs, a.coat_length, 
          a.good_with_kids, a.good_with_dogs, a.good_with_cats, a.training_needed,
          a.shedding, a.recommended_energy_level, a.recommended_size
    FROM quizresponses q
    JOIN answers a ON q.answer_id = a.id
    WHERE q.user_id = ?
    ORDER BY q.submitted_at DESC`,
      [userId]
    );
    console.log("quiz response", quizResponse);

    if (quizResponse.length === 0) {
      return res
        .status(404)
        .json({ error: "No quiz response found for this user" });
    }

    const energyLevels = quizResponse.map((q) => q.energy_level);
    console.log(energyLevels);
    const recommendedEnergyLevels = quizResponse
      .map((q) => q.recommended_energy_level)
      .filter(Boolean);
    console.log(recommendedEnergyLevels);

    const sizes = quizResponse.map((q) => q.size);
    console.log(sizes);
    const recommendedSizes = quizResponse
      .map((q) => q.recommended_size)
      .filter(Boolean);

    console.log(recommendedSizes);
    const finalSize = recommendedSizes.length > 0 ? recommendedSizes : sizes;
    console.log(finalSize);
    let finalEnergyLevel =
      recommendedEnergyLevels.length > 0
        ? recommendedEnergyLevels
        : energyLevels;
    console.log(finalEnergyLevel);
    const shedding = quizResponse.map((q) => q.shedding);
    console.log(shedding);

    const groomingNeeds = quizResponse.map((q) => q.grooming_needs);
    console.log(groomingNeeds);

    const coatLength = quizResponse.map((q) => q.coat_length);
    console.log(coatLength);
    const trainingNeeded = quizResponse.some((q) => q.training_needed === 1)
      ? 1
      : 0;
    const goodWithKids = quizResponse.some((q) => q.good_with_kids === 1)
      ? 1
      : null;
    const goodWithDogs = quizResponse.some((q) => q.good_with_dogs === 1)
      ? 1
      : null;
    const goodWithCats = quizResponse.some((q) => q.good_with_cats === 1)
      ? 1
      : null;
    console.log(trainingNeeded, goodWithKids, goodWithDogs, goodWithCats);

    const [matchingPets] = await pool.execute(
      `SELECT * FROM pets WHERE (energy_level IN (?) OR energy_level LIKE ? OR energy_level IS NULL OR energy_level = 'Unknown') 
    AND (shedding IN (?) OR shedding LIKE ? OR shedding IS NULL OR shedding = 'Unknown')
    AND (grooming_needs IN (?) OR grooming_needs LIKE ? OR grooming_needs IS NULL OR grooming_needs = 'Unknown')
    AND (good_with_kids = ? OR good_with_kids IS NULL)
    AND (good_with_dogs = ? OR good_with_dogs IS NULL)
    AND (good_with_cats = ? OR good_with_cats IS NULL)
    AND (training_needs = ? OR training_needs IS NULL)`,
      [
        finalEnergyLevel,
        `%${finalEnergyLevel}%`,
        sizes,
        `%${finalSize}%`,
        shedding,
        `%${shedding}%`,
        groomingNeeds,
        `%${groomingNeeds}%`,
        goodWithKids,
        goodWithDogs,
        goodWithCats,
        trainingNeeded,
      ]
    );

    console.log("Found Matches:", matchingPets.length);

    if (matchingPets.length === 0) {
      return res.json({
        message: "No perfect matches found, but keep looking!",
      });
    }

    res.json(matchingPets);
  } catch (error) {
    console.error("Error matching quiz responses to pets:", error);
    res.status(500).json({ error: "Failed to fetch pet matches" });
  }
});

module.exports = router;
