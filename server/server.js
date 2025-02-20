require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const petsRouter = require("./routes/pets");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization",
};
app.use(cors(corsOptions));
app.use(express.json());

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
