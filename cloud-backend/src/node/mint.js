'use strict';

const AWS = require('aws-sdk');
AWS.config.update({ region: "ap-northeast-2" });

const Web3 = require("web3");
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Contract = require('web3-eth-contract');
var Tx = require("ethereumjs-tx").Transaction

const DbArtclip = require('./dynamo/artclip.dynamo')

const iArtclip = require('./Artclip.json')

module.exports.get = async (event, context) => {


    //   console.log('event.body::',event.body)
    //   const params = JSON.parse(event.body);
    //   console.log(params)

    const contentid = event.pathParameters.contentid;
    const seq = event.pathParameters.seq;
    const owner = event.pathParameters.owner;

}

async function test(contentid,seq, owner ){

    const dbArtclip = new DbArtclip();

    //   const db_res = await dbArtclip.get(id)
    //   console.log('get list !!!!', db_res);

    
    const accountAddr = '0x7853A600fcDF07a957Dd8f891677ea5dc4e908D1'
    const privateKey = '1162b72c6797353ebe027f551d5d96e765dc2a5d741a8637dfc741cbb5b5d372'
    const artclipContractAddr = '0x0CA56Ec17b56961352024B455db82D7Fe1dD450F'


    // const web3 = new Web3(new HDWalletProvider(privateKey, `https://ropsten.infura.io/v3/7383bec6645148db976b44a357797d3e`));
    const web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/7383bec6645148db976b44a357797d3e'));
    const artclipContract = new web3.eth.Contract(iArtclip.abi, "0x0CA56Ec17b56961352024B455db82D7Fe1dD450F");
    const tx = {
        // this could be provider.addresses[0] if it exists
        from: accountAddr, 
        // target address, this could be a smart contract address
        to: artclipContractAddr, 
        // optional if you want to specify the gas limit 
        gas: web3.utils.toHex(800000), 

        gasPrice: web3.utils.toHex(web3.utils.toWei('200', 'gwei')),
        
        // this encodes the ABI of the method and the arguements
        data: artclipContract.methods.mintClip(contentid, seq, owner).encodeABI()
      };
      
      
      const sendRawTransaction = txData => {
  // get the number of transactions sent so far so we can create a fresh nonce
  web3.eth.getTransactionCount(addressFrom).then(txCount => {
    const newNonce = web3.utils.toHex(txCount)
    const transaction = new Tx({ ...txData, nonce: newNonce }, { chain: 'mainnet' }) // or 'rinkeby'
    transaction.sign(privateKey)
    const serializedTx = transaction.serialize().toString('hex')
    return web3.eth.sendSignedTransaction('0x' + serializedTx)
  })


// fire away!
// (thanks @AndreiD)
sendRawTransaction(txData).then(result => {
  result
    .on('transactionHash', txHash => {
      console.log('transactionHash:', txHash)
    })
    .on('receipt', receipt => {
      console.log('receipt:', receipt)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      if (confirmationNumber >= 1) {
        console.log('confirmations:', confirmationNumber, receipt)
      }
    })
    .on('error:', error => {
      console.error(error)
    })

    // const response = {
    //     statusCode: 200,
    //     headers: {
    //         'Access-Control-Allow-Origin': '*'
    //     },
    //     body: JSON.stringify({
    //         "result": ''
    //     }),
    // };
    // return response
    });
        }
};






async function test1(contentid,seq, owner ){

    const accountAddr = '0x7853A600fcDF07a957Dd8f891677ea5dc4e908D1'
    const privateKey = '1162b72c6797353ebe027f551d5d96e765dc2a5d741a8637dfc741cbb5b5d372'
    const artclipContractAddr = '0x0CA56Ec17b56961352024B455db82D7Fe1dD450F'


    const web3 = new Web3(new HDWalletProvider(privateKey, `https://ropsten.infura.io/v3/7383bec6645148db976b44a357797d3e`));
    // const web3 = new Web3("https://ropsten.infura.io/v3/7383bec6645148db976b44a357797d3e")

    const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/7383bec6645148db976b44a357797d3e"))
    const artclipContract = new web3.eth.Contract(iArtclip.abi, "0x0CA56Ec17b56961352024B455db82D7Fe1dD450F");
    const payload = {
        // this could be provider.addresses[0] if it exists
        from: accountAddr, 
        // target address, this could be a smart contract address
        to: artclipContractAddr, 
        // optional if you want to specify the gas limit 
        gas: web3.utils.toHex(800000), 

        gasPrice: web3.utils.toHex(web3.utils.toWei('200', 'gwei')),
        
        // this encodes the ABI of the method and the arguements
        data: artclipContract.methods.mintClip(contentid, seq, owner).encodeABI(),
      };

      artclipContract.method.mintClip(contentid, seq, owner).send({from: accountAddr, gas: web3.utils.toHex(800000), gasPrice: web3.utils.toHex(web3.utils.toWei('200', 'gwei'))})
      .on('transactionHash', function(hash){
        console.log('hash:: ', hash)
      })
      .on('confirmation', function(confirmationNumber, receipt){
          console.log('confirmationNumber:: ',confirmationNumber, receipt)
      })
      .on('receipt', function(receipt){
        console.log('receipt: ',receipt)
      })

      
    //   var signedTx = new Tx(tx, {chain:'ropsten'})
    // //   const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    // //   const signedTx = await account.signTransaction(tx, privateKey)
    //   web3.utils.isHex(signedTx.raw) // is true
    //   console.log('$$', web3.utils.isHex(signedTx.raw))
    //   const receipt = await web3.eth.sendSignedTransaction(signedTx.raw)
    //   console.log(receipt)

    // var privKey = new Buffer(privateKey, 'hex');
    // const tx = new Tx(payload);
    // tx.sign(privKey);
    // const serializedTx = `0x${tx.serialize().toString('hex')}`;
    
    // const res = await web3.eth.sendSignedTransaction(serializedTx);
    // console.log(res)


    

    // var signedTx = new Tx(payload, {chain:'ropsten'})

    // //   console.log('transaction', transaction)

    // // const receipt = await web3.eth.sendSignedTransaction(transaction.raw)
    // // console.log(receipt)

    // web3.eth.sendSignedTransaction(signedTx.raw).then(receipt=>{
    //     console.log(receipt)
    // }).catch(e=>{
    //     console.log(e)
    // })


    // var buffer_pk = new Buffer.from(privateKey, 'hex')


    // var tx = new Tx(payload);
    // tx.sign(buffer_pk);

    // var serializedTx = tx.serialize();

    // // console.log(serializedTx.toString('hex'));
    // // 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

    // web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    // .on('receipt', console.log);


};



//test1('test11111',0, '0x7853A600fcDF07a957Dd8f891677ea5dc4e908D1');

