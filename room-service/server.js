import express from "express";
import os from "os";
import { createClient } from "redis";

const PORT = Number(process.env.PORT) || 3001;
const REDIS_URL = process.env.REDIS_URL || "redis://redis:6379";
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS) || 60;
const CACHE_MISS_DELAY_MS = Number(process.env.CACHE_MISS_DELAY_MS) || 350;
const REPLICA = process.env.HOSTNAME || os.hostname();

const rooms = [
  {
    id: "room-101",
    building: "Main Library",
    name: "Quiet Study A",
    capacity: 4,
    available: true,
  },
  {
    id: "room-102",
    building: "Main Library",
    name: "Group Study B",
    capacity: 8,
    available: true,
  },
  {
    id: "room-201",
    building: "Science Center",
    name: "Collaboration Hub",
    capacity: 6,
    available: false,
  },
  {
    id: "room-202",
    building: "Science Center",
    name: "Focus Pod",
    capacity: 2,
    available: true,
  },
  {
    id: "room-301",
    building: "Engineering Hall",
    name: "Project Room 1",
    capacity: 10,
    available: true,
  },
];

const redis = createClient({ url: REDIS_URL });
redis.on("error", (err) => {
  console.error(`redis error on ${REPLICA}:`, err.message);
});

await redis.connect();

const app = express();
app.disable("x-powered-by");

app.use((_req, res, next) => {
  res.setHeader("X-Replica", REPLICA);
  next();
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "room-service",
    replica: REPLICA,
  });
});

app.get("/rooms", (_req, res) => {
  res.json({ replica: REPLICA, rooms });
});

app.get("/rooms/search", async (_req, res) => {
  await delay(1500);
  res.json({ replica: REPLICA, rooms });
});

app.get("/rooms/:id", async (req, res) => {
  const roomId = req.params.id;
  const cacheKey = `room:${roomId}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const room = JSON.parse(cached);
      console.log(
        `[${new Date().toISOString()}] cache=HIT key=${cacheKey} replica=${REPLICA}`
      );
      res.setHeader("X-Cache", "HIT");
      return res.json({ ...room, cache: "HIT", replica: REPLICA });
    }
  } catch (err) {
    console.error(`cache read failed on ${REPLICA}:`, err.message);
  }

  const room = rooms.find((r) => r.id === roomId);
  if (!room) {
    res.setHeader("X-Cache", "MISS");
    return res.status(404).json({
      error: "Room not found",
      cache: "MISS",
      replica: REPLICA,
    });
  }
 
  await delay(CACHE_MISS_DELAY_MS);

  try {
    await redis.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(room));
  } catch (err) {
    console.error(`cache write failed on ${REPLICA}:`, err.message);
  }

  console.log(
    `[${new Date().toISOString()}] cache=MISS key=${cacheKey} replica=${REPLICA}`
  );
  res.setHeader("X-Cache", "MISS");
  res.json({ ...room, cache: "MISS", replica: REPLICA });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `room-service replica=${REPLICA} listening on 0.0.0.0:${PORT} redis=${REDIS_URL}`
  );
});
