// backend/src/services/ddb.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.AWS_REGION || "eu-north-1";

const ddbClient = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE = process.env.DDB_TABLE_BEST_SCORE;

function assertTable() {
  if (!TABLE) throw new Error("Missing env var: DDB_TABLE_BEST_SCORE");
}

async function getBestScore() {
  assertTable();
  const pk = "snake#bestScore";

  const res = await docClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: { pk },
    })
  );

  if (!res.Item) return { bestScore: 0 };

  return { bestScore: Number(res.Item.bestScore) || 0 };
}

async function setBestScoreIfHigher(newScore) {
  assertTable();
  const pk = "snake#bestScore";

  const current = await getBestScore();
  if (Number(newScore) <= current.bestScore) {
    return { bestScore: current.bestScore, updated: false };
  }

  await docClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        pk,
        bestScore: Number(newScore),
        updatedAt: new Date().toISOString(),
      },
    })
  );

  return { bestScore: Number(newScore), updated: true };
}

module.exports = { getBestScore, setBestScoreIfHigher };
