

solium --init
npm install

# compile
npm run compile
"truffle compile",
# flat code
npm run flat
"truffle-flattener ./contracts/Artclip.sol > ./flat/Artclip.sol",

# audit
npm run audit
"solium -f ./contracts/Artclip.sol",

npm run audit:flat
"solium -f ./flat/Artclip.sol",

# deployment
npm run deploy
"truffle migrate --reset",
npm run deploy:ropsten
"truffle migrate --reset --network ropsten"

### 참고자료
https://eips.ethereum.org/EIPS/eip-721
https://ethereum.org/en/developers/docs/standards/tokens/erc-721/

https://github.com/OpenZeppelin/openzeppelin-contracts
https://ko.docs.klaytn.com/smart-contract/sample-contracts/erc-721/1-erc721



# ropsten deployment
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
