'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: "ap-northeast-2" });

const Web3 = require("web3");
const Contract = require('web3-eth-contract');
var Tx = require("ethereumjs-tx").Transaction
const DbArtclip = require('./dynamo/artclip.dynamo')

const iArtclip = require('./Artclip.json')

const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/7383bec6645148db976b44a357797d3e"))

module.exports.mint = async (event, context) => {


    //   console.log('event.body::',event.body)
    //   const params = JSON.parse(event.body);
    //   console.log(params)

    const contentid = event.pathParameters.contentid;
    const seq = event.pathParameters.seq;
    const owner = event.pathParameters.owner;

    web3.eth.getTransactionCount(
      '0x7853A600fcDF07a957Dd8f891677ea5dc4e908D1',
    ).then(nonce=>{
      _mintToken(contentid, seq, owner, nonce).then(r=>{
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            "result":r
          }),
        };
      }).catch(e=>{

        const response = {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            "result":e
          }),
        };

      })
    });

}



async function _mintToken(contentid, seq, owner, nonce){
  const accountAddr = '0x7853A600fcDF07a957Dd8f891677ea5dc4e908D1'
    const pksec = '1162b72c6797353ebe027f551d5d96e765dc2a5d741a8637dfc741cbb5b5d372'
    const artclipContractAddr = '0x0CA56Ec17b56961352024B455db82D7Fe1dD450F'

    const artclipContract = new web3.eth.Contract(iArtclip.abi, artclipContractAddr);

    var privateKey = Buffer.from(pksec, 'hex');
    
    console.log('nonce:',nonce)
    var rawTx = {
      nonce: web3.utils.toHex(nonce),
      gasPrice: web3.utils.toHex(web3.utils.toWei('200', 'gwei')),
      gas: web3.utils.toHex(800000), 
      to: artclipContractAddr,
      value: '0x00',
      data: artclipContract.methods.mintClip(contentid, seq, owner).encodeABI()
    }

    var tx = new Tx(rawTx, {'chain':'ropsten'});
    tx.sign(privateKey);

    var serializedTx = tx.serialize();

  return new Promise((resolve, reject) => {
    try {
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', receipt => {
          resolve(receipt)
        }).catch(e => reject)
    } catch (e) {
      reject(e)
    }

  })
    

    // const txHash = await web3.utils.sha3(serializedTx);
    // console(txHash)
    // return txHash;
}

