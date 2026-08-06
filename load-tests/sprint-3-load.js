import http from "k6/http";
import { check, sleep } from "k6";
import { Counter, Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

const cacheHits = new Counter("cache_hits");
const cacheMisses = new Counter("cache_misses");
const replicaSeen = new Counter("replica_responses");

export const options = {
  vus: 10,
  duration: "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
  },
};
 
const popularRooms = ["room-101", "room-102", "room-301"];
const allRooms = ["room-101", "room-102", "room-201", "room-202", "room-301"];

function pickRoomId() {
  if (Math.random() < 0.75) {
    return popularRooms[Math.floor(Math.random() * popularRooms.length)];
  }
  return allRooms[Math.floor(Math.random() * allRooms.length)];
}

export default function () {
  if (Math.random() < 0.6) {
    const res = http.get(`${BASE_URL}/rooms`);
    check(res, {
      "GET /rooms status 200": (r) => r.status === 200,
    });
    const replica = res.headers["X-Replica"];
    if (replica) {
      replicaSeen.add(1, { replica });
    }
  } else {
    const roomId = pickRoomId();
    const res = http.get(`${BASE_URL}/rooms/${roomId}`);
    check(res, {
      "GET /rooms/:id status 200": (r) => r.status === 200,
    });

    const cacheHeader = res.headers["X-Cache"];
    if (cacheHeader === "HIT") {
      cacheHits.add(1);
    } else if (cacheHeader === "MISS") {
      cacheMisses.add(1);
    }

    const replica = res.headers["X-Replica"];
    if (replica) {
      replicaSeen.add(1, { replica });
    }
  }

  sleep(0.2);
}
