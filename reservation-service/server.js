import express from "express";

const PORT = Number(process.env.PORT) || 3002;

const reservations = [
  {
    id: "res-1001",
    studentName: "Alex Rivera",
    roomId: "room-101",
    date: "2026-07-28",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "res-1002",
    studentName: "Jordan Lee",
    roomId: "room-201",
    date: "2026-07-28",
    startTime: "13:00",
    endTime: "15:00",
  },
  {
    id: "res-1003",
    studentName: "Sam Patel",
    roomId: "room-301",
    date: "2026-07-29",
    startTime: "09:00",
    endTime: "11:00",
  },
];

let nextId = 1004;

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "healthy", service: "reservation-service" });
});

app.get("/reservations", (_req, res) => {
  res.json(reservations);
});

app.get("/reservations/:id", (req, res) => {
  const reservation = reservations.find((r) => r.id === req.params.id);
  if (!reservation) {
    return res.status(404).json({ error: "Reservation not found" });
  }
  res.json(reservation);
});

app.post("/reservations", (req, res) => {
  const { studentName, roomId, date, startTime, endTime } = req.body ?? {};

  const missing = [];
  if (!studentName) missing.push("studentName");
  if (!roomId) missing.push("roomId");
  if (!date) missing.push("date");
  if (!startTime) missing.push("startTime");
  if (!endTime) missing.push("endTime");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing,
    });
  }

  const reservation = {
    id: `res-${nextId++}`,
    studentName,
    roomId,
    date,
    startTime,
    endTime,
  };

  reservations.push(reservation);
  res.status(201).json(reservation);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`reservation-service listening on 0.0.0.0:${PORT}`);
});
