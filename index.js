const openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path

// put keys in backtick (``) to avoid errors caused by spaces or tabs
const pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
...
-----END PGP PUBLIC KEY BLOCK-----`;
const privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
...
-----END PGP PRIVATE KEY BLOCK-----`; //encrypted private key
const passphrase = `yourPassphrase`; //what the privKey is encrypted with

const encryptDecryptFunction = async () => {
  const privKeyObj = openpgp.key.readArmored(privkey).keys[0];
  await privKeyObj.decrypt(passphrase);

  const options = {
    data: 'Hello, World!', // input as String (or Uint8Array)
    publicKeys: openpgp.key.readArmored(pubkey).keys, // for encryption
    privateKeys: [privKeyObj] // for signing (optional)
  };

  openpgp
    .encrypt(options)
    .then(ciphertext => {
      encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
      return encrypted;
    })
    .then(encrypted => {
      const options = {
        message: openpgp.message.readArmored(encrypted), // parse armored message
        publicKeys: openpgp.key.readArmored(pubkey).keys, // for verification (optional)
        privateKeys: [privKeyObj] // for decryption
      };

      openpgp.decrypt(options).then(plaintext => {
        console.log(plaintext.data);
        return plaintext.data; // 'Hello, World!'
      });
    });
};

encryptDecryptFunction();
