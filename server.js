import 'dotenv/config';
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors({
  origin: ["*"], // allow all origins for demo
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Root route (Render health check)
app.get("/", (req, res) => {
  res.send("HeyGen proxy server is running 🚀");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const HEYGEN_API = "https://api.heygen.com/v1";
const API_KEY = process.env.HEYGEN_API_KEY;

// List avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const response = await fetch(`${HEYGEN_API}/avatars`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List voices
app.get("/api/voices", async (req, res) => {
  try {
    const response = await fetch(`${HEYGEN_API}/voices`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create video
app.post("/api/videos", async (req, res) => {
  try {
    const { avatar_id, voice_id, text } = req.body;

    const response = await fetch(`${HEYGEN_API}/videos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        video_inputs: [
          { character: avatar_id, voice: voice_id, text }
        ]
      })
    });

    const data = await response.json();

    const videoId = data.data?.video_id;
    if (!videoId) return res.status(500).json({ error: "Failed to retrieve video ID" });

    res.json({ video_id: videoId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get video status
app.get("/api/videos/:id", async (req, res) => {
  try {
    const response = await fetch(`${HEYGEN_API}/videos/${req.params.id}`, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`HeyGen proxy running on port ${PORT}`));
