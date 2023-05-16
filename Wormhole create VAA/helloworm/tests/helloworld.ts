import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  Keypair,
  PublicKey
} from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import {createInitializeInstruction, 
  createSendMessageInstruction, 
  deriveWormholeMessageKey, 
  createRegisterForeignEmitterInstruction, 
  getForeignEmitterData,
  createReceiveMessageInstruction,
  getReceivedData,
} from './needed';
const Web3 = require('web3');
import { HelloWorld } from "../target/types/hello_world";
import {boilerPlateReduction, CORE_BRIDGE_PID} from "./hepler"
import * as wormhole from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
import * as w from "@certusone/wormhole-sdk";
import { CHAINS, parseVaa } from "@certusone/wormhole-sdk";
import { expect } from "chai";
import * as mock from "@certusone/wormhole-sdk/lib/cjs/mock";
import { getProgramSequenceTracker } from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
import { getPostMessageCpiAccounts} from "@certusone/wormhole-sdk/lib/cjs/solana";
import {ethers} from "ethers"
const connection = new Connection('https://api.devnet.solana.com');

const payer = Keypair.fromSecretKey(new Uint8Array([13,82,117,67,249,64,150,31,116,67,234,152,255,109,62,111,35,170,11,56,65,18,157,242,80,97,246,84,1,65,149,181,67,249,215,33,158,135,96,152,226,28,89,211,255,248,42,118,35,1,14,106,86,195,183,2,96,13,139,199,238,239,157,74]));

const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

describe("helloworm", () => {

    anchor.setProvider(anchor.AnchorProvider.env());

    // const realForeignEmitterAddress = Buffer.alloc(32, "deadbeef", "hex");
    const realForeignEmitterAddress = Buffer.alloc(32, "deadbeef", "hex");
    const realForeignEmitterChain = CHAINS.ethereum;

    const {
        requestAirdrop,
        guardianSign,
        postSignedMsgAsVaaOnSolana,
        expectIxToSucceed,
        expectIxToFailWithError,
      } = boilerPlateReduction(connection, payer);

    // it("Is initialized!", async () => {
    //     const createInitializeIx = () => createInitializeInstruction(
    //         connection,
    //         program.programId,
    //         payer.publicKey,
    //         CORE_BRIDGE_PID,
    //         );

    //     await expectIxToSucceed(createInitializeIx());
    // });

    
    // [
    //     Buffer.alloc(32, "deadbeef", "hex"),
    //     realForeignEmitterAddress,
    // ].forEach((emitterAddress) =>
    // it(`Register ${emitterAddress === realForeignEmitterAddress ? "Final" : "Random"} Emitter`,
    //     async function() {
    //         await expectIxToSucceed(
    //             createRegisterForeignEmitterInstruction(
    //             connection,
    //             program.programId,
    //             payer.publicKey,
    //             realForeignEmitterChain,
    //             emitterAddress
    //             )
    //         );
    
    //         const {chain, address} = 
    //             await getForeignEmitterData(
    //             connection,
    //             program.programId,
    //             realForeignEmitterChain
    //             );

    //         console.log(chain, new PublicKey(address))

    //         // expect(chain).equals(realForeignEmitterChain);
    //         // expect(address).deep.equals(emitterAddress);
    // })
    // );

    type MessageTransfer = {
        from: ethers.Wallet["publicKey"],
        to: ethers.Wallet["publicKey"],
        tokenAddess: ethers.Wallet["publicKey"],
        amount: number,
    }


    type MessageCallData = {
      to: ethers.Wallet["publicKey"],
      v1: number,
      v2: number,
    }

    const messageCallData: MessageCallData = {
      to: "0xA093009243dD89168F9e293554aA57eF197b7fd7",
      v1: 2,
      v2: 3,
    }

    // const messageTransfer: MessageTransfer = {
    //     from: "0x7C77FeBC3946afa7523d16EB63963a8845b72717",
    //     to: "0x7bbE73aD24a8b329364B466C0236e8a35593acd0",
    //     tokenAddess: "0xC0Ef7dE6a76183e80BDb78294E71e49d59d13761",
    //     amount: 10000000000000000000,
    // }
    // console.log(messageTransfer.from.length)

    it("Finally Send Message", async function() {
        const jsonString = JSON.stringify(messageCallData);
        let helloMessage = Buffer.from(jsonString, 'utf8');
        helloMessage = Buffer.concat([Buffer.from(new Uint8Array([127])), helloMessage]);
        // save message count to grab posted message later
        const sequence = (
          await wormhole.getProgramSequenceTracker(connection, program.programId, CORE_BRIDGE_PID)
        ).value() - 1n;

        console.log(sequence);

        await expectIxToSucceed(
            createSendMessageInstruction(
            connection,
            program.programId,
            payer.publicKey,
            CORE_BRIDGE_PID,
            helloMessage
            )
        );

        // const messageKey = deriveWormholeMessageKey(program.programId, sequence);
        // const {payload} =
        //     (await wormhole.getPostedMessage(
        //     connection,
        //     messageKey
        //     )).message;
        
        // console.log(payload.toString())

        // expect(payload.readUint8(0)).equals(1); // payload ID
        // expect(payload.readUint16BE(1)).equals(helloMessage.length);
        // expect(payload.subarray(3)).deep.equals(helloMessage);
      });

    // it("Finally Receive Message", async function() {
    //   // const WORMHOLE_RPC_HOST = "https://wormhole-v2-testnet-api.certus.one"
    //   // const sequence = "15";

    //   // const emitterAddress = w.getEmitterAddressSolana(new PublicKey("AojD1yubXcLNTBgXLbHCJV3GMeZk3TjpdiHWd8JbgtmN"));
    //   // console.log(emitterAddress);

    //   // const  vaaBytes  = await w.getSignedVAA(
    //   //   WORMHOLE_RPC_HOST,
    //   //   w.CHAIN_ID_SOLANA,
    //   //   emitterAddress,
    //   //   sequence
    //   // );

    //   // console.log(vaaBytes)
    //   const [emitter, _] = await PublicKey.findProgramAddressSync(
    //     [Buffer.from("emitter")],
    //     program.programId
    //   )
    //   console.log(emitter)

    //   const [sequence, bump] = await PublicKey.findProgramAddressSync(
    //     [Buffer.from("Sequence"), emitter.toBytes()],
    //     CORE_BRIDGE_PID,
    //   )
    //   console.log(sequence);

    //   const [fee_collector, bump1] = await PublicKey.findProgramAddressSync(
    //     [Buffer.from("config")],
    //     program.programId,
    //   )
    //   console.log(fee_collector.toBase58());

    //   const messageKey = deriveWormholeMessageKey(program.programId, 1n);
      
    //   console.log(messageKey);
    //   const s = (await wormhole.getProgramSequenceTracker(connection, program.programId, CORE_BRIDGE_PID)
    //         ).value();
      
    //         console.log(s);
    // })

    // it("Test", async function() {
    //   const input = "5di1wdqZmLKbjfa41QiEH96SUiqQNFsWLtXzFhgV2FJF";

    //   // Convert each character in the input string to its ASCII code in decimal
    //   const asciiCodes = [];
    //   for (let i = 0; i < input.length; i++) {
    //     asciiCodes.push(input.charCodeAt(i));
    //   }

    //   // Convert the ASCII codes to their corresponding hexadecimal representation
    //   const hexArray = asciiCodes.map((code) => {
    //     const hex = code.toString(16);
    //     return hex.length === 1 ? "0" + hex : hex;
    //   });

    //   // Join the hexadecimal values together to form the final string
    //   const hexString = hexArray.join("");
    //   console.log(hexString);

    //   const input1 = "AQAAAAABAEMzh4LjVgCUi2GzFnijA+qd9S156uAJzKuLfB0rAJ4oVZ+m6fheXrM0MH0z8WfPjSrEkmzIZZ4pTnOkovFG4J8AZEiWUAAAAAAAAUTWCLcYJn4Sk6CtG3mkNOsOfPqUI+QYpVjfqc40wfUoAAAAAAAAAA8BAQAeQWxsIHlvdXIgYmFzZSBhcmUgYmVsb25nIHRvIHVz";

    //   // Decode the Base64 string into a Uint8Array
    //   const base64Decoded = Uint8Array.from(atob(input), c => c.charCodeAt(0));

    //   // Convert the Uint8Array to a hexadecimal string
    //   const hexString1 = Array.from(base64Decoded).map((byte) => {
    //     return ("0" + byte.toString(16)).slice(-2);
    //   }).join("");

    //   console.log(hexString1);
    // })
});
