var AWS = require("aws-sdk");
var uuid = require('uuid');


module.exports = class DbArtclip {
    docClient;
    table = 'artclip';
    constructor() {
        AWS.config.update({
            region: 'ap-northeast-2'
        });

        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    SK_File(_account, _title) {
        return 'ACC/NAME#' + _account+'/'+ _title;
    }

    put(_account, _title, _mediainfo, _path, _type) {
        const now = Date.now();
         const sk = this.SK_File(_account, _title)
        var params = {
            TableName: this.table,
            Item: {
                pk: uuid.v1(),
                sk:sk,
                title: _title,
                path: _path,
                mediainfo:_mediainfo,
                content_type:_type,

                status:"pendding",
                message:"",
                created_by: _account,
                created_at: now,
                updated_at: now
            },
            ReturnValues: "ALL_OLD"
        };
        // console.log('saveRule excute:::', params)
        return new Promise((resolve, reject) => {
            this.docClient.put(params, function (error, data) {
                if (error) {
                    console.log('db error(',params,')')
                    reject(error)

                } else {
                    resolve(data)
                }
            });
        });
    }

    queryTitle(_filename){
        var params = {
            TableName: this.table,
            IndexName: "title_index",
            KeyConditionExpression: " title=:title",
            ExpressionAttributeValues: {
                ":title": _filename
            }
        }
        console.log('query filename index::', params)
        return new Promise((resolve, reject) => {
            this.docClient.query(params, function (error, data) {
                if (error) {
                    console.log('queryTitle db error: (', params, ')', error)
                    reject(error)
                } else {
                    console.log('queryTitle db complete')
                    resolve(data)
                }
            })
        });
    }


    list() {
        // var table = 'tms_rules'; // process.env.DYNAMODB_RULE_TABLE;
        var params = {
            TableName: this.table,
            // KeyConditionExpression: "#sp = :sp",
            // FilterExpression:"#sp = :sp",
            ExpressionAttributeNames: {
                // "#": "",
            },
            ExpressionAttributeValues: {
                // ":": 
            }
        }
        // console.log('list:', params)
        return new Promise((resolve, reject) => {
            this.docClient.scan(params, function (error, data) {
                if (error) {
                    console.log('db error list(', params,')', error)
                    reject(error)
                } else {
                    console.log('list db complete')
                    resolve(data)
                }
            })
        });
    }


}
