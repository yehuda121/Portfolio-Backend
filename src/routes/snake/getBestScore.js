// src/routes/snake/getBestScore.js
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ddb } = require("../../config/awsDdbClient");

const TABLE = process.env.SNAKE_TABLE_NAME || "snake_bestScore";
const PK_NAME = process.env.SNAKE_PK_NAME || "pk";
const PK_VALUE = process.env.SNAKE_PK_VALUE || "global";

module.exports = async function getBestScore(req, res) {
  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: TABLE,
        Key: { [PK_NAME]: PK_VALUE },
      })
    );

    const bestScore = Number(result.Item?.bestScore ?? 0) || 0;
    return res.json({ bestScore });
  } catch (err) {
    console.error("[snake/getBestScore]", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
