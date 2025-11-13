// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors()); // Allow all origins
app.use(express.json());

const API_KEY = process.env.HEYGEN_API_KEY;
const BASE_URL = "https://api.heygen.com/v2"; // V2 endpoints

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// List avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/avatars`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json({ error: null, data });
  } catch (err) {
    console.error("❌ Failed to fetch avatars", err);
    res.json({ error: "Failed to fetch avatars", data: null });
  }
});

// List voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/voices`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json({ error: null, data });
  } catch (err) {
    console.error("❌ Failed to fetch voices", err);
    res.json({ error: "Failed to fetch voices", data: null });
  }
});

// Create video
app.post("/api/videos", async (req, res) => {
  const { avatar_id, voice_id, text } = req.body;
  if (!avatar_id || !voice_id || !text) {
    return res.status(400).json({ error: "avatar_id, voice_id, and text are required" });
  }

  try {
    const response = await fetch(`${BASE_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({ avatar_id, voice_id, text }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error creating video:", err);
    res.status(500).json({ error: "Failed to create video" });
  }
});

// Get video status
app.get("/api/videos/:id", async (req, res) => {
  const videoId = req.params.id;
  if (!videoId) return res.status(400).json({ error: "Video ID is required" });

  try {
    const response = await fetch(`${BASE_URL}/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching video status:", err);
    res.status(500).json({ error: "Failed to fetch video status" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HeyGen proxy server running on port ${PORT}`));
