// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();

// CORS - allow your front-end domain
app.use(cors({
  origin: ["https://waodeo.com", "https://www.waodeo.com"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

const API_KEY = process.env.HEYGEN_API_KEY;
const BASE_URL = "https://api.heygen.com/v2"; // V2 API

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get list of avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/avatars`, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json({ error: null, data });
    } catch (err) {
      console.error("Failed to parse avatars JSON:", text);
      res.status(500).json({ error: "Failed to fetch avatars", raw: text });
    }
  } catch (err) {
    console.error("Error fetching avatars:", err);
    res.status(500).json({ error: "Error fetching avatars" });
  }
});

// Get list of voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/voices`, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json({ error: null, data });
    } catch (err) {
      console.error("Failed to parse voices JSON:", text);
      res.status(500).json({ error: "Failed to fetch voices", raw: text });
    }
  } catch (err) {
    console.error("Error fetching voices:", err);
    res.status(500).json({ error: "Error fetching voices" });
  }
});

// Create a video
app.post("/api/videos", async (req, res) => {
  try {
    console.log("➡️ Creating video with payload:", req.body);

    const response = await fetch(`${BASE_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        avatar_id: req.body.avatar_id,
        voice_id: req.body.voice_id,
        text: req.body.text
      })
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      if (data.error) {
        console.error("❌ Failed to create video:", data.error);
        res.status(500).json({ error: "Failed to create video", raw: data.error });
        return;
      }
      console.log("📦 Creation response:", data);
      res.json(data);
    } catch (err) {
      console.error("❌ Failed to parse JSON response:", text);
      res.status(500).json({ error: "Failed to parse JSON", raw: text });
    }
  } catch (err) {
    console.error("❌ Error creating video:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Check video status
app.get("/api/videos/:id", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/videos/${req.params.id}`, {
      headers: { "Authorization": `Bearer ${API_KEY}` }
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", text);
      res.status(500).json({ error: "Failed to parse JSON", raw: text });
    }
  } catch (err) {
    console.error("Error checking video:", err);
    res.status(500).json({ error: "Error checking video" });
  }
});

// Listen on the port Render provides
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node.js proxy running on port ${PORT}`));
