// import * as anchor from "@coral-xyz/anchor";
// import * as web3 from "@solana/web3.js";
// import { Program } from "@coral-xyz/anchor";
// import { Helloworm } from "../target/types/helloworm";
// import * as wormhole from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
// import { deriveWormholeEmitterKey } from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
// import { Commitment, Connection, PublicKeyInitData } from "@solana/web3.js";
// import {getSequenceTracker} from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
// var utils_1 = require("@certusone/wormhole-sdk/lib/cjs/solana/utils");
// import { getProgramSequenceTracker, deriveEmitterSequenceKey } from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
// import {
//   deriveAddress,
//   getPostMessageCpiAccounts,
// } from "@certusone/wormhole-sdk/lib/cjs/solana";

// export function deriveWormholeMessageKey(
//   programId: PublicKeyInitData,
//   sequence: bigint
// ) {
//   return deriveAddress(
//     [
//       Buffer.from("sent"),
//       (() => {
//         const buf = Buffer.alloc(8);
//         buf.writeBigUInt64LE(sequence);
//         return buf;
//       })(),
//     ],
//     programId
//   );
// }

// describe("helloworm", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   const connection = new web3.Connection("https://api.devnet.solana.com ");

//   const program = anchor.workspace.Helloworm as Program<Helloworm>;
  
//   const payer = web3.Keypair.fromSecretKey(new Uint8Array([13,82,117,67,249,64,150,31,116,67,234,152,255,109,62,111,35,170,11,56,65,18,157,242,80,97,246,84,1,65,149,181,67,249,215,33,158,135,96,152,226,28,89,211,255,248,42,118,35,1,14,106,86,195,183,2,96,13,139,199,238,239,157,74]));
//   it("Is initialized!", async () => {

//     const core_bridge = new web3.PublicKey("3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5")
    
//     // const message = web3.Keypair.generate();
    
//     let [emitter, bump1] =  await web3.PublicKey.findProgramAddress(
//       [Buffer.from("emitter")],
//       program.programId,
//     )
//     const realConfig = deriveAddress([Buffer.from("config")], program.programId);

//     const wormholeCpi = getPostMessageCpiAccounts(
//       program.programId,
//       core_bridge,
//       payer.publicKey,
//       deriveAddress([Buffer.from("alive")], program.programId)
//     );

//     // const realInitializeAccounts = {
//     //   owner: payer.publicKey,
//     //   config: realConfig,
//     //   wormholeProgram: core_bridge,
//     //   wormholeBridge: wormholeCpi.wormholeBridge,
//     //   wormholeFeeCollector: wormholeCpi.wormholeFeeCollector,
//     //   wormholeEmitter: wormholeCpi.wormholeEmitter,
//     //   wormholeSequence: wormholeCpi.wormholeSequence,
//     //   wormholeMessage: wormholeCpi.wormholeMessage,
//     //   clock: wormholeCpi.clock,
//     //   rent: wormholeCpi.rent,
//     // };

//     console.log(wormholeCpi)

//     const account_info = await connection.getAccountInfo((emitter, core_bridge))
    
//     console.log(account_info)
//     const message = await getProgramSequenceTracker(
//         connection,
//         program.programId,
//         core_bridge,
//       ).then((tracker) =>
//         deriveWormholeMessageKey(program.programId, tracker.sequence + 1n)
//     );
    
//     // let [bridge, bump0] =  await web3.PublicKey.findProgramAddress(
//     //   [Buffer.from("Bridge")],
//     //   core_bridge,
//     // )
    
//     // let [sequence, bump2] =  await web3.PublicKey.findProgramAddress(
//     //   [Buffer.from("Sequence"), emitter.toBytes()],
//     //   core_bridge,
//     // )
//     // console.log("sequence: ", sequence.toBase58()) 
    
//     // let [fee_collector, bump3] =  await web3.PublicKey.findProgramAddress(
//     //   [Buffer.from("fee_collector")],
//     //   core_bridge,
//     // )
        
//     // const tx = await program.methods
//     // .initialize(Buffer.from(new Uint8Array([1])))
//     // .accounts({
//     //   coreBridge: core_bridge,
//     //   bridge: bridge,
//     //   message: message.publicKey,
//     //   emitter: emitter,
//     //   sequence: sequence,
//     //   payer: payer.publicKey,
//     //   feeCollector: fee_collector,
//     //   clock: web3.SYSVAR_CLOCK_PUBKEY,
//     //   systemProgram: anchor.web3.SystemProgram.programId,
//     //   rent: web3.SYSVAR_RENT_PUBKEY,
//     // })
//     // .signers([payer, message])
//     // .rpc({
//     //   skipPreflight: true,
//     // })

//   });
// });
