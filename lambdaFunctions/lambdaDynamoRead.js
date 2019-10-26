const aws = require("aws-sdk");
const s3 = new aws.S3({ apiVersion: "2006-03-01" });
const docClient = new aws.DynamoDB.DocumentClient();

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

exports.handler = async (event, context) => {
  console.log("inside function");

  try {
    let s3Promise = await s3
      .getObject({
        Bucket: "colincontrearyfinalprojectbucket",
        Key: "turtlecount.txt"
      })
      .promise();
    let highestIndex = Number(s3Promise.Body);
    console.log(highestIndex);

    const index = randomIntFromInterval(1, highestIndex);
    const key = `turtle${index}.jpg`;
    const objectURL = `https://colincontrearyfinalprojectbucket.s3-us-west-1.amazonaws.com/${key}`;
    const params = { TableName: "ddbFinalProject", Key: { url: objectURL } };

    let dynamoPromise = await docClient.get(params).promise();
    console.log("Dynamo result", dynamoPromise);

    const requestParams = {
      statusCode: 200,
      isBase64Encoded: false,
      headers: { "my-header-key": "my-header-value" },
      body: dynamoPromise
    };

    return requestParams;
  } catch (e) {
    console.log(e);
  }
};
