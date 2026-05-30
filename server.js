require("dotenv").config();

const express = require("express");
const cors = require("cors");

const paymentRoutes = require("./routes/payments");

const app = express();

app.use(express.json());
app.use(cors());

// ROUTES
app.use("/api/payments", paymentRoutes);

// ── Daily.co Call Room ────────────────────────────────────────────────────────
app.post("/api/calls/create-room", async (req, res) => {
  try {
    const { roomName, type } = req.body;

    const response = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
      },
      body: JSON.stringify({
        name: roomName,
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600,
          enable_chat: false,
          enable_knocking: false,
          start_video_off: type === "voice",
          start_audio_off: false,
        },
      }),
    });

    const data = await response.json();

    // If room already exists (409), fetch it
    if (response.status === 409) {
      const getResponse = await fetch(
        `https://api.daily.co/v1/rooms/${roomName}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
          },
        }
      );
      const existingRoom = await getResponse.json();
      return res.json({ url: existingRoom.url });
    }

    if (data.url) {
      return res.json({ url: data.url });
    }

    res.status(500).json({ error: "Could not create room" });
  } catch (error) {
    console.error("create-room error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.send("OK");
});

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is alive");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});