const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const CLIENT_ID = "H2rMKEYXhGtE8eZwOdbpsnyEno4Z1ARmM6JvvO7zGzL8dk40RP";
// const CLIENT_SECRET = "GC8z9BlcM9b76bzGohjaN7Ew4Xg39BSd30oilmJEET";

export async function fetchPets() {
  try {
    const response = await fetch(`${API_BASE_URL}/pets`);
    if (!response.ok) {
      throw new Error("Failed to fetch pets");
    }

    const data = await response.json();
    return data.animals;
  } catch (error) {
    console.error("Error fetching pets:", error);
    return [];
  }
}
