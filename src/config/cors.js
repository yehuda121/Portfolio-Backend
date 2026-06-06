const cors = require("cors");

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || "http://localhost:3000";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function createCorsMiddleware() {
  const allowed = getAllowedOrigins();
  const allowAll = allowed.includes("*");

  return cors({
    origin(origin, callback) {
      if (allowAll || !origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-anon-id", "x-quiz-admin-token"],
    maxAge: 86400,
  });
}

module.exports = { createCorsMiddleware, getAllowedOrigins };
