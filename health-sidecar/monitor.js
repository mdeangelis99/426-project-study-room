const ROOM_HEALTH_URL =
  process.env.ROOM_HEALTH_URL || "http://room-service:3001/health";
const CHECK_INTERVAL_MS = Number(process.env.CHECK_INTERVAL_MS) || 10000;

async function checkHealth() {
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch(ROOM_HEALTH_URL);
    const status = response.status;
    let healthy = false;

    if (response.ok) {
      try {
        const body = await response.json();
        healthy = body?.status === "healthy";
      } catch {
        healthy = false;
      }
    }

    console.log(
      `[${timestamp}] status=${status} room-service healthy=${healthy}`
    );
  } catch (err) {
    console.log(
      `[${timestamp}] status=error room-service healthy=false error=${err.message}`
    );
  }
}

console.log(
  `health-sidecar monitoring ${ROOM_HEALTH_URL} every ${CHECK_INTERVAL_MS}ms`
);

await checkHealth();
setInterval(() => {
  checkHealth();
}, CHECK_INTERVAL_MS);
