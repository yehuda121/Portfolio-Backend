// src/routes/snake/submitScore.js
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ddb } = require("../../config/awsDdbClient");

const TABLE = "snake_bestScore";
const PK_NAME = "pk";
const SK_NAME = "sk";

const PK_VALUE = "snake";
const SK_VALUE = "global";


module.exports = async function submitScore(req, res) {
  try {
    const score = Number(req.body?.score);

    if (!Number.isFinite(score) || score < 0) {
      return res.status(400).json({ message: "Invalid score" });
    }

    // Read current best
    const currentRes = await ddb.send(
      new GetCommand({
        TableName: TABLE,
        Key: {
          [PK_NAME]: PK_VALUE,
          [SK_NAME]: SK_VALUE,
        },
      })
    );

    const currentBest = Number(currentRes.Item?.bestScore ?? 0) || 0;
    const newBest = Math.max(score, currentBest);

    // Save only if improved 
    if (newBest !== currentBest) {
      await ddb.send(
        new PutCommand({
          TableName: TABLE,
          Item: {
            [PK_NAME]: PK_VALUE,
            [SK_NAME]: SK_VALUE,
            bestScore: newBest,
            updatedAt: new Date().toISOString(),
          },
        })
      );
    }

    return res.json({ bestScore: newBest });
  } catch (err) {
    console.error("[snake/submitScore]", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
