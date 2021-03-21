// const Short = require('short-uuid');
// require('mediainfo.js/dist/mediainfo.min.js')
// import 'mediainfo.js/dist/mediainfo.min.js';
// window.uuid = Short.generate();

// import * as Short from 'short-uuid';

// // alert(Short.generate())

// window.onload = function(){
//     window.Short = Short;

// }
import Web3 from 'web3';

window.ethEnabled  = () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
      return true;
    }
    alert('need metamask')
    return false;
  }
  
window.ethereum.on('accountsChanged', function (accounts) {
    // Time to reload your interface with accounts[0]!
    alert(accounts[0])
    window.accounts = accounts;
    localStorage.setItem('accounts', accounts[0]);

  });

//   window.web3.currentProvider.publicConfigStore.on('update', function(accounts){
//     alert(accounts)
//     window.accounts = accounts;
//   });
