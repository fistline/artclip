'use strict';
const AWS = require('aws-sdk');

module.exports.video_content = async (event, context) => {
  AWS.config.update({ region: "ap-northeast-2" });
  const s3 = new AWS.S3();

  console.log('event.body::',event.body)
  const params = JSON.parse(event.body);
  console.log(params)

  const s3Params = {
    Bucket: 'artclip-input',
    Key: params.name,
    ContentType: params.type,
    ACL: 'public-read-write'
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