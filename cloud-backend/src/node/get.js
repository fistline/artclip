'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: "ap-northeast-2" });

const DbArtclip = require('./dynamo/artclip.dynamo')


module.exports.get = async (event, context) => {
  
//   console.log('event.body::',event.body)
//   const params = JSON.parse(event.body);
//   console.log(params)
  const id = event.pathParameters.id;
  const dbArtclip = new DbArtclip();

  const db_res = await dbArtclip.get(id)
  console.log('get list !!!!', db_res);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      "result":db_res
    }),
  };
  return response
};