// src/routes/snake/getBestScore.js
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { ddb } = require("../../config/awsDdbClient");

const TABLE = "snake_bestScore";
const PK_NAME = "pk";
const SK_NAME = "sk";

const PK_VALUE = "snake";
const SK_VALUE = "global";


module.exports = async function getBestScore(req, res) {
    try {
        const result = await ddb.send(
            new GetCommand({
                TableName: TABLE,
                Key: {
                    [PK_NAME]: PK_VALUE,
                    [SK_NAME]: SK_VALUE,
                },
            })
        );

        const bestScore = Number(result.Item?.bestScore ?? 0) || 0;
        return res.json({ bestScore });
    } catch (err) {
        console.error("[snake/getBestScore]", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
