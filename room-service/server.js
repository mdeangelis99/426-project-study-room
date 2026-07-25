import express from "express";

const PORT = Number(process.env.PORT) || 3001;

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

const app = express();
app.disable("x-powered-by");

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", service: "room-service" });
});

app.get("/rooms", (_req, res) => {
  res.json(rooms);
});

// Register /rooms/search before /rooms/:id so "search" is not treated as an id
app.get("/rooms/search", (_req, res) => {
  setTimeout(() => {
    res.json(rooms);
  }, 1500);
});

app.get("/rooms/:id", (req, res) => {
  const room = rooms.find((r) => r.id === req.params.id);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json(room);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`room-service listening on 0.0.0.0:${PORT}`);
});
