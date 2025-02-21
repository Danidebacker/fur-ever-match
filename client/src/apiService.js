const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function fetchPets() {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`);
    if (!response.ok) {
      throw new Error("Failed to fetch pets: ${response.statusText}");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching pets:", error);
    return [];
  }
}

export async function submitQuiz(quizData) {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit quiz: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return null;
  }
}

export async function fetchMatches(userId) {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/match/${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch matches: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

export async function fetchQuizQuestions() {
  try {
    console.log("Fetching quiz questions...");
    const response = await fetch(`${API_BASE_URL}/quiz/questions`);
    if (!response.ok) {
      throw new Error(`Failed to fetch questions: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Questions received:", data);
    return data;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
}
