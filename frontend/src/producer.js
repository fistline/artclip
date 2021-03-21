// import 'bootstrap'
import $ from 'jquery';
window.$ = window.jQuery = $;



// import Web3 from 'web3'
window.ethEnabled  = () => {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    // console.log(window.web3)
    getAccounts(console.log)
    return true;
  }
  return false;
}

window.ethereum.on('accountsChanged', function (accounts) {
  // Time to reload your interface with accounts[0]!
  //alert(accounts)
  window.accounts = accounts;
});