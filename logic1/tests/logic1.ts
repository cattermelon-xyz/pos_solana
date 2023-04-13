import { Program } from "@project-serum/anchor";
import { Logic1 } from "../target/types/logic1";
import * as anchor from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";


describe("logic1", async () => {
  const provider = anchor.AnchorProvider.local("https://api.devnet.solana.com");
  anchor.setProvider(provider);

  const keypair =  web3.Keypair.fromSecretKey(
    Uint8Array.from([226,37,2,35,123,147,47,122,244,62,213,197,123,40,160,147,126,68,13,60,104,70,58,233,126,239,228,59,254,191,142,46,168,9,104,9,158,127,18,6,104,44,201,175,111,13,100,80,208,156,243,41,166,103,23,23,224,12,223,70,144,2,218,191])
  )
  
  const logic1Program = anchor.workspace.Logic1 as Program<Logic1>;
  let option = 4;


  it("test init", async () => {
    // Add your test here.
    console.log("hehe1");
    await logic1Program.methods.vote(option).accounts({
      owner: keypair.publicKey,
    }).rpc()
    console.log("hehe2");
  });
});
