'use strict';
const AWS = require('aws-sdk');

module.exports.s3upload = async (event, context) => {
  const s3 = new AWS.S3();
  const params = JSON.parse(event.body);

  const s3Params = {
    Bucket: 'artclip-input',
    Key: params.name,
    ContentType: params.type,
    ACL: 'public-read'
  }

  const uploadURL = s3.getSignedUrl('putObject', s3Params)

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadURL
    }),
  };
  return response
};