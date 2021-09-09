import Web3 from 'web3';
import authentification from '../build/contracts/authentification.json';


let web3;
let Authentification;
var randomstring = require("randomstring");
////////////////////////////////////////////////////////////////////
//////////////////////////initiation web3-metamask-//////////////////////////

const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

/////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////:initiation contrat//////////////////////////////////////
const initContract = () => {
  const deploymentKey = Object.keys(authentification.networks)[0];
  return new web3.eth.Contract(
    authentification.abi, 
    authentification
      .networks[deploymentKey]
      .address
  );
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////initiation de l'application///////////////////////////////////////

/*const signTest = async () => {

let accounts = await web3.eth.getAccounts();
  let msg = "Some data"
 console.log(accounts[0]);
  // Using eth.sign()
 
  

  let prefix = "\x19Ethereum Signed Message:\n" + msg.length;
   console.log(prefix);
  let msgHash1 = web3.utils.sha3(prefix+msg)
  console.log(msgHash1);
  console.log(msg);
  console.log(accounts[0]);
  
  let sig1 = await web3.eth.personal.sign( msg ,accounts[0]).then(console.log)
  


   // Using eth.accounts.sign() - returns an object

   let privateKey = "ec57a2b0b044712f298a68a8cb24afa5f2be76e17468627f59e78b1736e300eb"

   let sigObj = await web3.eth.accounts.sign(msg, privateKey)
   console.log(sigObj);
   let msgHash2 = sigObj.messageHash;
   console.log(msgHash2);
   let sig2 = sigObj.signature;
   console.log(sig2);
 

  
};*/


const initApp = async  () => {

  const $auth = document.getElementById('auth');

  const $app = document.getElementById('app');

  const $data = document.getElementById('data');

  console.log($auth);
  console.log($app)

  let  accounts = await web3.eth.getAccounts();

  let  msg = randomstring.generate(8);
     
  let messageHash= web3.eth.accounts.hashMessage(msg);
      
  let sig =  await web3.eth.personal.sign( msg ,accounts[0]);

  console.log("signature: " +sig);
  console.log();

   
  $data.innerHTML = ("appuyer pour vous authentifier");

  $auth.addEventListener('submit', async  (e) => {
    e.preventDefault();
    $data.innerHTML = ("en attente d'authentification");
   await Authentification.methods.authentication(accounts[0],$app[$app.selectedIndex].value,messageHash,sig).call()
    .then(result => 
      { console.log();
        $data.innerHTML = (result);
     });

  });



  
};


document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      Authentification = initContract();
    
      initApp(); 
    })
    .catch(e => console.log(e.message));
});