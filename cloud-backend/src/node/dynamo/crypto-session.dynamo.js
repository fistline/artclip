
var AWS = require("aws-sdk");
var uuid = require('uuid');
var parser = require('ua-parser-js');


/**

 */

module.exports = class DmoUserAgent {
    docClient;
    table = 'artclip';
    constructor() {
        AWS.config.update({
            region: 'ap-northeast-2'
        });

        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    uaPK(cid) {
        return 'USR#' + cid;
    }
    uaSK(ip, ua) {
        // console.log(ip, ua)
        let deviceModel = 'n';
        let cpu = 'n';
        let deviceType = 'n'
        let os = 'n'
        if (ua.device.type) {
            deviceType = ua.device.type
        }
        if (ua.device.model) {
            deviceModel = ua.device.model
        }
        if (ua.cpu.architecture) {
            device = ua.cpu.architecture
        }
        if (ua.os.name) {
            os = ua.os.name
        }
        return 'UA#' + ip + '#' + deviceType + '#' + os + '#' + deviceModel + '#' + cpu;
    }
    uaSK2(spid, cid, ua) {
        let deviceModel = 'n';
        let deviceType = 'n'
        let cpu = 'n';
        let os = 'n';
        let browser = 'n'
        if (ua.device.model) {
            deviceModel = ua.device.model
        }
        if (ua.device.type) {
            deviceType = ua.device.type
        }
        if (ua.cpu.architecture) {
            cpu = ua.cpu.architecture
        }
        if (ua.os.name) {
            os = ua.os.name
        }
        if (ua.browser.name) {
            browser = ua.browser.name
        }
        return 'UA#' + cid + '#' + deviceType + '#' + deviceModel + '#' + cpu +'#' + os+ '#' + browser;
    }

    uaSkbyIp(ip) {
        return 'UA#' + ip;
    }

  
    putUA(account, ips, userAgent) {
        const now = new Date(Date.now());
        const arrIps = ips.split(',')
        var ua_parserd = parser(userAgent);

        const pkey = this.uaPK(acc)
        const skey = this.uaSK(arrIps[0], ua_parserd)
        const skey2 = this.uaSK2(spid, cid, ua_parserd);

        var params = {
            TableName: this.table,
            Key: {
                "pk": pkey,
                "sk":skey
            },
            UpdateExpression: "set sk2=:sk2, sp_id=:spid, account=:account, ip=if_not_exists(ip,:ip), ua=:ua, cnt = if_not_exists(cnt, :null_val) + :cnt,  created_at =:now, updated_at=:now",
            ExpressionAttributeValues: {
                ":sk2": skey2,
                ":account": account,
                ":ip": this.docClient.createSet(arrIps),
                ":ua": ua_parserd,
                ":now": now,
                ":null_val":0
            },
            ReturnValues: "UPDATED_NEW"
        };


        console.log('putUA excute:::', params)

        return new Promise((resolve, reject) => {
            this.docClient.update(params, function (error, data) {
                if (error) {
                    console.log('db error: putDevice()', params, error)
                    reject(error)

                } else {
                    resolve(data)
                }
            });
        });
    }

    updateIp(cid,  ips, userAgent) {
        const now = new Date(Date.now());
        const arrIps = ips.split(',')
        // console.log(arrIps)
        var ua_parserd = parser(userAgent);

        const pkey = this.uaPK(cid)
        const skey = this.uaSK(arrIps[0], ua_parserd)
        
        var params = {
            TableName: this.table,
            Key: {
                "pk": pkey,
                "sk":skey
            },
            UpdateExpression: "Add ip :ip",
            ExpressionAttributeValues: {
                ":ip": this.docClient.createSet(arrIps),
            },
            ReturnValues: "UPDATED_NEW"
        };


        // console.log('putDevice excute:::', params)

        return new Promise((resolve, reject) => {
            this.docClient.update(params, function (error, data) {
                if (error) {
                    console.log('db error: updateIp()', params, error)
                    reject(error)

                } else {
                    resolve(data)
                }
            });
        });
    }

    /**
    * get user-agent until IP(동일 아이피로 검색)
    */
    getUAtoIP(cid, ip) {
        const arrIps = ip.split(',')
        const pkey = this.uaPK(cid)
        const skbyip = this.uaSkbyIp(arrIps[0])
        
        const params = {
            TableName: this.table,
            KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
            ExpressionAttributeNames: {
                "#pk": "pk",
                "#sk": 'sk'
            },
            ExpressionAttributeValues: {
                ":pk": pkey,
                ":sk": skbyip
            }
        }

        console.log('getDevice param:', params)
        return new Promise((resolve, reject) => {
            this.docClient.query(params, function (error, data) {
                if (error) {
                    console.log('db error: getProduct()', params, error)
                    reject(error)
                } else {
                    console.log('user_agent.getUAtoIP db complete')
                    resolve(data)
                }
            })
        });
    }

    /**
    * get user-agent until IP(동일 아이피 및 디바이스로 검색)
    */
    getUAtoDevice(cid, ip, userAgent) {
        const arrIps = ip.split(',')
        const pkey = this.uaPK(cid)
    
        var ua_parserd = parser(userAgent);
        const skey = this.uaSK(arrIps[0], ua_parserd)
        
        const params = {
            TableName: this.table,
            KeyConditionExpression: '#pk = :pk and begins_with(#sk, :sk)',
            ExpressionAttributeNames: {
                "#pk": "pk",
                "#sk": 'sk'
            },
            ExpressionAttributeValues: {
                ":pk": pkey,
                ":sk": skey
            }
        }

        console.log('getDevice param:', params)
        return new Promise((resolve, reject) => {
            this.docClient.query(params, function (error, data) {
                if (error) {
                    console.log('db error: getProduct()', params, error)
                    reject(error)
                } else {
                    console.log('user_agent.getUAtoDevice db complete')
                    resolve(data)
                }
            })
        });
    }






}
