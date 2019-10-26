const aws = require("aws-sdk");
const s3 = new aws.S3({ apiVersion: "2006-03-01" });
const docClient = new aws.DynamoDB.DocumentClient();

function extractId(key) {
  let patt = new RegExp("[0-9]+");
  let res = Number(patt.exec(key));
  return res;
}

function createURL(key) {
  let res = `https://colincontrearyfinalprojectbucket.s3-us-west-1.amazonaws.com/${key}`;
  return res;
}

exports.handler = async (event, context) => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  // Dynamo variables
  const id = extractId(key);
  const url = createURL(key);
  const params = {
    TableName: "ddbFinalProject",
    Item: { url: url, name: key, id: id }
  };

  // S3 variables
  const strId = String(id);
  const s3params = { Bucket: bucket, Key: "turtlecount.txt", Body: strId };

  try {
    // Write To S3 The Updated Number of Turtles
    let s3Promise = await s3.putObject(s3params).promise();
    console.log("Successfully wrote to S3");

    let dynamoPromise = await docClient.put(params).promise();
    console.log("Successfully wrote to Dynamo");
  } catch (e) {
    console.log("An error occurred", e);
    throw new Error(e);
  }
};

// ORIGINAL WORKING FUNCTION
/*
const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const docClient = new aws.DynamoDB.DocumentClient();

function extractId(key) {
    let patt = new RegExp("[0-9]+");
    let res = Number(patt.exec(key));
    return res;
}

function createURL(key) {
    let res = `https://colincontrearyfinalprojectbucket.s3-us-west-1.amazonaws.com/${key}`;
    return res;
}

exports.handler = (event, context, callback) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    const id = extractId(key);
    const url = createURL(key);
    
    const params = { TableName: "ddbFinalProject", Item: { "url": url, "name": key, "id": id } };
        
    docClient.put(params, function(err, data) { 
        if (err) {
            console.log(err, err.stack); 
            callback(null, { statusCode: '500', body: err }); 
        } else { 
            callback(null, { statusCode: '200', body: `${key} successfully added!` });
        }
    });
    }
*/
