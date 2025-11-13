// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.HEYGEN_API_KEY;
const BASE_URL = "https://api.heygen.com/v2";
console.log("🚀 Server started. Using API:", BASE_URL);
console.log("🔑 HEYGEN_API_KEY prefix:", API_KEY?.slice(0,10) || "MISSING");


// 🩺 Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🧍 Get all avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/avatars`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching avatars:", err);
    res.status(500).json({ error: "Failed to fetch avatars" });
  }
});

// 🗣️ Get all voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/voices`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching voices:", err);
    res.status(500).json({ error: "Failed to fetch voices" });
  }
});

// 🎬 Generate video
app.post("/api/generate", async (req, res) => {
  try {
    const { avatar_id, voice_id, script } = req.body;

    const response = await fetch(`${BASE_URL}/video/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        avatar_id,
        voice_id,
        script,
        test: false,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error generating video:", err);
    res.status(500).json({ error: "Failed to generate video" });
  }
});

// 🔁 Check video status
app.get("/api/status/:video_id", async (req, res) => {
  try {
    const { video_id } = req.params;
    const response = await fetch(`${BASE_URL}/video/status?video_id=${video_id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching video status:", err);
    res.status(500).json({ error: "Failed to fetch video status" });
  }
});

// 🌐 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
