const openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp
const secrets = require('./config/keys');
openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path

// put keys in backtick (``) to avoid errors caused by spaces or tabs
const pubkey = secrets.testPubKey;
const privkey = secrets.privkey; //encrypted private key
//const passphrase = `yourPassphrase`; //what the privKey is encrypted with

const encryptDecryptFunction = async () => {
  //const privKeyObj = openpgp.key.readArmored(privkey).keys[0];
  //await privKeyObj.decrypt(passphrase);

  const options = {
    data: 'Hello, World!', // input as String (or Uint8Array)
    publicKeys: openpgp.key.readArmored(pubkey).keys // for encryption
  };

  openpgp
    .encrypt(options)
    .then(ciphertext => {
      encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
      //return encrypted;
      console.log(ciphertext.data);
    })
    .then(encrypted => {
      const options = {
        message: openpgp.message.readArmored(encrypted), // parse armored message
        privateKeys: privkey // for decryption
      };

      openpgp.decrypt(options).then(plaintext => {
        console.log(plaintext.data);
        return plaintext.data; // 'Hello, World!'
      });
    });
};

encryptDecryptFunction();
