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
    res.json({ error: null, data: data.avatars || [] });
  } catch (err) {
    console.error("❌ Failed to fetch avatars", err);
    res.json({ error: "Failed to fetch avatars", data: [] });
  }
});

// List voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/voices`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json({ error: null, data: data.voices || [] });
  } catch (err) {
    console.error("❌ Failed to fetch voices", err);
    res.json({ error: "Failed to fetch voices", data: [] });
  }
});

// Create video
app.post("/api/videos", async (req, res) => {
  try {
    const { avatar_id, voice_id, text } = req.body;
    const response = await fetch(`${BASE_URL}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        video_inputs: [
          {
            character: avatar_id,
            voice: voice_id,
            text: text,
          },
        ],
      }),
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
  try {
    const response = await fetch(`${BASE_URL}/videos/${req.params.id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching video status:", err);
    res.status(500).json({ error: "Failed to fetch video status" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
