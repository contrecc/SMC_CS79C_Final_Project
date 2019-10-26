var aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = (event, context, callback) => { 
    let params = { Bucket: "colincontrearyfinalprojectbucket", Key: "turtlecount.txt" };
    console.log(params);
    
    s3.getObject(params, function(err, data) {
        if(err) {
            console.log(err, err.stack);
            callback(err, null);
        } else {
            console.log("Raw test:\n" + data.Body.toString("ascii"));
            callback(null, {statusCode: 200, body: data.Body.toString("ascii")});
        }
    });
};

