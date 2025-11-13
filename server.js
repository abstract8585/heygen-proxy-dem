// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.HEYGEN_API_KEY;
const BASE_URL = "https://api.heygen.com/v2"; // Using V2 endpoints

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Get avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/avatars`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!response.ok) throw new Error(`HeyGen API error: ${response.status}`);
    const data = await response.json();
    res.json({ error: null, data });
  } catch (err) {
    console.error("❌ Failed to fetch avatars:", err);
    res.json({ error: "Failed to fetch avatars", data: null });
  }
});

// Get voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/voices`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });
    if (!response.ok) throw new Error(`HeyGen API error: ${response.status}`);
    const data = await response.json();
    res.json({ error: null, data });
  } catch (err) {
    console.error("❌ Failed to fetch voices:", err);
    res.json({ error: "Failed to fetch voices", data: null });
  }
});

// Create video
app.post("/api/videos", async (req, res) => {
  try {
    const { avatar_id, voice_id, text } = req.body;
    if (!avatar_id || !voice_id || !text) {
      return res.status(400).json({ error: "Missing avatar_id, voice_id, or text" });
    }

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

    if (!response.ok) {
      const textErr = await response.text();
      throw new Error(`HeyGen API error: ${response.status} - ${textErr}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error creating video:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get video status
app.get("/api/videos/:id", async (req, res) => {
  try {
    const videoId = req.params.id;
    if (!videoId) return res.status(400).json({ error: "Missing video ID" });

    const response = await fetch(`${BASE_URL}/videos/${videoId}`, {
      headers: { Authorization: `Bearer ${API_KEY}` },
    });

    if (!response.ok) {
      const textErr = await response.text();
      throw new Error(`HeyGen API error: ${response.status} - ${textErr}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error fetching video status:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HeyGen proxy server running on port ${PORT}`);
});
