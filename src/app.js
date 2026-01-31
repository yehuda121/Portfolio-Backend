const express = require("express");
const cors = require("cors");

const snakeRouter = require("./routes/snake");

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/api/snake", snakeRouter);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

module.exports = app;
