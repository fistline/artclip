'use strict';
const AWS = require('aws-sdk');
AWS.config.update({ region: "ap-northeast-2" });

module.exports.changed = async (event, context) => {
  // console.log('event:::',event)
  console.log('context:::', context)
  console.log('event:::',JSON.stringify(event))
  
};