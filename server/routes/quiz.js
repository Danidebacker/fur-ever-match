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

    // const {
    //   energy_level,
    //   recommended_energy_level,
    //   size,
    //   recommended_size,
    //   grooming_needs,
    //   good_with_kids,
    //   good_with_dogs,
    //   good_with_cats,
    //   training_needs,
    //   shedding,
    // } = answers.reduce((acc, answer) => {
    //   acc[answer.category] = answer.answer_id;
    //   return acc;
    // }, {});

    const questionMapping = {
      1: "energy_level",
      2: "recommended_energy_level",
      3: "size",
      4: "recommended_size",
      5: "grooming_needs",
      6: "good_with_kids",
      7: "good_with_dogs",
      8: "good_with_cats",
      9: "training_needs",
      10: "shedding",
    };

    const result = answers.reduce((acc, answer) => {
      const key = questionMapping[answer.question_id];
      if (key) {
        acc[key] = answer.answer_id;
      }
      return acc;
    }, {});

    const {
      energy_level,
      recommended_energy_level,
      size,
      recommended_size,
      grooming_needs,
      good_with_kids,
      good_with_dogs,
      good_with_cats,
      training_needs,
      shedding,
    } = result;

    // await pool.execute(
    //   `INSERT INTO quizresponses
    //   (user_id, energy_level, recommended_energy_level, size, recommended_size, grooming_needs, good_with_kids, good_with_dogs, good_with_cats, training_needs, shedding)
    //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //   [
    //     userId,
    //     energy_level ?? null,
    //     recommended_energy_level ?? null,
    //     size ?? null,
    //     recommended_size ?? null,
    //     grooming_needs ?? null,
    //     good_with_kids ? 1 : 0,
    //     good_with_dogs ? 1 : 0,
    //     good_with_cats ? 1 : 0,
    //     training_needs ? 1 : 0,
    //     shedding ?? null,
    //   ]
    // );

    await pool.execute(
      `INSERT INTO quizresponses 
       (user_id, energy_level, recommended_energy_level, size, recommended_size, grooming_needs, good_with_kids, good_with_dogs, good_with_cats, training_needs, shedding) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        energy_level ?? null,
        recommended_energy_level ?? null,
        size ?? null,
        recommended_size ?? null,
        grooming_needs ?? null,
        good_with_kids ? 1 : 0,
        good_with_dogs ? 1 : 0,
        good_with_cats ? 1 : 0,
        training_needs ? 1 : 0,
        shedding ?? null,
      ]
    );

    console.log("Quiz responses stored successfully for user:", userId);
    console.log("User ID after quiz submission:", userId);

    res.status(201).json({ message: "Quiz submitted successfully!", userId });
  } catch (error) {
    console.error("Error saving quiz response:", error);
    res.status(500).json({ error: "Failed to save quiz response" });
  }
});

router.get("/questions", async (req, res) => {
  try {
    const [questions] = await pool.execute("SELECT * FROM questions");
    const [possible_answers] = await pool.execute(
      "SELECT * FROM possible_answers"
    );

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
        possible_answers,
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
      `SELECT * FROM quizresponses
        WHERE user_id = ?
      ORDER BY submitted_at DESC
      LIMIT 1`,
      [userId]
    );
    console.log("Quiz response:", quizResponse);

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

    const energyPlaceholders = finalEnergyLevel.map(() => "?").join(", ");
    const sizePlaceholders = sizes.map(() => "?").join(", ");
    const sheddingPlaceholders = shedding.map(() => "?").join(", ");
    const groomingPlaceholders = groomingNeeds.map(() => "?").join(", ");

    const query = `
      SELECT * FROM pets 
      WHERE (energy_level IN (${energyPlaceholders}) OR energy_level IS NULL OR energy_level = 'Unknown') 
      AND (size IN (${sizePlaceholders}) OR size IS NULL OR size = 'Unknown')
      AND (shedding IN (${sheddingPlaceholders}) OR shedding IS NULL OR shedding = 'Unknown')
      AND (grooming_needs IN (${groomingPlaceholders}) OR grooming_needs IS NULL OR grooming_needs = 'Unknown')
      AND (good_with_kids = ? OR good_with_kids IS NULL)
      AND (good_with_dogs = ? OR good_with_dogs IS NULL)
      AND (good_with_cats = ? OR good_with_cats IS NULL)
      AND (training_needs = ? OR training_needs IS NULL)
    `;

    const values = [
      ...finalEnergyLevel,
      ...finalSize,
      ...shedding,
      ...groomingNeeds,
      goodWithKids,
      goodWithDogs,
      goodWithCats,
      trainingNeeded,
    ];

    const [matchingPets] = await pool.execute(query, values);

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
