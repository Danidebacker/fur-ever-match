require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

if (!process.env.PETFINDER_CLIENT_ID || !process.env.PETFINDER_CLIENT_SECRET) {
  console.error("ERROR: Missing Petfinder API credentials in .env file!");
  process.exit(1);
}

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));
app.use(express.json());

const petsRouter = require("./routes/pets");
const quizRouter = require("./routes/quiz");

console.log(
  "CLIENT_ID:",
  process.env.PETFINDER_CLIENT_ID ? "Loaded" : "MISSING"
);
console.log(
  "CLIENT_SECRET:",
  process.env.PETFINDER_CLIENT_SECRET ? "Loaded" : "MISSING"
);

app.get("/", (req, res) => {
  res.send("Fur-Ever Match API is running!");
});

app.use("/api/pets", petsRouter);
app.use("/api/quiz", quizRouter);

app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
const listEndpoints = require("express-list-endpoints");
console.log("Available Routes:", listEndpoints(app));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
