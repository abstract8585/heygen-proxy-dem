// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.HEYGEN_API_KEY;
const BASE_URL = "https://api.heygen.com/v2"; // V2 API

// Health-check route
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// List avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/avatars`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    console.log("Avatars API raw response:", data);

    res.json({ error: null, data: { avatars: data.avatars || [] } });
  } catch (err) {
    console.error("❌ Failed to fetch avatars:", err);
    res.json({ error: "Failed to fetch avatars", data: { avatars: [] } });
  }
});

// List voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/voices`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    console.log("Voices API raw response:", data);

    res.json({ error: null, data: { voices: data.voices || [] } });
  } catch (err) {
    console.error("❌ Failed to fetch voices:", err);
    res.json({ error: "Failed to fetch voices", data: { voices: [] } });
  }
});

// Create video
app.post("/api/videos", async (req, res) => {
  try {
    const body = {
      avatar_id: req.body.avatar_id,
      voice_id: req.body.voice_id,
      text: req.body.text
    };

    const response = await fetch(`${BASE_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Video creation response:", data);

    res.json(data);
  } catch (err) {
    console.error("❌ Failed to create video:", err);
    res.status(500).json({ error: "Failed to create video" });
  }
});

// Check video status
app.get("/api/videos/:id", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/videos/${req.params.id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Failed to fetch video status:", err);
    res.status(500).json({ error: "Failed to fetch video status" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node.js HeyGen proxy running on port ${PORT}`));
