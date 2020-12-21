// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region 
AWS.config.update({region: 'ap-southeast-1'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB();

ddb.listTables(function(err, data) {
    if (err) {
      console.log("Error", err.code);
    } else {
      console.log("Table names are ", data.TableNames);
    }
  });