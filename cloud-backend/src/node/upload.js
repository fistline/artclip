'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: "ap-northeast-2" });

const DbArtclip = require('./dynamo/artclip.dynamo')


module.exports.video_content = async (event, context) => {
  
  const s3 = new AWS.S3({
    region: "ap-northeast-2",
    signatureVersion: "v4"
  });

  /**** need account's crypto-session check !!! */

  console.log('event.body::',event.body)
  const params = JSON.parse(event.body);
  console.log(params)

  const dbArtclip = new DbArtclip();

  const paserdInfo = JSON.parse(params.mediainfo)

  const db_res = await dbArtclip.put(params.account,params.name, paserdInfo, 'artclip-input'+params.name, params.type)
  console.log('saved !!!!', db_res);

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
      uploadURL,
      "result":db_res
    }),
  };
  return response
};