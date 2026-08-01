const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const noteRoutes = require("./routes/noteRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();
const cors = require("cors");

dotenv.config();

connectDB();

app.use(cors());

app.use(express.json());

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/notes", noteRoutes); 

app.use("/api/questions", questionRoutes);

app.get("/", (req, res) => {
    res.send("Interview Copilot API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});