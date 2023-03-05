import React, { useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import TronWeb from 'tronweb';
import { Keypair } from '@solana/web3.js';
import { saveAs } from 'file-saver';
// import bitcoin from 'bitcoinjs-lib';
// const bitcoin=require('bitcoinjs-lib');
// import {HD} from 'bitcoinjs-lib';



function App() {
  const [numKeys, setNumKeys] = useState(10);
  const [blockchain, setBlockchain] = useState('ethereum');
  const [keys, setKeys] = useState([]);

  const generateKeys = async () => {
    let keysArr = [];
    switch (blockchain) {

      // case 'bitcoin':
      //   for (let i = 0; i < numKeys; i++) {
      //     //     const { privateKey, publicKey } = bitcoin.ECPair.makeRandom();
      //     const privateKey = HD.create_random();
      //     const publicKey = privateKey.public_key();
      //     const keyPair = {
      //       privateKey: privateKey.toString("hex"),
      //       address: publicKey.toString("hex")
      //     };

      //     keysArr.push(keyPair);
      //   }
      //   break;


      case 'ethereum':
        for (let i = 0; i < numKeys; i++) {
          const wallet = ethers.Wallet.createRandom();
          const keyPair = {
            privateKey: wallet.privateKey,
            address: wallet.address,
            // mnemonic: bip39.generateMnemonic(),
          };
          keysArr.push(keyPair);
        }
        break;

      case 'tron':
        const tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io',
        });
        for (let i = 0; i < numKeys; i++) {
          const { privateKey } = await tronWeb.createAccount();
          const address = tronWeb.address.fromPrivateKey(privateKey);
          const keyPair = {
            privateKey, address,
            //  mnemonic: bip39.generateMnemonic(),

          };
          keysArr.push(keyPair);
        }
        break;

      case 'solana':
        for (let i = 0; i < numKeys; i++) {
          const keypair = Keypair.generate();
          const keyPair = {
            privateKey: keypair.secretKey.toString(), address: keypair.publicKey.toString(),
            //  mnemonic: bip39.generateMnemonic(), 
          };
          keysArr.push(keyPair);
        }
        break;



      default:
        console.log('Invalid blockchain selected');
        break;
    }
    setKeys(keysArr);
  };

  const downloadKeys = () => {
    const csv = [
      ['Private Key', 'Public Address'],
      ...keys.map((key) => [key.privateKey, key.address, key.mnemonic])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${blockchain}_keys.csv`);
  }

  return (
    <>
      <div>
        <label>Number of keys to generate:</label>
        <input
          type="number"
          min="1"
          max="100"
          value={numKeys}
          onChange={(e) => setNumKeys(e.target.value)}
        />
      </div>

      <div>
        <label>Select blockchain:</label>
        <select value={blockchain} onChange={(e) => setBlockchain(e.target.value)}>
          {/* <option value="bitcoin">Bitcoin</option> */}
          <option value="ethereum">Ethereum</option>
          <option value="tron">Tron</option>
          <option value="solana">Solana</option>
        </select>
      </div>
      <div>
        <button onClick={generateKeys}>Generate Keys</button>
      </div>

      <div className='csvfile'>
        {keys.length > 0 &&
          <>
            <button onClick={downloadKeys}>Download Keys</button>
            {keys.map((key, index) => (
              <div className='csvfile' key={index}>
                <p>Private key {index + 1}: {key.privateKey}</p>
                <p>Public address {index + 1}: {key.address}</p>
              </div>
            ))}
          </>
        }
      </div>
    </>
  );
}

export default App;
