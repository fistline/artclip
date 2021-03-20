'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "ap-northeast-2" });

module.exports.split = async (event, context) => {
  
  const s3 = new AWS.S3({
    region: "ap-northeast-2",
    signatureVersion: "v4"
  });

  console.log('event.body::',event.body)
  const params = JSON.parse(event.body);
  console.log(params)

  const s3Params = {
    Bucket: 'artclip-input',
    Key: params.name,
    Expires: 60 * 30,
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


function createJob(sourceBk, sources3key, role, region, table, item){

}