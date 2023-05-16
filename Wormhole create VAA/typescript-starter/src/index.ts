import * as web3 from "@solana/web3.js";
import * as wormhole from "@certusone/wormhole-sdk";
import { TransactionResponse } from "@solana/web3.js";
import { utils, ethers } from "ethers";


function hexToUint8Array(hexString: string, length: number): Uint8Array {
    if (hexString.length !== length * 2) {
      throw new Error(
        `Invalid hex string length. Expected ${length * 2} characters.`
      );
    }
    const byteArray = new Uint8Array(length);
    for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
      byteArray[j] = parseInt(hexString.slice(i, i + 2), 16);
    }
    return byteArray;
  }

function base64ToUint8Array(base64String: string): Uint8Array {
  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

const connection = new web3.Connection(
    "https://api.devnet.solana.com",
    "confirmed"
);

const address = "0xBb28F10Ea23f664400C9c2D5779Ef59eE9E61E0d";
const ethAddress = hexToUint8Array(address.slice(2), 20);

const keypair = web3.Keypair.fromSecretKey(Uint8Array.from([13,82,117,67,249,64,150,31,116,67,234,152,255,109,62,111,35,170,11,56,65,18,157,242,80,97,246,84,1,65,149,181,67,249,215,33,158,135,96,152,226,28,89,211,255,248,42,118,35,1,14,106,86,195,183,2,96,13,139,199,238,239,157,74]));
const fromAddress = new web3.PublicKey("28j6MNzmAN2izdoHPxWShkUkCVyYFVUvqSrYwq5bG33c");
const mint = new web3.PublicKey("GqHnEhSpabhMw4qArSGzt9vz2xz58gD9RndPuKJqGWz3");

const SOL_BRIDGE_ADDRESS = "3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5";
const SOL_TOKEN_BRIDGE_ADDRESS = "DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe";
const ETH_TOKEN_BRIDGE_ADDRESS = "0x0290FB167208Af455bB137780163b7B7a9a10C16";
const WORMHOLE_RPC_HOST = "https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/1/3b26409f8aaded3f5ddca184695aa6a0fa829b0c85caf84856324896d214ca98/7926";


const transfer = async () => {
    const transaction = await wormhole.transferFromSolana(
        connection,
        SOL_BRIDGE_ADDRESS,
        SOL_TOKEN_BRIDGE_ADDRESS,
        keypair.publicKey,
        fromAddress,
        mint,
        BigInt(1),
        ethAddress,
        wormhole.CHAIN_ID_ETH,
    );

    
    transaction.partialSign(keypair);
    const txid = await connection.sendRawTransaction(transaction.serialize(), {skipPreflight:true});
    await connection.confirmTransaction(txid);

    // const txid = "4a2noBVzBeev71XdRmduiXCRmHGmvDiNWERqvacg6qmQbq7gQyZmPQye3CboyqZWxjBsHxuVjEKNf8Ts7pmVU4e3";
    const info = await connection.getTransaction(txid);
    const transactionRespone = info as TransactionResponse;

    const sequence = wormhole.parseSequenceFromLogSolana(transactionRespone);
    console.log(sequence);

    const emitterAddress = wormhole.getEmitterAddressSolana(SOL_TOKEN_BRIDGE_ADDRESS);
    console.log(emitterAddress);

    // RPC querry api: WORMHOLE_RPC_HOST/v1/signed_vaa/CHAIN_ID_SOLANA/emitterAddress/sequence

    // Fetch the signedVAA from the Wormhole Network (this may require retries while you wait for confirmation)
    // const signedVAA  = await wormhole.getSignedVAA(
    //   WORMHOLE_RPC_HOST,
    //   wormhole.CHAIN_ID_SOLANA,
    //   emitterAddress,
    //   sequence
    // );

    // console.log(signedVAA);
    // const base64String = "AQAAAAABAG5yde/nhl6bmNp7gqopckGW8CWHQ1j3DQfyfdOgbGh2Yigf6gmqTKp34FPn6izm8/50TxFOWZxDWfw9umtVb5UBZENYoAAAb8YAATsmQJ+Kre0/XdyhhGlapqD6gpsMhcr4SFYySJbSFMqYAAAAAAAAHvYgAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6z4n5ptc32y/fqWsQS0G/YIiN8+5sN56MyG/qX0oWXgAAbso8Q6iP2ZEAMnC1Xee9Z7p5h4NAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
    // const signedVAA = base64ToUint8Array(base64String);
    // const URL = "https://eth-goerli.g.alchemy.com/v2/flDa5U0m2g843wmEXbvI1bB-vfQ3omms"
    // const provider = new ethers.providers.JsonRpcProvider(URL);
    // const signer = new ethers.Wallet("2c242603d781433fb96e970c3ffad9c13a1cff883a4961b5acf7a1adc52194b4", provider);

    // await wormhole.createWrappedOnEth(ETH_TOKEN_BRIDGE_ADDRESS, signer, signedVAA);
};

transfer();

//

// function hexToBytes(hex: string): Uint8Array {
//     if (hex.length % 2 !== 0) {
//         throw new Error('Invalid hex string length.');
//     }

//     const byteLength = hex.length / 2;
//     const bytes = new Uint8Array(byteLength);

//     for (let i = 0; i < byteLength; i++) {
//         const byteHex = hex.substr(i * 2, 2);
//         bytes[i] = parseInt(byteHex, 16);
//     }

//     return bytes;
// }
// class MessageData {

//     nonce: number; // u32
//     payload: Uint8Array; // Vec<u8>

//     constructor(
//         nonce: number,
//         payload: Uint8Array
//     ) {
//         this.nonce = nonce;
//         this.payload = payload;
//     }
// }

// function deserializeMessageData(hex: string): MessageData {
//     const buffer = hexToBytes(hex);
//     const view = new DataView(buffer.buffer);

//     let offset = 8;

//     const nonce = view.getUint8(offset);
//     offset += 4;

//     const payload = new Uint8Array(buffer.slice(offset))

//     return new MessageData(

//         nonce,
//         payload,
//     );
// }

// const hexString = '01c66f000085000000010000000000000000000000000000000000000000000000000000000000000001eb3e27e69b5cdf6cbf7ea5ac412d06fd822237cfb9b0de7a3321bfa97d2859780001bb28f10ea23f664400c9c2d5779ef59ee9e61e0d0000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000001';

// const messageData = deserializeMessageData(hexString);
// console.log(messageData);


// const utf8Decoder = new TextDecoder('utf-8');
// const payloadString = utf8Decoder.decode(messageData.payload);
// console.log(payloadString);