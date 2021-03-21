# artclip
We make a platform that split one video into multiple pieces, makes it into NFT tokens, and sell it.


## showcase
### https://hack.ethglobal.co/showcase/artclip-recpDXNo2Y6s21J2D

## plan
https://docs.google.com/presentation/d/1ZG_-x_3LMR5IajMgb7YACjAParvEAbjfLrve0fBdOm4/edit?usp=sharing

## github
### https://github.com/fistline/artclip

# cloud-backend
video upload(input bucket) => trigger work ==> video segmentation work(log dynamodb) ==> thumbnail capture ==> outbucket(log dynamodb)

# aws infra
s3, lambda, apigateway, mediaconvert, dynamodb, cloudfront


# crypto-session
Session Management



# frontend
web3 based NFT market & NFT Issue

trailwindcss (https://tailwindcss.com/)
trailwindcss component(https://tailwindcomponents.com/)

scrollmagic(https://scrollmagic.io/)

main design concept
# https://codepen.io/TurkAysenur/pen/RwWKYMO
# https://www.tailwindtoolbox.com/templates/nordic-store

https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html

https://codepen.io/mongodb-docs/pen/PaBvMN

리스트
https://codepen.io/fistline/pen/oNYKajZ
https://codepen.io/slycreations/pen/wvoxzBP

# excution

npm install

npm run start

npm run build

//authorized
npm run deploy
# smartcontract
NFT issue
Market management
issuer management


### ref
https://eips.ethereum.org/EIPS/eip-721
https://ethereum.org/en/developers/docs/standards/tokens/erc-721/

https://github.com/OpenZeppelin/openzeppelin-contracts
https://ko.docs.klaytn.com/smart-contract/sample-contracts/erc-721/1-erc721

#### Artclip NFT ropsten deployment
Deploying 'Artclip'
   -------------------
   > transaction hash:    0x0b8e12fb543f41b066960397b2aa6041aaa67800f009c99380f0b2bc87d32534
   > Blocks: 2            Seconds: 41
   > contract address:    0x0CA56Ec17b56961352024B455db82D7Fe1dD450F
   > block number:        9869361
   > block timestamp:     1616223649
   > account:             0x7853A600fcDF07a957Dd8f891677ea5dc4e908D1
   > balance:             2.782951865191720256
   > gas used:            2473024 (0x25bc40)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.04946048 ETH

   Pausing for 2 confirmations...
   ------------------------------
   > confirmation number: 1 (block: 9869362)
   > confirmation number: 2 (block: 9869363)
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.04946048 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.04946048 ETH


# compile version
0.5.17+commit.d19bba13.Emscripten.clang

https://ropsten.etherscan.io/tx/0x0b8e12fb543f41b066960397b2aa6041aaa67800f009c99380f0b2bc87d32534

https://ropsten.etherscan.io/address/0x0CA56Ec17b56961352024B455db82D7Fe1dD450F#code

